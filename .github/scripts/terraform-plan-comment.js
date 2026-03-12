const { execSync } = require('child_process');

module.exports = async ({ github, context, core }, { moduleName, workingDirectory, actor, prUrl }) => {
  const plan = execSync(
    'terraform show -no-color tfplan',
    { cwd: workingDirectory, maxBuffer: 1024 * 1024 }
  ).toString();

  const MAX_LEN = 60000;
  const planText = plan.length > MAX_LEN
    ? plan.substring(0, MAX_LEN) + '\n... (truncated, see Actions log for full output)'
    : plan;

  const marker = `<!-- tf-plan:${moduleName} -->`;
  const body = [
    marker,
    `#### Terraform Plan — \`${moduleName}\``,
    '',
    '```',
    planText,
    '```',
    '',
    `*Triggered by @${actor} in ${prUrl}*`
  ].join('\n');

  const comments = await github.paginate(
    github.rest.issues.listComments,
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    }
  );
  const existing = comments.find(c =>
    c.user.type === 'Bot' && c.body.includes(marker)
  );
  if (existing) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existing.id,
      body,
    });
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body,
    });
  }
};
