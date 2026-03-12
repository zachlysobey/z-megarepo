import { execSync } from 'child_process';
import buildCommentBody from './build-plan-comment-body.ts';
import upsertComment from './upsert-comment.ts';

interface ActionToolkit {
  github: Parameters<typeof upsertComment>[0]['github'];
  context: Parameters<typeof upsertComment>[0]['context'];
  core: { info: (msg: string) => void; warning: (msg: string) => void };
}

interface RunOptions {
  moduleName: string;
  workingDirectory: string;
  actor: string;
  prUrl: string;
}

export default async function run(
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
