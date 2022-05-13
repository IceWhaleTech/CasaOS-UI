/*
 * @Author: JerryK
 * @Date: 2022-01-20 12:01:07
 * @LastEditors: 老竭力 jerrykuku@qq.com
 * @LastEditTime: 2022-05-06 16:30:16
 * @Description: 
 * @FilePath: \CasaOS-UI\src\mixins\mixin.js
 */
import qs from 'qs'
import has from 'lodash/has'
import union from 'lodash/union'
import copy from 'clipboard-copy'
import dayjs from 'dayjs'
const typeMap = {
    "image-x-generic": ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'],
    "video-x-generic": ['mkv', 'mp4', '3gp', 'avi', 'm2ts', 'webm', 'flv', 'vob', 'ts', 'mts', 'mov', 'wmv', 'rm', 'rmvb', 'asf', 'wmv', 'mpg', 'm4v', 'mpeg', 'f4v'],
    "audio-x-generic": ['aac', 'aiff', 'alac', 'amr', 'ape', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wma', 'wav'],
    "text-x-generic": ['txt', 'log', 'pages', 'md', 'conf', 'list', 'ini'],
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
const filePanelMap = {
    'code-editor': union(typeMap['text-x-generic'], typeMap['text-css'], typeMap['text-html'], typeMap['text-x-cmake'], typeMap['text-dockerfile']),
    "video-player": union(typeMap['video-x-generic'], typeMap['audio-x-generic']),
    "image-viewer": typeMap['image-x-generic'],
    "pdf-viewer": typeMap['application-pdf'],
}



export const mixin = {
    data() {
        return {
            baseUrl: (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${this.$store.state.devPort}/v1/` : `http://${document.location.host}/v1/`
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
            let isDir = false
            if (has(item, 'is_dir') || has(item, "isFolder")) {
                isDir = item.is_dir
            }
            if (isDir) {
                let folder = "folder-default"
                if (item.type == "application") {
                    folder = "folder-application"
                } else if (item.type == "usb") {
                    folder = "folder-usb"
                } else if (["sata", "nvme", "spi", "sas"].includes(item.type)) {
                    folder = "folder-hdd"
                } else if (item.type == "home") {
                    folder = "folder-root"
                } else if (item.name == "Media") {
                    folder = "folder-video"
                } else if (item.name == "Downloads") {
                    folder = "folder-download"
                } else if (item.name == "Documents") {
                    folder = "folder-documents"
                } else if (item.name == "Gallery") {
                    folder = "folder-pictures"
                } else if (item.name == "AppData") {
                    folder = "folder-application"
                } else {
                    folder = "folder-default"
                }
                return require(`@/assets/img/filebrowser/${folder}.svg`)
            } else {
                const ext = this.getFileExt(item);
                let type = "unknown"
                Object.keys(typeMap).forEach((_type) => {
                    const extensions = typeMap[_type]
                    if (extensions.indexOf(ext.toLowerCase()) > -1) {
                        type = _type
                    }
                })
                return require(`@/assets/img/filebrowser/${type}.svg`)
            }
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
         * @param {Object} item 
         * @return {void} 
         */
        downloadFile(item) {
            this.$buefy.toast.open({
                message: this.$t('Download in preparation...'),
                type: 'is-light'
            })
            let url = this.getFileUrl(item)
            window.open(url, '_blank');
        },
        playVideo(item, player) {
            let url = player + this.getFileUrl(item)
            window.open(url, '_self');
        },

        // Get File Download URL
        getFileUrl(item) {
            let apiUrl = `${this.baseUrl}file/new/download?`;
            let parameters = {
                path: item.path,
                token: this.$store.state.token
            }
            return apiUrl + qs.stringify(parameters)
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
            let apiUrl = `${this.baseUrl}file/image?`;
            let parameters = {
                path: item.path,
                token: this.$store.state.token,
                type: "thumbnail"
            }
            return apiUrl + qs.stringify(parameters)
        },
        // Download Button Action
        download() {
            this.$refs.dropDown.toggle()
            this.downloadFile(this.item)
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
         * @return {void} 
         */
        operate(type) {
            const operateObject = {
                from: this.item.path,
                type: type
            }
            this.$store.commit('changeOperateObject', operateObject)
            this.$refs.dropDown.toggle()
        },

        /**
         * @description: Delete File
         * @param {} 
         * @return {void} 
         */
        deleteItem() {
            this.$api.file.delete(this.item.path).then(res => {
                if (res.data.success == 200) {
                    this.$refs.dropDown.toggle()
                    this.$emit("reload")
                } else {
                    this.$buefy.toast.open({
                        message: res.data.message,
                        type: 'is-danger'
                    })
                }
            })
        },

        /**
         * @description: Check file or folder state
         * @param {object}  item
         * @return {void} 
         */
        getCardState(item) {
            if (this.$store.state.operateObject != null && this.$store.state.operateObject.type == "move") {
                return this.$store.state.operateObject.from == item.path
            } else {
                return false
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
            var unitArr = new Array("bps", "Kbps", "Mbps", "Gbps", "TB", "PB", "EB", "ZB", "YB");
            var index = 0,
                srcsize = parseFloat(value);
            index = Math.floor(Math.log(srcsize) / Math.log(1024));
            var size = srcsize / Math.pow(1024, index);
            size = size.toFixed(2);
            return size + " " + unitArr[index];
        },


        /**
         * @description: Format size output
         * @param {int} value size value
         * @return {String} 
         */
        renderSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
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
