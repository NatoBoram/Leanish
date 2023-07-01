import { MarkedOptions, Renderer } from '@ts-stack/markdown'
import hljs from 'highlight.js'

export const markedOptions = {
	renderer: new Renderer(),
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: true,
	smartLists: false,
	smartypants: false,
	xhtml: true,
	highlight: (code, lang) => (lang && hljs.highlight(lang, code).value) || code,
} satisfies MarkedOptions
