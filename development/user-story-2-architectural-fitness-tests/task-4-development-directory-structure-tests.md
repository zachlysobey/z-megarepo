# Task 4: Create tests for `development/` directory structure constraints

## Technical Approach

- Create a series of Jest tests to ensure conventions within the `development/` directory structure
- Use file system (fs) based actions to read and inspect the directory structure
- Assert on both the structure and contents of the development directory
- Implement all tests in a single test file: `development-directory.arch.test.ts`

## LLM Prompts Needed

### Prompt 1: Create development directory structure tests

```text
Create a new test file `development-directory.arch.test.ts` in the `architecture-tests/` directory with the following test structure:

describe('development directory structure', () => {
  it('contains a __templates__ sub-dir')
  it('contains a hotfixes sub-dir')
  it('contains sub-dirs with names like user-story-<num>-<some-description>')
  it('may contain a __drafts__ (gitignored) sub-dir')
  it('contains no other top-level sub-dirs')
  
  describe('__templates__ sub-directory', () => {
    it('has an arbitrary directory structure with markdown files')
  })
  
  describe('hotfixes sub-directory', () => {
    it('has markdown files with names like hotfix-123-some-description')
  })
  
  describe.each([...userStoryDirNames])('${userStoryDirName} sub-directory', (userStoryDirName) => {
    it('should have a README')
    it('should have a series of `task-<num>-<some-description>` markdown files')
    it('should have nothing else')
  })
})

Use file system operations (fs module) to read and inspect the `development/` directory structure. Assert on both directory structure and file naming conventions. The tests should validate that the development directory follows the expected organizational patterns.

Finally, remove the dummy test file (dummy.arch.test.ts) since we're replacing it with real tests.
```

## Additional Context

- [LLM Instructions](../../docs/LLM-instructions.md)
- [Dev Process](../../docs/development-process.md)
- [JS Dev Conventions](../../docs/development-conventions/javascript/README.md)
- [Testing guide](../../docs/development-conventions/javascript/testing-guide.md)
- [Node.js Conventions](../../docs/development-conventions/javascript/nodejs-conventions.md)
- [JS Module Conventions](../../docs/development-conventions/javascript/js-module-conventions.md)

### Notes & Retrospective

[to be added once this task-work is completed]
