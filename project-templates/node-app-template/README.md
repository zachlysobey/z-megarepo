# Node.JS Application Template

## Overview

This template intends to be a minimal starting place for Node.js applications, and also a reference for best practices and conventions. This repo should remain in-sync with recommendations in [/docs/development-conventions/javascript/](../../docs/development-conventions/javascript/README.md) at all times.

## Usage

### 1. Copy over the files

The template code itself is in [./skeleton](./skeleton/). Copy that into a new directory within `/projects/` at the top level of this repository.

### 2. Replace template files

Within that new directory, you'll need to replace templated out values within the new project's `package.json` and `README.md`.

### 3. Install Dependencies

First, make sure you're on the appropriate Node.js & npm versions.
The best way to do this is with `nvm`.
Simply `cd` into the new project directory, then type `nvm use`.

Finally, you can install dependencies with `npm install`.

### 4. Develop your new project (profit!)

At this point you're all good to go!

### 5. Contribute Changes Back to this Template

If anything from the template skeleton feels out or wrong, *fix it upstream*.

Additions to the template that seem like they'd be appropriate for all (or nearly all) Node.js apps can be considered as well, but remember that these templates are meant to be **minimal** starting places.
