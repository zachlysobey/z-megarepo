import { describe, it } from 'node:test';
import assert from 'node:assert';
import upsertComment from './upsert-comment.ts';

describe('upsertComment', () => {
  function makeGithub({ existingComments = [] as any[] } = {}) {
    const calls = { created: [] as any[], updated: [] as any[] };
    return {
      calls,
      github: {
        paginate: async () => existingComments,
        rest: {
          issues: {
            listComments: {},
            createComment: async (params: any) => { calls.created.push(params); },
            updateComment: async (params: any) => { calls.updated.push(params); },
          },
        },
      },
    };
  }

  const context = { repo: { owner: 'test-owner', repo: 'test-repo' }, issue: { number: 42 } };
  const marker = '<!-- tf-plan:test -->';
  const body = 'test body';

  it('creates a new comment when none exists', async () => {
    const { github, calls } = makeGithub();
    await upsertComment({ github, context, marker, body });
    assert.strictEqual(calls.created.length, 1);
    assert.strictEqual(calls.updated.length, 0);
    assert.strictEqual(calls.created[0].body, 'test body');
    assert.strictEqual(calls.created[0].issue_number, 42);
  });

  it('updates existing bot comment with matching marker', async () => {
    const { github, calls } = makeGithub({
      existingComments: [
        { id: 99, user: { type: 'Bot' }, body: '<!-- tf-plan:test --> old content' },
      ],
    });
    await upsertComment({ github, context, marker, body });
    assert.strictEqual(calls.updated.length, 1);
    assert.strictEqual(calls.created.length, 0);
    assert.strictEqual(calls.updated[0].comment_id, 99);
    assert.strictEqual(calls.updated[0].body, 'test body');
  });

  it('ignores non-bot comments with matching marker', async () => {
    const { github, calls } = makeGithub({
      existingComments: [
        { id: 50, user: { type: 'User' }, body: '<!-- tf-plan:test --> user comment' },
      ],
    });
    await upsertComment({ github, context, marker, body });
    assert.strictEqual(calls.created.length, 1);
    assert.strictEqual(calls.updated.length, 0);
  });

  it('ignores bot comments with different marker', async () => {
    const { github, calls } = makeGithub({
      existingComments: [
        { id: 77, user: { type: 'Bot' }, body: '<!-- tf-plan:other --> different module' },
      ],
    });
    await upsertComment({ github, context, marker, body });
    assert.strictEqual(calls.created.length, 1);
    assert.strictEqual(calls.updated.length, 0);
  });
});
