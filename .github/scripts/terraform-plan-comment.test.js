const { describe, it } = require('node:test');
const assert = require('node:assert');
const { buildCommentBody, upsertComment } = require('./terraform-plan-comment');

describe('buildCommentBody', () => {
  const baseParams = {
    moduleName: 'cloud-dev-vm',
    planText: 'No changes. Infrastructure is up-to-date.',
    actor: 'testuser',
    prUrl: 'https://github.com/test/repo/pull/1',
  };

  it('includes the marker comment', () => {
    const { marker } = buildCommentBody(baseParams);
    assert.strictEqual(marker, '<!-- tf-plan:cloud-dev-vm -->');
  });

  it('includes the marker in the body', () => {
    const { marker, body } = buildCommentBody(baseParams);
    assert.ok(body.includes(marker));
  });

  it('includes the module name in the heading', () => {
    const { body } = buildCommentBody(baseParams);
    assert.ok(body.includes('#### Terraform Plan — `cloud-dev-vm`'));
  });

  it('includes the plan text in a code block', () => {
    const { body } = buildCommentBody(baseParams);
    assert.ok(body.includes('```\nNo changes. Infrastructure is up-to-date.\n```'));
  });

  it('includes the actor and PR URL', () => {
    const { body } = buildCommentBody(baseParams);
    assert.ok(body.includes('*Triggered by @testuser in https://github.com/test/repo/pull/1*'));
  });

  it('truncates long plan text', () => {
    const longPlan = 'x'.repeat(70000);
    const { body } = buildCommentBody({ ...baseParams, planText: longPlan });
    assert.ok(body.includes('... (truncated, see Actions log for full output)'));
    assert.ok(body.length < 70000);
  });

  it('does not truncate plan text under the limit', () => {
    const { body } = buildCommentBody(baseParams);
    assert.ok(!body.includes('truncated'));
  });
});

describe('upsertComment', () => {
  function makeGithub({ existingComments = [] } = {}) {
    const calls = { created: [], updated: [] };
    return {
      calls,
      github: {
        paginate: async () => existingComments,
        rest: {
          issues: {
            listComments: {},
            createComment: async (params) => { calls.created.push(params); },
            updateComment: async (params) => { calls.updated.push(params); },
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
