const { execSync } = require('child_process');

const MAX_LEN = 60000;

function buildCommentBody({ moduleName, planText, actor, prUrl }) {
  const truncated = planText.length > MAX_LEN
    ? planText.substring(0, MAX_LEN) + '\n... (truncated, see Actions log for full output)'
    : planText;

  const marker = `<!-- tf-plan:${moduleName} -->`;
  const body = [
    marker,
    `#### Terraform Plan — \`${moduleName}\``,
    '',
    '```',
    truncated,
    '```',
    '',
    `*Triggered by @${actor} in ${prUrl}*`
  ].join('\n');

  return { marker, body };
}

async function upsertComment({ github, context, marker, body }) {
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
}

async function run({ github, context, core }, { moduleName, workingDirectory, actor, prUrl }) {
  const planText = execSync(
    'terraform show -no-color tfplan',
    { cwd: workingDirectory, maxBuffer: 1024 * 1024 }
  ).toString();

  const { marker, body } = buildCommentBody({ moduleName, planText, actor, prUrl });
  await upsertComment({ github, context, marker, body });
}

module.exports = run;
module.exports.buildCommentBody = buildCommentBody;
module.exports.upsertComment = upsertComment;
