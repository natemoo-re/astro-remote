/**@ts-expect-error */
import { renderJSX } from "astro/runtime/server/jsx";
import { jsx as h } from "astro/jsx-runtime";
import { transform, __unsafeHTML } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import swap from "ultrahtml/transformers/swap";

import { type MarkedExtension, marked } from "marked";
import markedFootnote from "marked-footnote";
import { markedSmartypants } from "marked-smartypants";

import * as entities from "entities";

export function createComponentProxy(
	result: any,
	_components: Record<string, any> = {},
) {
	const components: Record<string, any> = {};
	for (const [key, value] of Object.entries(_components)) {
		if (typeof value === "string") {
			components[key] = value;
		} else {
			components[key] = async (
				props: Record<string, any>,
				children: { value: any },
			) => {
				if (key === "CodeBlock" || key === "CodeSpan") {
					props.code = entities.decode(JSON.parse(`"${props.code}"`));
				}
				const output = await renderJSX(
					result,
					h(value, { ...props, "set:html": children.value }),
				);
				return __unsafeHTML(output);
			};
		}
	}
	return components;
}

function getIndent(ln: string): string {
	if (ln.trim() === ln) return "";
	return ln.slice(0, ln.length - ln.trim().length);
}

export function dedent(str: string): string {
    const lns = str.replace(/^[\r\n]+/, "").split("\n");
    let indent = getIndent(lns[0]);
    if (indent.length === 0 && lns.length > 1) {
        indent = getIndent(lns[1]);
    }
		if (indent.length === 0) return lns.join("\n");
    return lns
        .map(ln => ln.startsWith(indent) ? ln.slice(indent.length) : ln)
        .join("\n");
}

export interface HTMLOptions {
	sanitize?: Record<string, any>;
	components?: Record<string, any>;
}

export async function markdown(
	input: string,
	opts: HTMLOptions = {},
	markedExtenstion: MarkedExtension[] = [],
): Promise<string> {
	const renderer: any = {};
	if (opts.components) {
		if ("Note" in opts.components) {
			renderer.blockquote = (text: string) => {
				const lines = text.split("\n");
				const ln = lines[0].replace("<p>", "");
				if (ln === "<strong>Note</strong>") {
					return `<Note type="note"><p>${lines.slice(1).join("\n")}</Note>`;
				}
				if (ln === "<strong>Warning</strong>") {
					return `<Note type="warning"><p>${lines.slice(1).join("\n")}</Note>`;
				}
				return `<blockquote>${text}</blockquote>`;
			};
		}
		if ("Heading" in opts.components) {
			renderer.heading = (
				children: string,
				level: number,
				raw: string,
				slugger: { slug: (arg0: string) => any },
			) => {
				//const slug = slugger.slug(raw);
				//  href="#${slug}"
				return `<Heading as="h${level}" text="${raw}">${children}</Heading>`;
			};
		}
		if ("CodeBlock" in opts.components) {
			renderer.code = (code: string, meta = "") => {
				const info = meta.split(/\s+/g) ?? [];
				const lang = info[0] ?? "plaintext";
				const value = JSON.stringify(entities.encode(code));
				return `<CodeBlock lang=${JSON.stringify(lang)} code=${value} ${info
					.splice(1)
					.join(" ")} />`;
			};
		}
		if ("CodeSpan" in opts.components) {
			renderer.codespan = (code: string) => {
				const value = JSON.stringify(entities.encode(code));
				return `<CodeSpan code=${value}>${code}</CodeSpan>`;
			};
		}
	}
	marked.use(markedSmartypants(), markedFootnote(), ...markedExtenstion, {
		gfm: true,
		renderer,
	});
	const content = await marked.parse(dedent(input));
	return transform(content, [
		swap(opts.components),
		sanitize(opts.sanitize),
	]);
}

export async function html(
	input: string,
	opts: HTMLOptions = {},
): Promise<string> {
	return transform(dedent(input), [
		sanitize(opts.sanitize),
		swap(opts.components),
	]);
}
