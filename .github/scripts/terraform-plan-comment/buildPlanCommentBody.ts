const MAX_LEN = 60000;

interface BuildPlanCommentBodyParams {
  moduleName: string;
  planText: string;
  actor: string;
  prUrl: string;
}

export function buildPlanCommentBody({ moduleName, planText, actor, prUrl }: BuildPlanCommentBodyParams) {
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
    `*Triggered by @${actor} in ${prUrl}*`,
  ].join('\n');

  return { marker, body };
}
