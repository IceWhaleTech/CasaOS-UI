/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-30 09:19:57
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-02 12:06:03
 * @FilePath: \CasaOS-UI\src\mixins\IconContainerMixin.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
import has from 'lodash/has'

export default {
	props: {
		item: {}
	},
	data() {
		return {
			isLoaded: false,
			imageData: "",
			isWide: true,
			io: {},
			inViewPort: false
		}
	},
	computed: {
		showThumb() {
			return (this.isLoaded && this.hasThumb(this.item)) || this.isSvg
		},
		isShared() {
			const extensions = this.item.extensions
			if (extensions === null) {
				return false
			} else {
				if (has(extensions, 'share')) {
					return extensions.share.shared === "true"
				} else {
					return false
				}
			}
		},
		isSvg() {
			return this.getFileExt(this.item) === 'svg'
		},
	},
	watch: {
		inViewPort(value) {
			if (value) {
				this.loadImage();
			}
		}
	},
	created() {
		this.io = new IntersectionObserver((events) => {
			const {target, isIntersecting} = events[0]
			if (isIntersecting && !this.inViewPort) {
				this.inViewPort = true
				this.io.unobserve(target)
			}
		})
	},
	mounted() {
		if (this.hasThumb(this.item)) {
			this.io.observe(this.$el);
		}
	},
	methods: {
		loadImage() {
			if (this.isSvg) {
				this.imageData = this.getFileUrl(this.item)
				return
			}
			var imgUrl = this.getThumbUrl(this.item)
			var img = new Image();
			img.crossOrigin = location.host;
			img.src = imgUrl;
			img.onload = () => {
				var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, img.width, img.height);
				this.isWide = img.width > img.height
				this.isLoaded = true
				this.imageData = canvas.toDataURL('image/png');
			};
			img.onerror = (e, s) => {
				console.log(e, s);
			}

		}
	},
}