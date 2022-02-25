/*
 * @Author: JerryK
 * @Date: 2022-01-20 12:01:07
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 14:45:40
 * @Description: 
 * @FilePath: /CasaOS-UI/src/mixins/mixin.js
 */
import qs from 'qs'

export const mixin = {

    methods: {
        /**
         * @description: Format size output
         * @param {int} value size value
         * @return {String} 
         */
        renderSize(value) {
            if (null == value || value == '') {
                return "0 Bytes";
            }
            var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
            var index = 0,
                srcsize = parseFloat(value);
            index = Math.floor(Math.log(srcsize) / Math.log(1024));
            var size = srcsize / Math.pow(1024, index);
            size = size.toFixed(2);
            return size + unitArr[index];
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
         * @param {String} lang value
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
            if (item.is_dir) {
                return require("@/assets/img/folder-icon-230-180.png")
            } else {
                const ext = item.name.substring(item.name.lastIndexOf('.') + 1);
                // Check Images
                if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff', 'ai'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-image.png")
                    // Check Videos
                } else if (['mkv', 'mp4', '3gp', 'avi', 'm2ts', 'webm', 'flv', 'vob', 'ts', 'mts', 'mov', 'wmv', 'rm', 'rmvb', 'asf', 'wmv', 'mpg', 'm4v', 'mpeg', 'f4v'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-video.png")
                    // Check Audios
                } else if (['aac', 'aiff', 'alac', 'amr', 'ape', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wma', 'wav'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-audio.png")
                    // Check Documents
                } else if (['txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'html', 'css', 'scss', 'less', 'log', 'pages', 'wps', 'csv', 'json', 'xml'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-document.png")
                    // Check Zip files
                } else if (['zip', 'rar', '7z', 'gz', 'ace'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-document.png")
                    // Check Archiving files
                } else if (['iso', 'img', 'vmdk', 'raw', 'vhd'].indexOf(ext.toLowerCase()) !== -1) {
                    return require("@/assets/img/icon-document.png")
                } else {
                    return require("@/assets/img/icon-unknown.png")
                }

            }
        },
        /**
         * @description: Download File
         * @param {Object} item 
         * @return {void} 
         */
        downloadFile(item) {
            this.$buefy.toast.open({
                message: 'Download in preparation',
                type: 'is-light'
            })
            let base_url = (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${this.$store.state.devPort}/v1/file/download?` : `http://${document.location.host}/v1/file/download?`;
            let url = {
                path: item.path,
                token: this.$store.state.token
            }
            window.open(base_url + qs.stringify(url), '_self');
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
                console.log("Open folder:", item.path);
                this.$emit('gotoFolder', item.path)
            } else {
                console.log("Click:", item.path);
                this.$emit('showDetailModal', item)
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
        renderSize(value) {
            if (null == value || value == '') {
                return "0 Bytes";
            }
            var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
            var index = 0,
                srcsize = parseFloat(value);
            index = Math.floor(Math.log(srcsize) / Math.log(1024));
            var size = srcsize / Math.pow(1024, index);
            size = size.toFixed(2);
            return size + unitArr[index];
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
            return new Date(value).toLocaleString();
        },
        coverType: function (item) {
            return item.is_dir ? "folder-cover" : "file-cover"
        },
        iconType: function (item) {
            return item.is_dir ? "folder-icon" : "files-icon"
        },

    }
}
