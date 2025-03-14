import type { MarkedOptions } from '@ts-stack/markdown'
import { Renderer } from '@ts-stack/markdown'
import hljs from 'highlight.js'

export const markedOptions: MarkedOptions = {
	renderer: new Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: false,
	smartypants: false,
	xhtml: true,
	highlight: (code, lang) => (lang && hljs.highlight(code, { language: lang }).value) || code,
}
