# Draft Conventions

Potential conventions to add to the JavaScript module and Node.js conventions files.

## For `js-module-conventions.md`

### Import Ordering

Organize imports consistently: Node.js built-ins first, then npm packages, then local imports. This improves scanability and reduces merge conflicts.

Avoid:

```js
import { helperA } from './helpers.js';
import fs from 'node:fs';
import { something } from 'some-package';
import { readFile } from 'node:fs/promises';
```

Prefer:

```js
import { readFile } from 'node:fs/promises';
import { something } from 'some-package';
import { helperA } from './helpers.js';
```

### Barrel Exports

Use index files for re-exporting only when it provides clear value. Barrel files can enable cleaner imports but can also create circular dependency issues and impact tree-shaking.

### Explicit Re-exports

When re-exporting from other modules, be explicit about what you're exporting rather than using wildcard exports. This improves discoverability and prevents accidentally exporting unintended items.

Avoid:

```js
export * from './utils.js';
```

Prefer:

```js
export { helperA, helperB } from './utils.js';
```

## For `nodejs-conventions.md`

### Error Handling in Async Contexts

Establish consistent patterns for error handling in promise chains or async/await contexts. Ensure errors are properly propagated and not silently swallowed.

### File Extensions in ESM

In Node.js ESM, file extensions must be explicitly included in import statements. Use `.js` extensions even when importing TypeScript files (the extension refers to the compiled output).

Avoid:

```js
import { helper } from './helper';
```

Prefer:

```js
import { helper } from './helper.js';
```

### Top-Level Await Considerations

Understand when and how to use top-level await appropriately (e.g., in module initialization vs avoiding it in certain contexts).
