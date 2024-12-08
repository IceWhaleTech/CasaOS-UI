<template>
	<div ref="dropdown" :class="rootClasses" class="dropdown dropdown-menu-animation" @mouseleave="isHoverable = false">
		<div v-if="!inline" ref="trigger" :tabindex="disabled ? false : triggerTabindex" aria-haspopup="true"
			class="dropdown-trigger" @click="onClick" @mouseenter="onHover" @contextmenu.prevent="onContextMenu"
			@focus.capture="onFocus">
			<slot :active="isActive" name="trigger" />
		</div>

		<transition :name="animation">
			<div v-if="isMobileModal" v-show="isActive" :aria-hidden="!isActive" class="background" />
		</transition>
		<transition :name="animation">
			<div v-show="(!disabled && (isActive || isHoverable)) || inline" ref="dropdownMenu" v-trap-focus="trapFocus"
				:aria-hidden="!isActive" :style="style" class="dropdown-menu">
				<div :aria-modal="!inline" :role="ariaRole" :style="contentStyle" class="dropdown-content">
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import trapFocus from 'buefy/src/directives/trapFocus'
import config from 'buefy/src/utils/config'
import { createAbsoluteElement, isCustomElement, removeElement, toCssWidth } from 'buefy/src/utils/helpers'
import ProviderParentMixin from 'buefy/src//utils/ProviderParentMixin'

const DEFAULT_CLOSE_OPTIONS = ['escape', 'outside']

export default {
	name: 'CDropdown',
	directives: {
		trapFocus
	},
	mixins: [ProviderParentMixin('dropdown')],
	props: {
		value: {
			type: [String, Number, Boolean, Object, Array, Function],
			default: null
		},
		disabled: Boolean,
		inline: Boolean,
		scrollable: Boolean,
		maxHeight: {
			type: [String, Number],
			default: 200
		},
		position: {
			type: String,
			validator(value) {
				return [
					'is-top-right',
					'is-top-left',
					'is-bottom-left',
					'is-bottom-right',
					'is-top',
					'is-bottom',
					'is-right',
					'is-left'
				].indexOf(value) > -1
			}
		},
		triggers: {
			type: Array,
			default: () => ['click']
		},
		mobileModal: {
			type: Boolean,
			default: () => {
				return config.defaultDropdownMobileModal
			}
		},
		ariaRole: {
			type: String,
			validator(value) {
				return [
					'menu',
					'list',
					'dialog'
				].indexOf(value) > -1
			},
			default: null
		},
		animation: {
			type: String,
			default: 'fade'
		},
		multiple: Boolean,
		trapFocus: {
			type: Boolean,
			default: () => {
				return config.defaultTrapFocus
			}
		},
		closeOnClick: {
			type: Boolean,
			default: true
		},
		canClose: {
			type: [Array, Boolean],
			default: true
		},
		expanded: Boolean,
		appendToBody: Boolean,
		appendToBodyCopyParent: Boolean,
		triggerTabindex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			selected: this.value,
			style: {},
			isActive: false,
			isHoverable: false,
			// eslint-disable-next-line vue/no-reserved-keys
			_bodyEl: undefined // Used to append to body
		}
	},
	computed: {
		rootClasses() {
			return [this.position, {
				'is-disabled': this.disabled,
				'is-hoverable': this.hoverable,
				'is-inline': this.inline,
				'is-active': this.isActive || this.inline,
				'is-mobile-modal': this.isMobileModal,
				'is-expanded': this.expanded
			}]
		},
		isMobileModal() {
			return this.mobileModal && !this.inline
		},
		cancelOptions() {
			return typeof this.canClose === 'boolean'
				? this.canClose
					? DEFAULT_CLOSE_OPTIONS
					: []
				: this.canClose
		},
		contentStyle() {
			return {
				maxHeight: this.scrollable ? toCssWidth(this.maxHeight) : null,
				overflow: this.scrollable ? 'auto' : null
			}
		},
		hoverable() {
			return this.triggers.indexOf('hover') >= 0
		}
	},
	watch: {
		/**
		 * When v-model is changed set the new selected item.
		 */
		value(value) {
			this.selected = value
		},

		/**
		 * Emit event when isActive value is changed.
		 */
		isActive(value) {
			this.$emit('active-change', value)
			this.handleScroll()
			if (this.appendToBody) {
				this.$nextTick(() => {
					this.updateAppendToBody()
				})
			}
		},

		isHoverable(value) {
			if (this.hoverable) {
				this.$emit('active-change', value)
			}
		}
	},
	methods: {
		handleScroll() {
			if (typeof window === 'undefined') return

			if (this.isMobileModal) {
				if (this.isActive) {
					document.documentElement.classList.add('is-clipped-touch')
				} else {
					document.documentElement.classList.remove('is-clipped-touch')
				}
			}
		},

		/**
		 * Click listener from DropdownItem.
		 *   1. Set new selected item.
		 *   2. Emit input event to update the user v-model.
		 *   3. Close the dropdown.
		 */
		selectItem(value) {
			if (this.multiple) {
				if (this.selected) {
					if (this.selected.indexOf(value) === -1) {
						// Add value
						this.selected = [...this.selected, value]
					} else {
						// Remove value
						this.selected = this.selected.filter((val) => val !== value)
					}
				} else {
					this.selected = [value]
				}
				this.$emit('change', this.selected)
			} else {
				if (this.selected !== value) {
					this.selected = value
					this.$emit('change', this.selected)
				}
			}
			this.$emit('input', this.selected)
			if (!this.multiple) {
				this.isActive = !this.closeOnClick
				if (this.hoverable && this.closeOnClick) {
					this.isHoverable = false
				}
			}
		},

		/**
		 * White-listed items to not close when clicked.
		 */
		isInWhiteList(el) {
			if (el === this.$refs.dropdownMenu) return true
			if (el === this.$refs.trigger) return true
			// All chidren from dropdown
			if (this.$refs.dropdownMenu !== undefined) {
				const children = this.$refs.dropdownMenu.querySelectorAll('*')
				for (const child of children) {
					if (el === child) {
						return true
					}
				}
			}
			// All children from trigger
			if (this.$refs.trigger !== undefined) {
				const children = this.$refs.trigger.querySelectorAll('*')
				for (const child of children) {
					if (el === child) {
						return true
					}
				}
			}
			return false
		},

		/**
		 * Close dropdown if clicked outside.
		 */
		clickedOutside(event) {
			if (this.cancelOptions.indexOf('outside') < 0) return
			if (this.inline) return

			const target = isCustomElement(this) ? event.composedPath()[0] : event.target
			if (!this.isInWhiteList(target)) this.isActive = false
		},

		/**
		 * Keypress event that is bound to the document
		 */
		keyPress({ key }) {
			if (this.isActive && (key === 'Escape' || key === 'Esc')) {
				if (this.cancelOptions.indexOf('escape') < 0) return
				this.isActive = false
			}
		},

		onClick() {
			if (this.triggers.indexOf('click') < 0) return
			this.toggle()
		},
		onContextMenu() {
			if (this.triggers.indexOf('contextmenu') < 0) return
			this.toggle()
		},
		onHover() {
			if (this.triggers.indexOf('hover') < 0) return
			this.isHoverable = true
		},
		onFocus() {
			if (this.triggers.indexOf('focus') < 0) return
			this.toggle()
		},

		/**
		 * Toggle dropdown if it's not disabled.
		 */
		toggle() {
			if (this.disabled) return

			if (!this.isActive) {
				// if not active, toggle after clickOutside event
				// this fixes toggling programmatic
				this.$nextTick(() => {
					const value = !this.isActive
					this.isActive = value
					// Vue 2.6.x ???
					setTimeout(() => (this.isActive = value))
				})
			} else {
				this.isActive = !this.isActive
			}
		},

		methods: {
			updateAppendToBody() {
				const dropdown = this.$refs.dropdown
				const dropdownMenu = this.$refs.dropdownMenu
				const trigger = this.$refs.trigger
				if (dropdownMenu && trigger) {
					const dropdownWrapper = this.$data._bodyEl.children[0]
					dropdownWrapper.classList = ['dropdown', 'dropdown-menu-animation', ...(this.$vnode && this.$vnode.data && this.$vnode.data.staticClass ? [this.$vnode.data.staticClass] : [])]
					this.rootClasses.forEach((item) => {
						if (item && typeof item === 'object') {
							for (let key in item) {
								if (item[key]) {
									dropdownWrapper.classList.add(key)
								}
							}
						}
					})
					if (this.appendToBodyCopyParent) {
						const parentNode = this.$refs.dropdown.parentNode
						const parent = this.$data._bodyEl
						parent.classList = [...parentNode.classList]
					}
					const rect = trigger.getBoundingClientRect()
					let top = rect.top + window.scrollY
					let left = rect.left + window.scrollX
					if (!this.position || this.position.includes('bottom')) {
						top += trigger.clientHeight
					} else {
						top -= dropdownMenu.clientHeight
					}
					if (this.position && this.position.includes('left')) {
						left -= dropdownMenu.clientWidth - trigger.clientWidth
					}
					if (this.position && this.position.includes('is-right')) {
						console.log('is-right')
						top += 0
						left -= 0
					}
					this.style = {
						position: 'absolute',
						top: `${top}px`,
						left: `${left}px`,
						zIndex: '99',
						width: this.expanded ? `${dropdown.offsetWidth}px` : undefined
					}
				}
			}
		},
	},
	mounted() {
		if (this.appendToBody) {
			this.$data._bodyEl = createAbsoluteElement(this.$refs.dropdownMenu)
			this.updateAppendToBody()
		}
	},
	created() {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', this.clickedOutside)
			document.addEventListener('keyup', this.keyPress)
		}
	},
	beforeDestroy() {
		if (typeof window !== 'undefined') {
			document.removeEventListener('click', this.clickedOutside)
			document.removeEventListener('keyup', this.keyPress)
		}
		if (this.appendToBody) {
			removeElement(this.$data._bodyEl)
		}
	}
}
</script>

<style lang="scss" scoped>
.dropdown.is-right .dropdown-menu {
	top: 0;
	left: 100%;
}
</style>