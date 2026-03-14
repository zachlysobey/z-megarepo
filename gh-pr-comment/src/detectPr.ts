import { readFile } from 'node:fs/promises';

interface DetectPrResult {
  owner: string;
  repo: string;
  prNumber: number;
}

interface DetectPrOptions {
  pr?: number;
  repo?: string;
}

export async function detectPr(options: DetectPrOptions = {}): Promise<DetectPrResult> {
  if (options.pr && options.repo) {
    const [owner, repo] = options.repo.split('/');
    if (!owner || !repo) {
      throw new Error(`Invalid --repo format: "${options.repo}". Expected "owner/repo".`);
    }
    return { owner, repo, prNumber: options.pr };
  }

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    throw new Error(
      'Could not detect repository. Set GITHUB_REPOSITORY or pass --repo owner/repo.',
    );
  }

  const [owner, repo] = repository.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY: "${repository}".`);
  }

  const prNumber = await detectPrNumber(options.pr);
  return { owner, repo, prNumber };
}

async function detectPrNumber(explicit?: number): Promise<number> {
  if (explicit) return explicit;

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    try {
      const raw = await readFile(eventPath, 'utf-8');
      const event = JSON.parse(raw);
      if (event.pull_request?.number) {
        return event.pull_request.number;
      }
    } catch {
      // fall through to ref-based detection
    }
  }

  const ref = process.env.GITHUB_REF;
  if (ref) {
    const match = ref.match(/^refs\/pull\/(\d+)\/merge$/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  throw new Error(
    'Could not detect PR number. Set GITHUB_EVENT_PATH, GITHUB_REF, or pass --pr.',
  );
}
