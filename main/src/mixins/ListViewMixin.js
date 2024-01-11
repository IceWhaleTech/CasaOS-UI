import pull from 'lodash/pull'
import Hitbox from 'hitbox-js'
import events from '@/events/events';
import VueBreakpointMixin from "vue-breakpoint-mixin";

export default {
	model: {
		prop: 'listData',
		event: 'change'
	},
	mixins: [VueBreakpointMixin],
	props: {
		listData: Array,
		isLoading: Boolean
	},
	data() {
		return {
			selectBox: null,
			selectList: [],
			isShift: false, // If Press SHIFT
			isCtrl: false, // If Press CTRL
			isShowSeBox: false,
			lipL: 0,
			lipT: 0,
			hitboxWatcher: null,
		}
	},
	mounted() {
		this.selectBox = document.getElementById(this.SELECT_BOX);
		this.parentBox = document.getElementById(this.PARENT_BOX);
		window.addEventListener('resize', this.onResize);
		this.$EventBus.$on(events.AFTER_FILES_ENTER, this.onResize);

		this.hitboxCheck();
		window.addEventListener('keydown', this.onKeydown)
		window.addEventListener('keyup', this.onKeyup)
		window.addEventListener('blur', this.blur)
		this.$nextTick(() => {
			this.onResize();
		})
	},
	methods: {
		/*************************************************
		 * PART 1  Alignment Method
		 **************************************************/
		/**
		 * @description: Changes the arrangement of the list when the view size changes.
		 * @return {*}
		 */
		onResize() {
			if (this.isGird) {
				const cw = document.getElementById(this.CARD_CONTAINER).clientWidth
				this.cols = Math.floor(cw / this.CARD_WIDTH)
				this.colStyle.width = (100 / this.cols).toString() + "%"
			}
		},

		/*************************************************
		 * PART 2  Select and drag selection
		 **************************************************/


		/**
		 * @description: Handle Checkbox value change
		 * @param {Boolean} value
		 * @param {Int} index
		 * @return {*}
		 */
		handleCheckboxInput(value, index) {
			if (value) {
				this.selectList.push(index)
			} else {
				pull(this.selectList, index)
			}
			this.updateDatas()
		},

		/**
		 * @description: Update parent box horizontal and vertical coordinates in real time when the page scrolls
		 * @return {*}
		 */
		onScroll() {
			this.lipT = document.querySelector('.select-parent').getBoundingClientRect().top
			this.lipL = document.querySelector('.select-parent').getBoundingClientRect().left
		},

		/**
		 * @description: Handling keyboard press events
		 * @param {Event} event
		 * @return {*}
		 */
		onKeydown(event) {
			switch (event.keyCode) {
				case 16:
					this.isShift = true;
					break;
				case 17: // window Keyboard
					this.isCtrl = true;
					break;
				case 91:  // mac command
					this.isCtrl = true;
					break;
			}
		},
		blur(evnet) {
			// make sure release shift and ctrl
			this.isShift = false;
			this.isCtrl = false;
		},

		/**
		 * @description: Handling keyboard release events
		 * @return {*}
		 */
		onKeyup() {
			this.isShift = false
			this.isCtrl = false
		},

		/**
		 * @description: Handling drag and drop selection
		 * @param {Event} event
		 * @return {*}
		 */
		onDragSelectionStart(event) {
			// if target is action bution or select return false
			const targetClass = event.target.getAttribute('class')
			if (targetClass.includes('mdi-dots') || targetClass.includes('check')) {
				return false
			}

			if (!this.isCtrl && !this.isShift && this.selectList.length != 0) {
				this.selectList = []
				this.process()
			}
			this.onScroll();
			this.downX = event.clientX - this.lipL
			this.downY = event.clientY - this.lipT
			this.selectBox.style.left = this.downX + "px";
			this.selectBox.style.top = this.downY + "px";
			document.body.addEventListener('mousemove', this.onDragSelection)
			document.body.addEventListener('mouseup', this.onDragSelectionStop)
			this.parentBox.addEventListener("scroll", this.onScroll)

		},

		/**
		 * @description: Handling events on mouse movement
		 * @param {Event} event
		 * @return {*}
		 */
		onDragSelection(event) {
			this.isShowSeBox = true;
			this.selectBox.style.left = Math.min((event.clientX - this.lipL), this.downX) + "px";
			this.selectBox.style.top = Math.min((event.clientY - this.lipT), this.downY) + "px";
			this.selectBox.style.width = Math.abs(this.downX - (event.clientX - this.lipL)) + "px";
			this.selectBox.style.height = Math.abs(this.downY - (event.clientY - this.lipT)) + "px";
		},

		/**
		 * @description: Handles events at the end of mouse movement
		 * @return {*}
		 */
		onDragSelectionStop() {
			this.isShowSeBox = false;
			this.selectBox.style.width = 0 + "px";
			this.selectBox.style.height = 0 + "px";
			document.body.removeEventListener('mousemove', this.onDragSelection)
			document.body.removeEventListener('mouseup', this.onDragSelectionStop)
		},

		/**
		 * @description: Handle the mouse click event of the card
		 * @param {Event} event
		 * @param {Obejct} item
		 * @param {Int} index
		 * @return {*}
		 */
		onCardClick(event, item, index) {
			if (this.isShift) {
				this.handleShiftClick(index);
			} else if (this.isCtrl) {
				this.handleCtrlClick(index);
			} else {
				this.handleNormalClick(event, item);
			}
		},

		handleShiftClick(index) {
			if (this.selectList.indexOf(index) === -1) {
				this.selectList.push(index);
			}
			if (this.selectList.length > 1) {
				const min = Math.min(this.selectList[0], this.selectList[this.selectList.length - 1]);
				const max = Math.max(this.selectList[0], this.selectList[this.selectList.length - 1]);
				this.selectList = [];
				for (let i = min; i <= max; i++) {
					this.selectList.push(i);
				}
			}
			this.process();
		},

		handleCtrlClick(index) {
			if (this.selectList.indexOf(index) === -1) {
				this.selectList.push(index);
			} else {
				this.selectList.splice(this.selectList.indexOf(index), 1);
			}
			this.process();
		},

		handleNormalClick(event, item) {
			const bounced = event.target.classList.contains('mdi-dots') || event.target.classList.contains('check') || event.target.classList.contains('background');
			if (!bounced) {
				if (item.is_dir) {
					this.$emit('gotoFolder', item.path);
				} else {
					this.$emit('showDetailModal', item);
				}
			}
		},

		/**
		 * @description: Detect if the box is covered
		 * @return {*}
		 */
		hitboxCheck() {
			this.hitboxWatcher = new Hitbox({
				elements: this.selectBox,
				targetElements: this.SELECT_ITEM
			})

			this.hitboxWatcher.onCollisionStart((collision) => {
				const index = collision.targetElement.getAttribute("data-rel")
				this.selectList.push(Number(index))
				this.process()
			})

			this.hitboxWatcher.onCollisionEnd((collision) => {
				const index = collision.targetElement.getAttribute("data-rel")
				if (this.isShowSeBox) {
					pull(this.selectList, Number(index))
					this.process()
				}
			})
		},

		/**
		 * @description: Reset all selected states
		 * @return {*}
		 */
		process() {
			this.listData.forEach((item, index) => {
				item.isSelected = false
				this.selectList.forEach(o => {
					if (o === index) {
						item.isSelected = true
					}
				})
			});
			this.updateDatas()
		},

		/**
		 * @description: Update the view and notify the parent component
		 * @return {*}
		 */
		updateDatas() {
			// this.$forceUpdate()
			this.$emit("change", this.listData)
		},
		/**
		 * @description: Check file or folder state
		 * @param {object}  item
		 * @return {void}
		 */
		getCardState(item) {
			if (this.$store.state.operateObject != null && this.$store.state.operateObject.type == "move") {
				return this.$store.state.operateObject.item.some(obj => {
					return obj.from == item.path
				})
			} else {
				return false
			}
		},
	},

	beforeDestroy() {
		document.body.removeEventListener('mousemove', this.onDragSelection)
		document.body.removeEventListener('mouseup', this.onDragSelectionStop)
		this.parentBox.removeEventListener("scroll", this.onScroll)
		window.removeEventListener('keydown', this.onKeydown)
		window.removeEventListener('keyup', this.onKeyup)
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('blur', this.blur);
	},
}