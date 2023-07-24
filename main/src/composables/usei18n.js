
export const usei18n = () => {
	const i18n = (data, fallback = 'en_us')=>{
		let lang = localStorage.getItem('lang')
		return data?.['custom'] || data?.[lang] || data?.[fallback] || data?.['en_US'];
	};

	return {i18n};
}
