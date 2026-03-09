# Node.js development conventions

## Use 'Promises' modules over synchronous versions where they exist

Prefer async/await-friendly promise-based APIs to avoid blocking the
event loop and improve performance. Even where event loop blocking or
performance aren't concerns, a single consistent approach is
preferable.

Avoid:

```js
import { readFileSync } from 'node:fs';
const content = readFileSync('file.txt', 'utf8');
```

Prefer:

```js
import { readFile } from 'node:fs/promises';
const content = await readFile('file.txt', 'utf8');
```

## Wrap callback-based async functions with `promisify` when 'Promises' versions do not exist

When no promise-based API exists, use `promisify` to wrap
callback-based functions for consistent async/await usage.

Avoid:

```js
import { exec } from 'node:child_process';

exec('some-command', (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(stdout);
});
```

Prefer:

```js
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);
const { stdout } = await execAsync('some-command');
console.log(stdout);
```

## Other Node.js-specific conventions

- [Node Version Management Guide](./node-version-management-guide.md)
- [`.npmrc` guidance](./npmrc-guidance.md)
- [JavaScript module conventions](./js-module-conventions.md)
- [Testing guide](./testing-guide.md)
- [NPM run-script conventions](./npm-run-script-conventions.md)
