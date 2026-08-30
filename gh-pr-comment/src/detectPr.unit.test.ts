import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectPr } from './detectPr.ts';

describe('detectPr', () => {
  const savedEnv: Record<string, string | undefined> = {};
  const envKeys = ['GITHUB_REPOSITORY', 'GITHUB_EVENT_PATH', 'GITHUB_REF'];

  beforeEach(() => {
    for (const key of envKeys) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (savedEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = savedEnv[key];
      }
    }
  });

  it('uses explicit --pr and --repo options', async () => {
    const result = await detectPr({ pr: 42, repo: 'octocat/hello' });
    assert.deepStrictEqual(result, { owner: 'octocat', repo: 'hello', prNumber: 42 });
  });

  it('throws on invalid --repo format', async () => {
    await assert.rejects(
      () => detectPr({ pr: 1, repo: 'invalid' }),
      /Invalid --repo format/,
    );
  });

  it('detects PR number from GITHUB_EVENT_PATH', async () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    const eventFile = join(tmpdir(), `test-event-${Date.now()}.json`);
    await writeFile(eventFile, JSON.stringify({ pull_request: { number: 99 } }));
    process.env.GITHUB_EVENT_PATH = eventFile;

    try {
      const result = await detectPr();
      assert.deepStrictEqual(result, { owner: 'owner', repo: 'repo', prNumber: 99 });
    } finally {
      await unlink(eventFile);
    }
  });

  it('detects PR number from GITHUB_REF', async () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    process.env.GITHUB_REF = 'refs/pull/123/merge';

    const result = await detectPr();
    assert.deepStrictEqual(result, { owner: 'owner', repo: 'repo', prNumber: 123 });
  });

  it('throws when no repository can be detected', async () => {
    await assert.rejects(
      () => detectPr(),
      /Could not detect repository/,
    );
  });

  it('throws when no PR number can be detected', async () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';

    await assert.rejects(
      () => detectPr(),
      /Could not detect PR number/,
    );
  });

  it('uses explicit --pr with GITHUB_REPOSITORY', async () => {
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    const result = await detectPr({ pr: 55 });
    assert.deepStrictEqual(result, { owner: 'owner', repo: 'repo', prNumber: 55 });
  });
});
