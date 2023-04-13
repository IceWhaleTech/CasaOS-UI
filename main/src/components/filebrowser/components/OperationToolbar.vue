<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-25 22:01:08
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-26 00:48:51
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\OperationToolbar.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<transition name="up-fade">
		<div class="toolbar-container" v-if="isActive">
			<div class="operation-toolbar is-flex">
				<b-tooltip :label="$t('Download')" :type="type">
					<div class="toolbar-item" @click.stop="download">
            <span class="has-text-white block">
              <b-icon icon="download-outline" :size="size"></b-icon>
            </span>
					</div>
				</b-tooltip>
				<b-tooltip :label="$t('Copy')" :type="type">
					<div class="toolbar-item" @click.stop="copy">
            <span class="has-text-white block">
              <b-icon icon="content-copy" :size="size"></b-icon>
            </span>
					</div>
				</b-tooltip>
				<b-tooltip :label="$t('Cut')" :type="type">
					<div class="toolbar-item" @click.stop="move">
            <span class="has-text-white block">
              <b-icon icon="file-move-outline" :size="size"></b-icon>
            </span>
					</div>
				</b-tooltip>
				<b-tooltip :label="$t('Delete')" :type="type">
					<div class="toolbar-item" @click.stop="remove">
            <span class="has-text-white block">
              <b-icon icon="delete-outline" :size="size"></b-icon>
            </span>
					</div>
				</b-tooltip>
				<b-tooltip :label="$t('Cancel')" :type="type">
					<div class="toolbar-item" @click.stop="close">
            <span class="has-text-white block">
              <b-icon icon="close" :size="size"></b-icon>
            </span>
					</div>
				</b-tooltip>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "operation-toolbar",
	model: {
		prop: 'active',
		event: 'update:active'
	},
	props: {
		active: Boolean,
	},
	data() {
		return {
			isActive: this.active || false,
			type: "is-dark",
			size: "is-small"
		}
	},
	watch: {
		active(value) {
			this.isActive = value
		},
	},
	methods: {
		download() {
			this.$emit("download")
		},
		copy() {
			this.$emit('copy')
		},
		move() {
			this.$emit('move')
		},
		remove() {
			this.$emit('remove')
		},
		close() {
			this.isActive = false
			this.$emit('close')
			this.$emit('update:active', this.isActive)
		}
	},
}
</script>

<style>
</style>