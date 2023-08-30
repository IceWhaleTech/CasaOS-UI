/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 10:42:50
 * @FilePath: /CasaOS-UI/src/mixins/mixin.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import qs    from 'qs'
import union from 'lodash/union'
import dayjs from 'dayjs'

const typeMap = {
	"image-x-generic": ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'],
	"video-x-generic": ['mkv', 'mp4', '3gp', 'avi', 'm2ts', 'webm', 'flv', 'vob', 'ts', 'mts', 'mov', 'wmv', 'rm', 'rmvb', 'asf', 'wmv', 'mpg', 'm4v', 'mpeg', 'f4v'],
	"audio-x-generic": ['aac', 'aiff', 'alac', 'amr', 'ape', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wma', 'wav'],
	"text-x-generic": ['txt', 'log', 'pages', 'md', 'conf', 'list', 'ini'],
	"text-markdown": ['md'],
	"text-css": ['php', 'css', 'less', 'scss', 'sass', 'aspx', 'lua', 'vue', 'js', 'go', 'asp', 'bat', 'c', 'cpp', 'cs', 'json', 'py', 'perl', 'sh', 'xml', 'yaml', 'vb', 'vbs', 'sql', 'swift', 'rust', 'rs', 'jsp', 'yml'],
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
const hasThumbType = ['png', 'jpg', 'jpeg', 'bmp', 'gif']

// eslint-disable-next-line no-unused-vars
union(typeMap['text-x-generic'], typeMap['text-css'], typeMap['text-html'], typeMap['text-x-cmake'], typeMap['text-dockerfile']);
union(typeMap['video-x-generic'], typeMap['audio-x-generic']);
export const mixin = {
	data() {
		return {
			baseUrl: `${this.$protocol}//${this.$baseURL}/v1/`
		}
	},
	mounted() {
	},

	methods: {
		/**
		 * @description: Format size output
		 * @param {int} bytes size value
		 * @return {String}
		 */
		renderSize(bytes) {
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
			if (bytes === 0) return '0 Bytes'
			const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
			if (i === 0) return `${bytes} ${sizes[i]}`
			return `${parseFloat((bytes / (1024 ** i)).toFixed(2))} ${sizes[i]}`
		},


		/**
		 * @description: Get Default Lang from browser
		 * @return {String} lang
		 */
		getLangFromBrowser() {
			var lang = navigator.language || navigator.userLanguage;
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
			window.open(url, '_blank');
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
				return hasThumbType.indexOf(ext.toLowerCase()) > -1
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
		// Download Button Action
		download() {
			this.$refs.dropDown.toggle()
			this.downloadFile(this.item)
		},
	},


	filters: {
		/**
		 * @description: Format size output
		 * @param {int} value size value
		 * @return {String}
		 */
		renderBps(value) {
			if (null == value || value === '' || value === 0) {
				return "0 bps";
			}
			var unitArr = ["bps", "Kbps", "Mbps", "Gbps", "TB", "PB", "EB", "ZB", "YB"];
			var index = 0,
				srcsize = parseFloat(value);
			index = Math.floor(Math.log(srcsize) / Math.log(1024));
			var size = srcsize / Math.pow(1024, index);
			size = size.toFixed(2);
			return size + unitArr[index];
		},


		/**
		 * @description: Format size output
		 * @return {String}
		 * @param bytes
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
