import { marked } from 'marked';
import { transform } from 'ultrahtml';
import { jsx as h } from 'astro/jsx-runtime';
import { renderJSX } from 'astro/runtime/server/jsx';
import { __unsafeHTML } from 'ultrahtml';
import * as entities from "entities";


export function createComponentProxy(result, _components: Record<string, any> = {}) {
  const components = {};
  for (const [key, value] of Object.entries(_components)) {
    if (typeof value === 'string') {
      components[key] = value;
    } else {
      components[key] = async (props, children) => {
        if (key === 'CodeBlock' || key === 'CodeSpan') {
          props.code = entities.decode(JSON.parse(`"${props.code}"`));
        }
        const output = await renderJSX(
          result,
          h(value, { ...props, 'set:html': children.value })
        );
        return __unsafeHTML(output);
      };
    }
  }
  return components;
}

function getIndent(ln: string): string {
  if (ln.trim() === ln) return '';
  return ln.slice(0, ln.length - ln.trim().length);
}

export function dedent(str: string): string {
  const lns = str.replace(/^[\r\n]+/, '').split('\n');
  let indent = getIndent(lns[0]);
  if (indent.length === 0 && lns.length > 1) {
    indent = getIndent(lns[1]);
  }
  return lns
    .map((ln) => (ln.startsWith(indent) ? ln.slice(indent.length) : ln))
    .map((ln, i, { length }) => (i === length - 1 ? ln.trim() : ln))
    .join('\n');
}

export interface HTMLOptions {
  sanitize?: {};
  components?: {};
}

export async function markdown(
  input: string,
  opts: HTMLOptions = {}
): Promise<string> {
  const renderer: any = {}
  if (opts.components) {
    if ('Note' in opts.components) {
      renderer.blockquote = (text: string) => {
        const lines = text.split('\n');
        const ln = lines[0].replace('<p>', '');
        if (ln === '<strong>Note</strong>') {
          return `<Note type="note"><p>${lines.slice(1).join('\n')}</Note>`
        }
        if (ln === '<strong>Warning</strong>') {
          return `<Note type="warning"><p>${lines.slice(1).join('\n')}</Note>`
        }
        return `<blockquote>${text}</blockquote>`
      }
    }
    if ('Heading' in opts.components) {
      renderer.heading = (children: string, level: number, raw: string, slugger) => {
        const slug = slugger.slug(raw);
        return `<Heading as="h${level}" href="#${slug}" text="${raw}">${children}</Heading>`
      }
    }
    if ('CodeBlock' in opts.components) {
      renderer.code = (code: string, meta = '') => {
        const info = meta.split(/\s+/g) ?? [];
        const lang = info[0] ?? 'plaintext';
        const value = JSON.stringify(entities.encode(code))
        return `<CodeBlock lang=${JSON.stringify(lang)} code=${value} ${info.splice(1).join(' ')} />`
      }
    }
    if ('CodeSpan' in opts.components) {
      renderer.codespan = (code: string) => {
        const value = JSON.stringify(entities.encode(code))
        return `<CodeSpan code=${value}>${code}</CodeSpan>`
      }
    }
  }
  marked.use({
    gfm: true,
    smartypants: true,
    renderer
  })
  const content = await marked.parse(dedent(input));

  return transform(content, {
    sanitize: opts.sanitize,
    components: opts.components,
  });
}

export async function html(
  input: string,
  opts: HTMLOptions = {}
): Promise<string> {
  return transform(dedent(input), {
    sanitize: opts.sanitize,
    components: opts.components,
  });
}
