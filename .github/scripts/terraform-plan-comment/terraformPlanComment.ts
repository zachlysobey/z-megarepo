import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { buildPlanCommentBody } from './buildPlanCommentBody.ts';
import { upsertComment } from './upsertComment.ts';

const execAsync = promisify(exec);

interface ActionToolkit {
  github: Parameters<typeof upsertComment>[0]['github'];
  context: Parameters<typeof upsertComment>[0]['context'];
}

interface TerraformPlanCommentOptions {
  moduleName: string;
  workingDirectory: string;
  actor: string;
  prUrl: string;
}

export async function terraformPlanComment(
  { github, context }: ActionToolkit,
  { moduleName, workingDirectory, actor, prUrl }: TerraformPlanCommentOptions,
) {
  const { stdout: planText } = await execAsync(
    'terraform show -no-color tfplan',
    { cwd: workingDirectory, maxBuffer: 1024 * 1024 },
  );

  const { marker, body } = buildPlanCommentBody({ moduleName, planText, actor, prUrl });
  await upsertComment({ github, context, marker, body });
}
