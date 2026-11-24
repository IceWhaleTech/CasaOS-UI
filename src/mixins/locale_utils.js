const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur'])

/**
 * Resolve a browser or saved language tag (e.g. "ar", "ar-EG", "ar_SA")
 * to an available i18n locale key (e.g. "ar_sa"), falling back to "en_us".
 * @param {string} rawLang
 * @param {string[]} availableLocales
 * @return {string}
 */
export const resolveLocale = (rawLang, availableLocales = []) => {
	const normalized = (rawLang || '').trim().toLowerCase().replace(/-/g, '_')
	if (!normalized) {
		return availableLocales.includes('en_us') ? 'en_us' : (availableLocales[0] || 'en_us')
	}
	if (availableLocales.includes(normalized)) {
		return normalized
	}
	const base = normalized.split('_')[0]
	const prefixMatch = availableLocales.find((loc) => loc === base || loc.startsWith(`${base}_`))
	if (prefixMatch) {
		return prefixMatch
	}
	return availableLocales.includes('en_us') ? 'en_us' : (availableLocales[0] || 'en_us')
}

/**
 * Return HTML text direction ("rtl" or "ltr") for a resolved locale key.
 * @param {string} locale
 * @return {string}
 */
export const getLocaleDirection = (locale) => {
	const base = (locale || '').trim().toLowerCase().replace(/-/g, '_').split('_')[0]
	return RTL_LANGS.has(base) ? 'rtl' : 'ltr'
}
