<template>
	<div class="app-sidebar" :class="{ 'no-event': isOpen }">
		<transition :name="transitionName" @before-enter="beforeEnter" @after-enter="afterEnter" @enter="enter">
			<div v-show="isOpen" ref="sidebarContent" class="sidebar-content" :class="rootClasses">
				<slot :close="close"></slot>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: "AppSideBar",
	model: {
		prop: 'open',
		event: 'update:open'
	},
	props: {
		open: Boolean,
		type: [String, Object],
		overlay: Boolean,
		position: {
			type: String,
			default: 'fixed',
			validator: (value) => {
				return [
					'fixed',
					'absolute',
					'static'
				].indexOf(value) >= 0
			}
		},
		fullheight: Boolean,
		fullwidth: Boolean,
		right: Boolean,
		mobile: {
			type: String
		},
		reduce: Boolean,
		expandOnHover: Boolean,
		expandOnHoverFixed: Boolean,
		delay: {
			type: Number,
			default: () => 0
		},
		canCancel: {
			type: [Array, Boolean],
			default: () => ['escape', 'outside']
		},
		onCancel: {
			type: Function,
			default: () => {
			}
		},

	},
	data() {
		return {
			isOpen: this.open,
			isDelayOver: false,
			transitionName: null,
			animating: true,
			savedScrollTop: null,
			hasLeaved: false
		}
	},
	computed: {
		rootClasses() {
			return [this.type, {
				'is-fixed': this.isFixed,
				'is-static': this.isStatic,
				'is-absolute': this.isAbsolute,
				'is-fullheight': this.fullheight,
				'is-fullwidth': this.fullwidth,
				'is-right': this.right,
				'is-mini': this.reduce && !this.isDelayOver,
				'is-mini-expand': this.expandOnHover || this.isDelayOver,
				'is-mini-expand-fixed': (this.expandOnHover && this.expandOnHoverFixed) || this.isDelayOver,
				'is-mini-delayed': this.delay !== null,
				'is-mini-mobile': this.mobile === 'reduce',
				'is-hidden-mobile': this.mobile === 'hide',
				'is-fullwidth-mobile': this.mobile === 'fullwidth'
			}]
		},
		cancelOptions() {
			let options;
			if (typeof this.canCancel === 'boolean') {
				options = this.canCancel ? ['escape', 'outside'] : [];
			} else {
				options = this.canCancel;
			}
			return options;
		},
		isStatic() {
			return this.position === 'static'
		},
		isFixed() {
			return this.position === 'fixed'
		},
		isAbsolute() {
			return this.position === 'absolute'
		}
	},

	watch: {
		open: {
			handler(value) {
				this.isOpen = value
				const open = this.right ? !value : value
				this.transitionName = !open ? 'slide-prev' : 'slide-next'
			},
			immediate: true
		}
	},
	methods: {
		close() {
			this.isOpen = false
			this.$emit('close')
			this.$emit('update:open', false)
		},
		beforeEnter() {
			this.animating = true
		},
		afterEnter() {
			this.animating = false
		},
		enter() {
			let myDiv = document.getElementById('ss-content');
			if (myDiv) {
				myDiv.scrollTop = 0;
			}

		},

		onHover() {
			if (this.delay) {
				this.hasLeaved = false
				this.timer = setTimeout(() => {
					if (!this.hasLeaved) {
						this.isDelayOver = true
					}
					this.timer = null
				}, this.delay)
			} else {
				this.isDelayOver = false
			}
		},
		onHoverLeave() {
			this.hasLeaved = true
			this.timer = null
			this.isDelayOver = false
		}
	},
	created() {
		if (typeof window !== 'undefined') {
			document.addEventListener('keyup', this.keyPress)
			document.addEventListener('click', this.clickedOutside)
		}
	},
	mounted() {
		if (typeof window !== 'undefined') {
			if (this.isFixed) {
				document.body.appendChild(this.$el)
			}
		}


	},
	beforeDestroy() {
		if (typeof window !== 'undefined') {
			document.removeEventListener('keyup', this.keyPress)
			document.removeEventListener('click', this.clickedOutside)

		}

	}
}
</script>

<style lang="scss" scoped>
.app-sidebar {
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	z-index: 15;
	pointer-events: none;

	&.no-event {
		pointer-events: all;
	}

	&.h-100 {
		height: 100% !important;
	}

	&.w-100 {
		width: 100% !important;
	}

	.sidebar-content {
		position: relative;
		height: 100%;
	}
}
</style>