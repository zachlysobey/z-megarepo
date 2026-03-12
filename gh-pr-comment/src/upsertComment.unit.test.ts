import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { upsertComment } from './upsertComment.ts';

type FetchFn = typeof globalThis.fetch;

describe('upsertComment', () => {
  let originalFetch: FetchFn;
  let fetchCalls: { url: string; init?: RequestInit }[];

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchCalls = [];
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetch(handler: (url: string, init?: RequestInit) => { status: number; body: unknown }): void {
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      fetchCalls.push({ url, init });
      const result = handler(url, init);
      return {
        ok: result.status >= 200 && result.status < 300,
        status: result.status,
        json: async () => result.body,
        text: async () => JSON.stringify(result.body),
      } as Response;
    }) as FetchFn;
  }

  it('creates a new comment when no existing comment matches', async () => {
    mockFetch((url, init) => {
      if (init?.method === 'POST') {
        return { status: 201, body: {} };
      }
      return { status: 200, body: [] };
    });

    await upsertComment({
      token: 'test-token',
      owner: 'owner',
      repo: 'repo',
      prNumber: 1,
      slot: 'test-slot',
      body: 'Hello',
    });

    assert.equal(fetchCalls.length, 2);
    const postCall = fetchCalls.find(c => c.init?.method === 'POST');
    assert.ok(postCall);
    const postBody = JSON.parse(postCall.init!.body as string);
    assert.ok(postBody.body.includes('<!-- gh-pr-comment:test-slot -->'));
    assert.ok(postBody.body.includes('Hello'));
  });

  it('updates an existing comment when marker matches', async () => {
    const existingComment = {
      id: 42,
      user: { type: 'Bot' },
      body: '<!-- gh-pr-comment:test-slot -->\nOld content',
    };

    mockFetch((url, init) => {
      if (init?.method === 'PATCH') {
        return { status: 200, body: {} };
      }
      return { status: 200, body: [existingComment] };
    });

    await upsertComment({
      token: 'test-token',
      owner: 'owner',
      repo: 'repo',
      prNumber: 1,
      slot: 'test-slot',
      body: 'Updated',
    });

    const patchCall = fetchCalls.find(c => c.init?.method === 'PATCH');
    assert.ok(patchCall);
    assert.ok(patchCall.url.includes('/comments/42'));
    const patchBody = JSON.parse(patchCall.init!.body as string);
    assert.ok(patchBody.body.includes('Updated'));
  });

  it('paginates through comments to find marker', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      user: { type: 'User' },
      body: `comment ${i}`,
    }));

    const page2 = [{
      id: 200,
      user: { type: 'Bot' },
      body: '<!-- gh-pr-comment:deep-slot -->\nFound it',
    }];

    let listCallCount = 0;
    mockFetch((url, init) => {
      if (init?.method === 'PATCH') {
        return { status: 200, body: {} };
      }
      listCallCount++;
      return { status: 200, body: listCallCount === 1 ? page1 : page2 };
    });

    await upsertComment({
      token: 'test-token',
      owner: 'owner',
      repo: 'repo',
      prNumber: 1,
      slot: 'deep-slot',
      body: 'Updated deep',
    });

    assert.equal(listCallCount, 2);
    const patchCall = fetchCalls.find(c => c.init?.method === 'PATCH');
    assert.ok(patchCall);
    assert.ok(patchCall.url.includes('/comments/200'));
  });

  it('throws on API error', async () => {
    mockFetch(() => ({ status: 403, body: 'Forbidden' }));

    await assert.rejects(
      () => upsertComment({
        token: 'bad-token',
        owner: 'owner',
        repo: 'repo',
        prNumber: 1,
        slot: 'test',
        body: 'Hello',
      }),
      /GitHub API error 403/,
    );
  });
});
