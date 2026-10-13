import { expect, test, describe } from 'vitest'
import { storeDisplayName } from './store_display_name'

describe('storeDisplayName', () => {
	test('empty category menu leaves currentCate undefined and reading .name throws (CasaOS#2537)', () => {
		const cateMenu = []
		const currentCate = cateMenu[0]
		expect(currentCate).toBeUndefined()
		expect(() => currentCate.name).toThrow(TypeError)
	})

	test('does not throw when the store/category object is missing', () => {
		expect(() => storeDisplayName(undefined, 'All')).not.toThrow()
		expect(() => storeDisplayName(null, 'All')).not.toThrow()
		expect(storeDisplayName(undefined, 'All')).toBe('All')
		expect(storeDisplayName(null, 'All')).toBe('All')
	})

	test('falls back when name is missing (empty cateMenu[0] assignment)', () => {
		const currentCate = [].filter(item => item.count > 0)[0]
		expect(storeDisplayName(currentCate, 'All')).toBe('All')
		expect(storeDisplayName({}, 'All')).toBe('All')
	})

	test('returns a plain string name', () => {
		expect(storeDisplayName({ name: 'Finance' }, 'All')).toBe('Finance')
		expect(storeDisplayName({ name: 'All' }, 'All')).toBe('All')
	})

	test('resolves v2 store-config localized name objects', () => {
		expect(
			storeDisplayName({ name: { en_US: 'Big Bear ZimaOS App Store' } }, 'All'),
		).toBe('Big Bear ZimaOS App Store')
	})

	test('falls back to repository URL when name is missing', () => {
		expect(
			storeDisplayName(
				{ url: 'https://github.com/bigbeartechworld/big-bear-casaos/archive/refs/heads/master.zip' },
				'All',
			),
		).toBe('https://github.com/bigbeartechworld/big-bear-casaos/archive/refs/heads/master.zip')
	})

	test('store list query treats undefined currentCate as All', () => {
		const category = storeDisplayName(undefined, 'All')
		const authorType = storeDisplayName({ name: 'All' }, 'All')
		expect(category).toBe('All')
		expect(authorType).toBe('All')
	})
})
