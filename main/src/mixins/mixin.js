import qs from 'qs'
import has from 'lodash/has'
import union from 'lodash/union'
import copy from 'clipboard-copy'
import dayjs from 'dayjs'

const typeMap = {
	"image-x-generic": ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'],
	"video-x-generic": ['mkv', 'mp4', '3gp', 'avi', 'm2ts', 'webm', 'flv', 'vob', 'ts', 'mts', 'mov', 'wmv', 'rm', 'rmvb', 'asf', 'wmv', 'mpg', 'm4v', 'mpeg', 'f4v'],
	"audio-x-generic": ['aac', 'aiff', 'alac', 'amr', 'ape', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wma', 'wav'],
	"text-x-generic": ['txt', 'log', 'pages', 'conf', 'config', 'list', 'ini', 'toml', 'cfg', 'rc', 'env', 'service', 'conf.d', 'htaccess', 'gitconfig', 'vim', 'curlrc', 'wgetrc', 'gitignore'],
	"text-markdown": ['md'],
	"text-css": ['php', 'css', 'less', 'scss', 'sass', 'aspx', 'lua', 'vue', 'js', 'go', 'asp', 'bat', 'c', 'cpp', 'cs', 'json', 'py', 'perl', 'sh', 'xml', 'yaml', 'vb', 'vbs', 'sql', 'swift', 'rust', 'rs', 'jsp', 'yml', 'r', 'pl', 'rb', 'src', 'h', 'tex', 'rtf', 'jsonld', 'ttl', 'n3', 'rss', 'atom', 'srt', 'ass', 'tsv', 'vcard', 'asc', 'url', 'diff', 'plaintext'],
	"text-html": ['html', 'htm', 'shtml', 'shtm'],
	"application-vnd.ms-word": ['doc', 'docx', 'wps'],
	"application-vnd.ms-excel": ['xls', 'xlsx', 'csv'],
	"application-vnd.ms-powerpoint": ['ppt', 'pptx'],
	"application-pdf": ['pdf'],
	"application-photoshop": ['psd', 'psb'],
	"application-illustrator": ['ai', 'eps'],
	"application-x-wine-extension-cpl": ['exe'],
	"application-apk": ['apk'],
	"application-x-zip": ['zip', 'rar', '7z', 'gz', 'ace', 'xz'],
	"application-x-cd-image": ['iso', 'img', 'vmdk', 'raw', 'vhd'],
	"application-x-apple": ['dmg', 'ipa', 'pkg'],
	"application-x-pem-key": ['pem', 'crt', 'ca-bundle', 'p7b', 'p7s', 'der', 'cer', 'pfx', 'p12'],
	"text-x-cmake": ['makefile', 'cmake', 'dockerfile'],
	"text-dockerfile": ['dockerfile'],
}
const hasThumbImageType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg']

// eslint-disable-next-line no-unused-vars
const filePanelMap = {
	'code-editor': union(typeMap['text-x-generic'], typeMap['text-css'], typeMap['text-html'], typeMap['text-x-cmake'], typeMap['text-dockerfile']),
	"video-player": union(typeMap['video-x-generic'], typeMap['audio-x-generic']),
	"image-viewer": typeMap['image-x-generic'],
	"doc-viewer": union(typeMap['application-vnd.ms-word']),
	"excel-viewer": union(typeMap['application-vnd.ms-excel']),
	// "mark-down-editor":typeMap['text-markdown'],
	"pdf-viewer": typeMap['application-pdf'],
}
export const wallpaperType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg']
const wallpaperConfig = "wallpaper"


export const mixin = {
	data() {
		return {
			baseUrl: `${this.$protocol}//${this.$baseURL}/v1/`,
			downloadIframe: null,
		}
	},
	mounted() {
		this.typeMap = typeMap;
	},

	methods: {
		/**
		 * @description: Format size output
		 * @param {int} bytes size value
		 * @return {String}
		 */
		renderSize(bytes) {
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
			if (bytes == 0) return '0 Bytes'
			const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
			if (i === 0) return `${bytes} ${sizes[i]}`
			return `${parseFloat((bytes / (1024 ** i)).toFixed(2))} ${sizes[i]}`
		},


		/**
		 * @description: Get Default Lang from browser
		 * @return {String} lang
		 */
		getLangFromBrowser() {
			let lang = navigator.language || navigator.userLanguage;
			lang = lang.toLowerCase().replace("-", "_");
			return lang
		},


		/**
		 * @description: Set Default Lang from browser
		 * @param {String} lang
		 * @return {void}
		 */
		//
		setLang(lang) {
			this.$store.commit('SET_LANGUAGE', lang);
			localStorage.setItem('lang', lang)
			this.$i18n.locale = lang;
		},


		/**
		 * @description: Get file icon from file name
		 * @param {Object} item
		 * @return {Object}
		 */
		//
		getIconFile(item) {
			const isDir = (has(item, 'is_dir') || has(item, "isFolder")) ? item.is_dir : false;
			let icon = "unknown";
			if (isDir) {
				if (item.type == "application") {
					icon = "folder-application"
				} else if (item.type == "usb") {
					icon = "folder-usb"
				} else if (["sata", "nvme", "spi", "sas"].includes(item.type)) {
					icon = "folder-hdd"
				} else if (item.type == "home") {
					icon = "folder-root"
				} else if (item.name == "Media") {
					icon = "folder-video"
				} else if (item.name == "Downloads") {
					icon = "folder-download"
				} else if (item.name == "Documents") {
					icon = "folder-documents"
				} else if (item.name == "Gallery") {
					icon = "folder-pictures"
				} else if (item.name == "AppData") {
					icon = "folder-application"
				} else {
					icon = "folder-default"
				}
			} else {
				const ext = this.getFileExt(item);
				Object.keys(typeMap).forEach((_type) => {
					const extensions = typeMap[_type]
					if (extensions.indexOf(ext.toLowerCase()) > -1) {
						icon = _type
					}
				})
			}
			return require(`@/assets/img/filebrowser/${icon}.svg`)
		},
		getPanelType(item) {
			const ext = this.getFileExt(item);
			let type = null
			Object.keys(filePanelMap).forEach((_type) => {
				const extensions = filePanelMap[_type]
				if (extensions.indexOf(ext.toLowerCase()) > -1) {
					type = _type
				}
			})
			return type
		},
		getFileExt(item) {
			return item.name.substring(item.name.lastIndexOf('.') + 1);
		},
		/**
		 * @description: Download File
		 * @param {Object,Array} items
		 * @return {void}
		 */
		downloadFile(items) {
			this.$buefy.toast.open({
				message: this.$t('Download in preparation...'),
				type: 'is-white'
			})
			let url = this.getFileUrl(items)
			if (!this.downloadIframe) {
				this.downloadIframe = document.createElement('iframe');
				this.downloadIframe.style.display = 'none';
				document.body.appendChild(this.downloadIframe);
			}
			this.downloadIframe.src = url;
			// window.open(url, '_blank');
		},
		// Download Button Action
		download() {
			this.$refs.dropDown?.toggle()
			this.downloadFile(this.item)
		},
		playVideo(item, player) {
			let url = player + this.getFileUrl(item)
			window.open(url, '_self');
		},

		// Get File Download URL
		getFileUrl(items) {
			let apiUrl = ""
			let path = ""
			let parameters = {
				token: this.$store.state.access_token
			}
			if (items.constructor === Object) {
				if (items.is_dir) {
					apiUrl = `${this.baseUrl}batch`;
					path = items.path
					parameters.files = path
					return apiUrl + "?" + qs.stringify(parameters)
				} else {
					apiUrl = `/v3/file`;
					parameters.path = items.path
					return apiUrl + "?" + qs.stringify(parameters)
				}
			} else if (items.constructor === Array) {
				apiUrl = `${this.baseUrl}batch`;
				const pathArray = items.map(o => {
					return o.path
				})
				path = pathArray.join(",")
				parameters.files = path
				return apiUrl + "?" + qs.stringify(parameters)
			}
		},

		// check if has thumb
		hasThumb(item) {
			if (item.is_dir) {
				return false
			} else {
				const ext = this.getFileExt(item);
				return hasThumbImageType.indexOf(ext.toLowerCase()) > -1
			}

		},

		// Get Image Thumb URL
		getThumbUrl(item) {
			let apiUrl = `${this.baseUrl}image?`;
			let parameters = {
				path: item.path,
				token: this.$store.state.access_token,
				type: "thumbnail"
			}
			return apiUrl + qs.stringify(parameters)
		},

		// Copy Path
		copyPath() {
			this.$refs.dropDown.toggle()
			copy(this.item.path)
			this.$buefy.toast.open({
				message: this.$t('Copied to clipboard'),
				type: 'is-success'
			})
		},
		/**
		 * @description: Download File
		 * @param {Object,Object} event item
		 * @return {void}
		 */
		clickItem(event, item) {
			let bounced = event.target.getAttribute('class').includes('mdi-dots')
			if (bounced) {
				return false
			}
			if (item.is_dir) {
				this.$emit('gotoFolder', item.path)
			} else {
				this.$emit('showDetailModal', item)
			}
		},
		/**
		 * @description: Open Context Menu
		 * @param {Object,Object} event item
		 * @return {void}
		 */
		openContextMenu(e, item) {
			if (item) {
				e.cancelBubble = true
				document.dispatchEvent(new CustomEvent('contextmenu'));
			}
			this.$refs.ctxMenu.open(e, item)
		},
		/**
		 * @description: Copy Or Cut File
		 * @param {String} type
		 * @param {Object,Array} items
		 * @return {void}
		 */
		operate(type, items) {
			let operateObject = {
				type: type,
			}
			if (items.constructor === Object) {
				operateObject.item = [
					{
						from: items.path,

					}
				]
			} else if (items.constructor === Array) {
				operateObject.item = items.map(o => {
					return {
						from: o.path,
					}
				})
			}
			this.$store.commit('SET_OPERATE_OBJECT', operateObject)
			if (this.$refs.dropDown !== undefined) {
				this.$refs.dropDown.toggle()
			}

		},

		/**
		 * @description: Delete File
		 * @param {Object,Array} items
		 * @return {void}
		 */
		deleteItem(items) {
			const deleteShare = async (shareId) => {
				try {
					await this.$api.samba.deleteShare(shareId);
				} catch (e) {
					console.log(`${e} in delete shortcut`);
				}
			};

			const deleteShortcut = async (item) => {
				try {
					await deleteShare(item.extensions.share.id);
					this.$store.commit('REMOVE_SHORTCUT', item.path);
				} catch (e) {
					console.log(`${e} in delete shortcut`);
				}
			};

			const deleteItems = async (paths) => {
				try {
					const res = await this.$api.batch.delete(JSON.stringify(paths));
					if (res.data.success === 200) {
						const shotcutData = this.$store.state['shortcutData'];
						const updatedShotcutData = shotcutData.filter((item) => {
							if (paths.includes(item.path)) {
								deleteShortcut(item);
								return false;
							}
							return true;
						});
						await this.$store.dispatch('SET_SHORTCUT_DATA', updatedShotcutData);
						if (this.$refs.dropDown !== undefined) {
							this.$refs.dropDown.toggle();
							this.$emit("reload");
						}
						if (typeof this.reload === "function") {
							this.reload();
						}
					} else {
						this.$buefy.toast.open({
							message: res.data.message,
							type: 'is-danger'
						});
					}
				} catch (e) {
					console.log(`${e} in deleteItem`);
				}
			};

			let paths = [];
			if (items.constructor === Object) {
				paths = [items.path];
			} else if (items.constructor === Array) {
				paths = items.map((o) => o.path);
			}

			deleteItems(paths);
		},
		/**
		 * @description: Set an image as wallpaper
		 * @param {*} item
		 * @return {*}
		 */
		setAsWallpaper(item) {
			const postData = {
				path: item.path,
			}
			this.$api.users.setUserImage(wallpaperConfig, postData).then(res => {
				if (res.data.success === 200) {
					const resData = res.data.data
					let wallpaperData = {
						path: "SERVER_URL" + resData.online_path + "&time=" + new Date().getTime(),
						from: "Files"
					}
					this.$api.users.setCustomStorage(wallpaperConfig, wallpaperData).then(res => {
						if (res.data.success === 200) {
							this.$store.commit('SET_WALLPAPER', {
								path: res.data.data.path,
								from: res.data.data.from
							})
							this.$buefy.toast.open({
								message: this.$t('Set wallpaper successfully.'),
								type: 'is-success'
							})
						} else {
							this.$buefy.toast.open({
								message: this.$t('Save failed, please try again!'),
								type: 'is-danger'
							})
						}

					})
				} else {
					this.$buefy.toast.open({
						message: this.$t('Save failed, please try again!'),
						type: 'is-danger'
					})
				}
			})
			if (this.$refs.dropDown !== undefined) {
				this.$refs.dropDown.toggle()
			}
		},

	},


	filters: {
		/**
		 * @description: Format size output
		 * @param {int} value size value
		 * @return {String}
		 */
		renderBps(value) {
			if (null == value || value == '' || value == 0) {
				return "0 bps";
			}
			const unitArr = ["bps", "Kbps", "Mbps", "Gbps", "TB", "PB", "EB", "ZB", "YB"];
			let index = 0,
				srcsize = parseFloat(value);
			index = Math.floor(Math.log(srcsize) / Math.log(1024));
			let size = srcsize / Math.pow(1024, index);
			size = size.toFixed(2);
			return size + unitArr[index];
		},


		/**
		 * @description: Format size output
		 * @param {int} value size value
		 * @return {String}
		 */
		renderSize(bytes) {
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			if (bytes === 0) return '0 Bytes'
			const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
			if (i === 0) return `${bytes} ${sizes[i]}`
			return `${parseFloat((bytes / (1024 ** i)).toFixed(2))} ${sizes[i]}`
		},


		toFahrenheit: function (value) {
			return (32 + value * 1.8).toFixed(1);
		},


		formatNum(number) {
			return new Intl.NumberFormat().format(number)
		},


		getProgressType(per) {
			if (per >= 0 && per < 80) {
				return "is-primary"
			} else if (per >= 80 && per < 90) {
				return "is-warning"
			} else {
				return "is-danger"
			}
		},


		getTextType(per) {
			if (per >= 0 && per < 80) {
				return "has-text-success"
			} else if (per >= 80 && per < 90) {
				return "has-text-warning"
			} else {
				return "has-text-danger"
			}
		},

		dateFmt: function (value) {
			if (dayjs().isSame(value, 'year')) {
				return dayjs(value).format('DD/MM hh:mm')
			} else {
				return dayjs(value).format('DD/MM/YYYY hh:mm')
			}
		},
		coverType: function (item) {
			return item.is_dir ? "folder-cover" : "file-cover"
		},
		iconType: function (item) {
			return item.is_dir ? "folder-icon" : "files-icon"
		},

	}
}
