<template>
	<div>
		<div :style="{ top: y + 'px', left: x + 'px' }" class="drop-context-menu">
			<b-dropdown id="dr1" ref="dropDown" :animation="ani" :mobile-modal="false"
						:position="'is-' + verticalPos + '-' + horizontalPos"
						aria-role="list" class="file-dropdown" close-on-click>
				<!-- Blank Start -->
				<template>
					<b-dropdown-item key="drop-context1" aria-role="menuitem" class="is-flex is-align-items-center">
						<b-upload v-model="files" class="is-clickable has-text-full-03 is-flex is-align-items-center"
								  multiple @input="activeDropUpload">
							<b-icon class="mr-1 is-16x16" custom-size="casa-16px" icon="sending-files" pack="casa"/>
							{{ $t('Sending files') }}
						</b-upload>
					</b-dropdown-item>

				</template>
				<!-- Blank End -->
			</b-dropdown>
		</div>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import events  from '@/events/events';

export default {
	name: "drop-context-menu",
	mixins: [mixin],
	data() {
		return {
			verticalPos: "bottom",
			horizontalPos: "right",
			x: Number,
			y: Number,
			ani: "fade1",
			showCancel: false,
			files: [],
			deviceId: undefined,
			sender: undefined
		}
	},

	computed: {
		close() {
			return this.item == undefined
		},
		cancelText() {
			return this.deviceId == this.sender ? 'Cancel sending' : 'Ignore'
		},
	},
	beforeDestroy() {
		this.$EventBus.$off(events.SHOW_DROP_CONTEXT_MENU);
		this.$EventBus.$off("peer-left");
	},
	mounted() {
		this.$EventBus.$on(events.SHOW_DROP_CONTEXT_MENU, this.open);
		this.$EventBus.$on("peer-left", this.handlePeerleft);
	},
	methods: {
		open(event) {
			this.showCancel = event.isSending
			this.deviceId = event.deviceId
			this.sender = event.sender
			this.$refs.dropDown.isActive = false
			this.$nextTick(() => {
				this.x = event.clientX
				this.y = event.clientY
				const rightOffset = window.innerWidth - event.clientX - 184
				this.horizontalPos = rightOffset > 0 ? "right" : "left"
				this.$refs.dropDown.isActive = true;
			})
		},
		cancel() {
			this.$refs.dropDown.isActive = false;
		},
		activeDropUpload() {
			const event = {
				deviceId: this.deviceId,
				files: this.files
			}
			this.$EventBus.$emit(events.ACTIVE_DROP_UPLOAD, event);
			this.files = []
		},
		handlePeerleft(peerId) {
			if (this.deviceId == peerId.detail) {
				this.$refs.dropDown.isActive = false
			}
		}

	},
}
</script>

<style lang="scss" scoped>
.drop-context-menu {
	position: fixed;
	z-index: 800;
}
</style>