import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cli } from './cli.ts';

type FetchFn = typeof globalThis.fetch;

describe('cli', () => {
  let originalFetch: FetchFn;
  let fetchCalls: { url: string; init?: RequestInit }[];
  const savedEnv: Record<string, string | undefined> = {};
  const envKeys = ['GITHUB_TOKEN', 'GITHUB_REPOSITORY', 'GITHUB_EVENT_PATH', 'GITHUB_REF'];

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchCalls = [];
    for (const key of envKeys) {
      savedEnv[key] = process.env[key];
    }
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    process.env.GITHUB_REF = 'refs/pull/42/merge';
    delete process.env.GITHUB_EVENT_PATH;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    for (const key of envKeys) {
      if (savedEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = savedEnv[key];
      }
    }
  });

  function mockFetchOk(): void {
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      fetchCalls.push({ url, init });
      return {
        ok: true,
        status: init?.method === 'POST' ? 201 : 200,
        json: async () => [],
        text: async () => '[]',
      } as Response;
    }) as FetchFn;
  }

  it('posts a comment with --body in append mode', async () => {
    mockFetchOk();
    await cli(['--body', 'Hello world']);

    const postCall = fetchCalls.find(c => c.init?.method === 'POST');
    assert.ok(postCall);
    assert.ok(postCall.url.includes('/issues/42/comments'));
    const body = JSON.parse(postCall.init!.body as string);
    assert.equal(body.body, 'Hello world');
  });

  it('upserts a comment with --slot and --body', async () => {
    mockFetchOk();
    await cli(['--slot', 'my-slot', '--body', 'Slot content']);

    const postCall = fetchCalls.find(c => c.init?.method === 'POST');
    assert.ok(postCall);
    const body = JSON.parse(postCall.init!.body as string);
    assert.ok(body.body.includes('<!-- gh-pr-comment:my-slot -->'));
    assert.ok(body.body.includes('Slot content'));
  });

  it('reads body from --file', async () => {
    mockFetchOk();
    const tmpFile = join(tmpdir(), `test-body-${Date.now()}.txt`);
    await writeFile(tmpFile, 'File content here');

    try {
      await cli(['--file', tmpFile]);
      const postCall = fetchCalls.find(c => c.init?.method === 'POST');
      assert.ok(postCall);
      const body = JSON.parse(postCall.init!.body as string);
      assert.equal(body.body, 'File content here');
    } finally {
      await unlink(tmpFile);
    }
  });

  it('uses explicit --pr and --repo', async () => {
    mockFetchOk();
    delete process.env.GITHUB_REF;
    await cli(['--body', 'Test', '--pr', '99', '--repo', 'other/project']);

    const postCall = fetchCalls.find(c => c.init?.method === 'POST');
    assert.ok(postCall);
    assert.ok(postCall.url.includes('other/project'));
    assert.ok(postCall.url.includes('/issues/99/comments'));
  });

  it('throws when no --body or --file provided', async () => {
    mockFetchOk();
    await assert.rejects(
      () => cli([]),
      /Must specify --body or --file/,
    );
  });

  it('throws when both --body and --file provided', async () => {
    mockFetchOk();
    await assert.rejects(
      () => cli(['--body', 'text', '--file', 'path']),
      /Cannot specify both --body and --file/,
    );
  });

  it('throws when GITHUB_TOKEN is missing', async () => {
    mockFetchOk();
    delete process.env.GITHUB_TOKEN;
    await assert.rejects(
      () => cli(['--body', 'test']),
      /GITHUB_TOKEN/,
    );
  });
});
