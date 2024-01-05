const mutations = {
	// User and tokens
	SET_ACCESS_TOKEN(state, token) {
		state.access_token = token
	},

	SET_REFRESH_TOKEN(state, token) {
		state.refresh_token = token
	},

	SET_USER(state, user) {
		state.user = user
	},

	SET_INIT_KEY(state, key) {
		state.initKey = key
	},

	// Site
	SET_SITE_LOADING(state, loading) {
		state.siteLoading = loading
	},

	SET_NEED_INITIALIZATION(state, need) {
		state.needInitialization = need
	},

	SET_SIDEBAR_CLOSE(state) {
		state.sidebarOpen = false
	},

	TOOGLE_SIDEBAR_STATE(state) {
		state.sidebarOpen = !state.sidebarOpen
	},

	SET_WALLPAPER(state, wallpaper) {
		localStorage.setItem('wallpaper', wallpaper.path)
		state.wallpaperObject = wallpaper
	},

	SET_DEFAULT_WALLPAPER(state) {
		state.wallpaperObject = {
			path: require('@/assets/background/default_wallpaper.jpg'),
			from: "Built-in" //Built-in, Upload, Files
		}
	},

	SET_IS_MOBILE(state, val) {
		state.isMobile = val
	},

	SET_SEARCH_ENGINE(state, val) {
		state.searchEngine = val
	},

	SET_SEARCH_ENGINE_SWITCH(state, val) {
		state.searchEngineSwitch = val
	},

	SET_EXISTING_APPS_SWITCH(state, val) {
		state.existingAppsSwitch = val
	},

	SET_RECOMMEND_SWITCH(state, val) {
		state.recommendSwitch = val
	},

	SET_RSS_SWITCH(state, val) {
		state.rssSwitch = val
	},

	SET_HARDWARE_INFO(state, val) {
		state.hardwareInfo = val
	},

	SET_CURRENT_PATH(state, val) {
		state.currentPath = val
	},

	SET_IS_VIEW_GRID(state, val) {
		state.isViewGird = val
	},

	SET_OPERATE_OBJECT(state, val) {
		state.operateObject = val
	},

	SET_NETWORK_STORAGE(state, val) {
		localStorage.setItem('networkStorage', JSON.stringify(val))
		state.networkStorage = val
	},

	// shortcut data mutations
	SET_SHORTCUT_DATA(state, val) {
		state.shortcutData = val
	},
	GET_SHORTCUT_DATA(state) {
		return state.shortcutData
	},

	// public params
	SET_DEVICE_ID(state, val) {
		state.device_id = val
	},

	SET_ACCESS_ID(state, val) {
		state.access_id = val
	},

	SET_LANGUAGE(state, val) {
		state.casaos_lang = val
	},

	// TODO v2 does not have.
	SET_NOTIMPORT_LIST(state, val) {
		state.notImportList = val
	},

}
export default mutations
