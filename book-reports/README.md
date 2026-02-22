# book-reports

Markdown-based slideshow book reports, powered by [Marp](https://marp.app/).

## Quick Start

```bash
nvm use
npm install
npm run dev
```

This starts a local server with live-reload at `http://localhost:8080`.

## Scripts

- `npm run dev` — Start a live-reload dev server for slides
- `npm run build` — Build all slides to HTML in `dist/`
- `npm run build:pdf` — Build all slides to PDF in `dist/`

## Creating a New Book Report

Add a new `.md` file in the `slides/` directory. Each file should start with
Marp front-matter:

```markdown
---
marp: true
theme: default
paginate: true
---
```

Use `---` to separate slides. See `slides/example.md` for a template.

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
