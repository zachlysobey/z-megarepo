import { execSync } from 'child_process';
import buildCommentBody from './build-plan-comment-body.ts';
import upsertComment from './upsert-comment.ts';

interface ActionToolkit {
  github: Parameters<typeof upsertComment>[0]['github'];
  context: Parameters<typeof upsertComment>[0]['context'];
}

interface RunOptions {
  moduleName: string;
  workingDirectory: string;
  actor: string;
  prUrl: string;
}

export async function terraformPlanComment(
  { github, context }: ActionToolkit,
  { moduleName, workingDirectory, actor, prUrl }: RunOptions,
) {
  const planText = execSync(
    'terraform show -no-color tfplan',
    { cwd: workingDirectory, maxBuffer: 1024 * 1024 }
  ).toString();

  const { marker, body } = buildCommentBody({ moduleName, planText, actor, prUrl });
  await upsertComment({ github, context, marker, body });
}
