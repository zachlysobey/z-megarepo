interface UpsertCommentParams {
  token: string;
  owner: string;
  repo: string;
  prNumber: number;
  slot: string;
  body: string;
}

interface GitHubComment {
  id: number;
  user: { type: string } | null;
  body?: string;
}

export async function upsertComment({ token, owner, repo, prNumber, slot, body }: UpsertCommentParams): Promise<void> {
  const marker = `<!-- gh-pr-comment:${slot} -->`;
  const fullBody = `${marker}\n${body}`;

  const existing = await findCommentByMarker({ token, owner, repo, prNumber, marker });

  if (existing) {
    await updateComment({ token, owner, repo, commentId: existing.id, body: fullBody });
  } else {
    await postComment({ token, owner, repo, prNumber, body: fullBody });
  }
}

async function findCommentByMarker(
  { token, owner, repo, prNumber, marker }: { token: string; owner: string; repo: string; prNumber: number; marker: string },
): Promise<GitHubComment | undefined> {
  let page = 1;
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
    }

    const comments: GitHubComment[] = await res.json();
    if (comments.length === 0) break;

    const found = comments.find(
      c => c.user?.type === 'Bot' && c.body?.includes(marker),
    );
    if (found) return found;

    if (comments.length < 100) break;
    page++;
  }

  return undefined;
}

async function postComment(
  { token, owner, repo, prNumber, body }: { token: string; owner: string; repo: string; prNumber: number; body: string },
): Promise<void> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
}

async function updateComment(
  { token, owner, repo, commentId, body }: { token: string; owner: string; repo: string; commentId: number; body: string },
): Promise<void> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
}
