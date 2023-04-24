<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-12 16:31:36
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-12 16:49:46
 * @FilePath: /CasaOS-UI/src/components/filebrowser/shared/ContextMenu.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
	<div>

		<div :style="{top:y + 'px',left:x+'px'}" class="action-btn context-menu">
			<b-dropdown id="'dr-share'" ref="dropDown" :animation="ani" :position="'is-'+verticalPos+'-'+horizontalPos" append-to-body
						aria-role="list" class="file-dropdown" close-on-click>
				<b-dropdown-item aria-role="menuitem" @click="getShareLink(item)">
					{{ $t('Get Share Link') }}
				</b-dropdown-item>
				<b-dropdown-item aria-role="menuitem" @click="goto">
					{{ $t('Go to') }}
				</b-dropdown-item>
				<hr class="dropdown-divider">
				<b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="unShare">
					{{ $t('UnShare') }}
				</b-dropdown-item>
			</b-dropdown>

		</div>
	</div>
</template>

<script>
import {mixin}     from '@/mixins/mixin';
import events      from '@/events/events';
import ShareDetial from './ShareDetial.vue'

export default {
	mixins: [mixin],
	inject: ['filePanel'],
	data() {
		return {
			verticalPos: "bottom",
			horizontalPos: "right",
			x: Number,
			y: Number,
			ani: "fade1",
			item: {},
		}
	},
	methods: {
		open(event, item) {
			this.item = item
			this.$refs.dropDown.isActive = false
			this.$nextTick(() => {
				this.x = event.clientX
				this.y = event.clientY
				const rightOffset = window.innerWidth - event.clientX - 184
				this.horizontalPos = rightOffset > 0 ? "right" : "left"
				this.$refs.dropDown.isActive = true;
			})
		},
		getShareLink(item) {
			this.$buefy.modal.open({
				parent: this,
				component: ShareDetial,
				hasModalCard: true,
				customClass: 'share-detial-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					item: item
				}
			})
		},
		unShare() {
			this.$EventBus.$emit(events.UN_SHARE, this.item);
		},

		goto() {
			this.$EventBus.$emit(events.GOTO, this.item);
		}
	},
}
</script>

<style>
</style>
