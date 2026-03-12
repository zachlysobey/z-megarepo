import { describe, it } from 'node:test';
import assert from 'node:assert';
import buildCommentBody from './build-plan-comment-body.ts';

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
