import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { detectPr } from './detectPr.ts';
import { upsertComment } from './upsertComment.ts';
import { createComment } from './createComment.ts';

interface ParsedArgs {
  slot?: string;
  body?: string;
  file?: string;
  pr?: number;
  repo?: string;
}

export async function cli(argv: string[] = process.argv.slice(2)): Promise<void> {
  const args = parseCliArgs(argv);
  const body = await resolveBody(args);
  const token = requireToken();
  const { owner, repo, prNumber } = await detectPr({ pr: args.pr, repo: args.repo });

  if (args.slot) {
    await upsertComment({ token, owner, repo, prNumber, slot: args.slot, body });
  } else {
    await createComment({ token, owner, repo, prNumber, body });
  }
}

function parseCliArgs(argv: string[]): ParsedArgs {
  const { values } = parseArgs({
    args: argv,
    options: {
      slot: { type: 'string' },
      body: { type: 'string' },
      file: { type: 'string' },
      pr: { type: 'string' },
      repo: { type: 'string' },
    },
    strict: true,
  });

  return {
    slot: values.slot,
    body: values.body,
    file: values.file,
    pr: values.pr ? parseInt(values.pr, 10) : undefined,
    repo: values.repo,
  };
}

async function resolveBody(args: ParsedArgs): Promise<string> {
  if (args.body && args.file) {
    throw new Error('Cannot specify both --body and --file.');
  }
  if (args.file) {
    return await readFile(args.file, 'utf-8');
  }
  if (args.body) {
    return args.body;
  }
  throw new Error('Must specify --body or --file.');
}

function requireToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required.');
  }
  return token;
}
