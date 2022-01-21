/*
 * @Author: JerryK
 * @Date: 2022-01-20 12:01:07
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-21 17:19:36
 * @Description: 
 * @FilePath: /CasaOS-UI/src/mixins/mixin.js
 */
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
        }
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
          }
    }
}
