---
"astro-remote": minor
---

This release updates all dependencies and resolves some typing issues.

**New Features**

- [Marked](https://marked.js.org/using_pro) extensions are now supported via the `marked` prop.

    ```astro
    ---
    import markedAlert from 'marked-alert'
    const readme = await fetch("https://raw.githubusercontent.com/natemoo-re/astro-remote/main/packages/astro-remote/README.md").then((res) => res.text());
    ---
    <Markdown
        content={readme}
        marked={{ extensions: [markedAlert()] }}
    />
    ```

**Breaking Changes**

- The minimum required Node version is now `v18.14.1` to align with Astro's [current requirements](https://docs.astro.build/en/tutorial/1-setup/1/#nodejs). This is enforced via an `engines` constraint.

