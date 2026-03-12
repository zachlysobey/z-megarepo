import { execSync } from 'child_process';
import buildCommentBody from './build-plan-comment-body.ts';
import upsertComment from './upsert-comment.ts';

export default async function run(
  { github, context, core }: { github: any; context: any; core: any },
  { moduleName, workingDirectory, actor, prUrl }: { moduleName: string; workingDirectory: string; actor: string; prUrl: string },
) {
  const planText = execSync(
    'terraform show -no-color tfplan',
    { cwd: workingDirectory, maxBuffer: 1024 * 1024 }
  ).toString();

  const { marker, body } = buildCommentBody({ moduleName, planText, actor, prUrl });
  await upsertComment({ github, context, marker, body });
}
