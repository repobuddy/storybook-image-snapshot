/**
 * Most of the code in this file is copied from Vitest.
 *
 * @see https://github.com/vitest-dev/vitest/blob/main/packages/browser/src/client/utils.ts
 */
import type { Locator } from '@vitest/browser/context'

export function convertToSelector(elementOrLocator: Element | Locator): string {
	if (!elementOrLocator) {
		throw new Error('Expected element or locator to be defined.')
	}
	if (elementOrLocator instanceof Element) {
		return convertElementToCssSelector(elementOrLocator)
	}
	if ('selector' in elementOrLocator) {
		return (elementOrLocator as any).selector
	}
	throw new Error('Expected element or locator to be an instance of Element or Locator.')
}
export function convertElementToCssSelector(element: Element) {
	if (!element || !(element instanceof Element)) {
		throw new Error(`Expected DOM element to be an instance of Element, received ${typeof element}`)
	}

	return getUniqueCssSelector(element)
}

function escapeIdForCSSSelector(id: string) {
	return id
		.split('')
		.map((char) => {
			const code = char.charCodeAt(0)

			if (
				char === ' ' ||
				char === '#' ||
				char === '.' ||
				char === ':' ||
				char === '[' ||
				char === ']' ||
				char === '>' ||
				char === '+' ||
				char === '~' ||
				char === '\\'
			) {
				// Escape common special characters with backslashes
				return `\\${char}`
			}
			if (code >= 0x10000) {
				// Unicode escape for characters outside the BMP
				return `\\${code.toString(16).toUpperCase().padStart(6, '0')} `
			}
			if (code < 0x20 || code === 0x7f) {
				// Non-printable ASCII characters (0x00-0x1F and 0x7F) are escaped
				return `\\${code.toString(16).toUpperCase().padStart(2, '0')} `
			}
			if (code >= 0x80) {
				// Non-ASCII characters (0x80 and above) are escaped
				return `\\${code.toString(16).toUpperCase().padStart(2, '0')} `
			}
			// Allowable characters are used directly
			return char
		})
		.join('')
}

function getUniqueCssSelector(el: Element) {
	const path = []
	let parent: null | ParentNode
	let hasShadowRoot = false
	// eslint-disable-next-line no-cond-assign
	while ((parent = getParent(el))) {
		if ((parent as Element).shadowRoot) {
			hasShadowRoot = true
		}

		const tag = el.tagName
		if (el.id) {
			path.push(`#${escapeIdForCSSSelector(el.id)}`)
		} else if (!el.nextElementSibling && !el.previousElementSibling) {
			path.push(tag.toLowerCase())
		} else {
			let index = 0
			let sameTagSiblings = 0
			let elementIndex = 0

			for (const sibling of parent.children) {
				index++
				if (sibling.tagName === tag) {
					sameTagSiblings++
				}
				if (sibling === el) {
					elementIndex = index
				}
			}

			if (sameTagSiblings > 1) {
				path.push(`${tag.toLowerCase()}:nth-child(${elementIndex})`)
			} else {
				path.push(tag.toLowerCase())
			}
		}
		el = parent as Element
	}
	return `${getBrowserState().provider === 'webdriverio' && hasShadowRoot ? '>>>' : ''}${path.reverse().join(' > ')}`
}

function getParent(el: Element) {
	const parent = el.parentNode
	if (parent instanceof ShadowRoot) {
		return parent.host
	}
	return parent
}
function getBrowserState(): { provider: 'webdriverio' | 'playwright' } {
	// @ts-expect-error not typed global
	return window.__vitest_browser_runner__
}
