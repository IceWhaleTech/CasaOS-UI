import { ice_i18n } from './common-i18n'

/**
 * Safe label for app-store category/author/store objects.
 * Avoids TypeError when cateMenu is empty or v2 stores omit a string `name`
 * (IceWhaleTech/CasaOS#2537).
 */
export function storeDisplayName(item, fallback = 'All') {
	if (item == null) {
		return fallback
	}
	const raw = item.name
	if (raw == null || raw === '') {
		if (typeof item.url === 'string' && item.url) {
			return item.url
		}
		return fallback
	}
	if (typeof raw === 'string') {
		return raw
	}
	if (typeof raw === 'object') {
		const localized = ice_i18n(raw)
		if (typeof localized === 'string' && localized) {
			return localized
		}
	}
	if (typeof item.url === 'string' && item.url) {
		return item.url
	}
	return fallback
}
