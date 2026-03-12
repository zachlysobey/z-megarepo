interface IssueComment {
  id: number;
  user: { type: string };
  body: string;
}

interface GitHubClient {
  paginate: (method: object, params: object) => Promise<IssueComment[]>;
  rest: {
    issues: {
      listComments: object;
      createComment: (params: { owner: string; repo: string; issue_number: number; body: string }) => Promise<void>;
      updateComment: (params: { owner: string; repo: string; comment_id: number; body: string }) => Promise<void>;
    };
  };
}

interface GitHubContext {
  repo: { owner: string; repo: string };
  issue: { number: number };
}

interface UpsertCommentParams {
  github: GitHubClient;
  context: GitHubContext;
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
