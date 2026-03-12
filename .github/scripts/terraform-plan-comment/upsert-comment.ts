interface UpsertCommentParams {
  github: any;
  context: { repo: { owner: string; repo: string }; issue: { number: number } };
  marker: string;
  body: string;
}

export default async function upsertComment({ github, context, marker, body }: UpsertCommentParams) {
  const comments = await github.paginate(
    github.rest.issues.listComments,
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    }
  );
  const existing = comments.find((c: any) =>
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
