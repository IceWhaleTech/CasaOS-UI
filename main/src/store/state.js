const state = {
	// User
	access_token: "",
	refresh_token: "",
	user: {
		avatar: "",
		created_at: "",
		description: "",
		email: "",
		id: 0,
		nickname: "",
		role: "",
		updated_at: "",
		username: ""
	},
	initKey: "", // Initialization key for reg

	sidebarOpen: false,

	// System Config
	searchEngine: '',
	searchEngineSwitch: true,
	existingAppsSwitch: true,
	recommendSwitch: true,
	rssSwitch: false,

	siteLoading: true,
	needInitialization: false,
	hardwareInfo: {},
	isMobile: false,

	// Files
	operateObject: null,
	currentPath: "",
	isViewGird: true,

	// Wallpaper
	wallpaperObject: {
		path: require('@/assets/background/default_wallpaper.jpg'),
		from: "Built-in" //Built-in, Upload, Files
	},

	// Samba and nfs data
	networkStorage: JSON.parse(localStorage.getItem('networkStorage')) || [],

	// shortcut data
	shortcutData: [],

	// public params
	device_id: "xxx",
	access_id: "dsdad",
	casaos_lang: "zh",
	notImportList: [],
}
export default state
