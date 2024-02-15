# astro-remote

## 0.2.4

### Patch Changes

- 7fe62d9: `he` breaks vite, replace with entities

  When using CodeBlock / CodeSpan.

  Stack trace:

  ```sh
  TypeError: __vite_ssr_import_5__.encode is not a function
  Please report this to https://github.com/markedjs/marked.
      at renderer.code (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/lib/utils.ts:76:60)
      at renderer.<computed> [as code] (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/node_modules/marked/lib/marked.esm.js:2751:41)
      at Parser.parse (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/node_modules/marked/lib/marked.esm.js:2277:32)
      at parse (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/node_modules/marked/lib/marked.esm.js:2211:19)
      at eval (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/node_modules/marked/lib/marked.esm.js:2644:18)
      at Function.marked [as parse] (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/node_modules/marked/lib/marked.esm.js:2659:48)
      at Module.markdown (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/lib/utils.ts:92:54)
      at eval (/.../web-garden/themes/simple-docs/node_modules/.pnpm/astro-remote@0.2.3/node_modules/astro-remote/lib/Markdown.astro:17:47)
      at AstroComponentInstance.Markdown [as factory] (/.../astro-openapi/node_modules/.pnpm/astro@2.1.9/node_modules/astro/dist/runtime/server/astro-component.js:22:12)
      at AstroComponentInstance.init (/.../astro-openapi/node_modules/.pnpm/astro@2.1.9/node_modules/astro/dist/runtime/server/render/astro/instance.js:28:29)
  ```

  ***

  `entities` is typed, and more updated / speedy.

  Need more tests though.

## 0.2.3

### Patch Changes

- 500f0e4: Fix usage of `he` module

## 0.2.2

### Patch Changes

- 0a9e6a9: Add support for GitHub-style notes and warnings

## 0.2.1

### Patch Changes

- Fix encoding issue with custom components

## 0.2.0

### Minor Changes

- df3e783: Add support for custom Heading, CodeBlock, and CodeSpan components. Improve documentation.

## 0.1.0

### Minor Changes

- af385fd: Updates `ultrahtml` to latest, fixes some issues with text
