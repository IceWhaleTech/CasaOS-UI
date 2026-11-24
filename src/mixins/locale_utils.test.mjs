import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveLocale, getLocaleDirection } from './locale_utils.js'

const SAMPLE_LOCALES = ['ar_sa', 'de_de', 'en_us', 'fr_fr', 'zh_cn']

test('resolves bare Arabic browser code to ar_sa instead of resetting to en_us', () => {
	assert.equal(resolveLocale('ar', SAMPLE_LOCALES), 'ar_sa')
	assert.equal(resolveLocale('ar-EG', SAMPLE_LOCALES), 'ar_sa')
	assert.equal(resolveLocale('ar_SA', SAMPLE_LOCALES), 'ar_sa')
})

test('resolves bare non-Arabic browser codes and unknown locales cleanly', () => {
	assert.equal(resolveLocale('fr', SAMPLE_LOCALES), 'fr_fr')
	assert.equal(resolveLocale('zh-CN', SAMPLE_LOCALES), 'zh_cn')
	assert.equal(resolveLocale('xx_XX', SAMPLE_LOCALES), 'en_us')
	assert.equal(resolveLocale('', SAMPLE_LOCALES), 'en_us')
})

test('maps RTL and LTR locales to exact HTML dir values', () => {
	assert.equal(getLocaleDirection('ar_sa'), 'rtl')
	assert.equal(getLocaleDirection('ar'), 'rtl')
	assert.equal(getLocaleDirection('he_il'), 'rtl')
	assert.equal(getLocaleDirection('en_us'), 'ltr')
	assert.equal(getLocaleDirection('fr_fr'), 'ltr')
})
