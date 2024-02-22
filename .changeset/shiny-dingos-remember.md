---
"astro-remote": minor
---

This Update will bring all Dependencies to current versions as well as resolve some typing issues with new versions

New:
- Now Support Marked Extensions using the following example:
    ```tsx
    ---
    import markedAlert from 'marked-alert'
    const readme = await fetch("https://raw.githubusercontent.com/natemoo-re/astro-remote/main/packages/astro-remote/README.md").then((res) => res.text());
    ---
    <Markdown sanitize={{ allowComponents: true }}
        content={readme} 
        components={{ Heading, CodeBlock, CodeSpan, Note }}
        marked={{extensions: [markedAlert()]}} />
    ```


Breaking:
- Node Engine Minimum required version: v18.14.1 this reflects Astro's Minimum requirements. (https://docs.astro.build/en/tutorial/1-setup/1/#nodejs)

