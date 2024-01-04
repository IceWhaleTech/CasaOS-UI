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
			const { target, isIntersecting } = events[0]
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
			const imgUrl = this.getThumbUrl(this.item)
			let img = new Image();
			img.crossOrigin = location.host;
			img.src = imgUrl;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
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