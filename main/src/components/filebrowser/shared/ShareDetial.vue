<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-29 16:10:49
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-02 11:28:28
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\ShareDetial.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-3">{{$t('Folder has been shared')}}</h3>
			</div>
			<div>
				<button type="button" class="delete" @click="$emit('close')"/>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">
			<div class="node-card">
				<div class="is-size-14px mt-5 mb-5">
					{{$t('Enter the following link to access the shared folder ( Samba ) .')}}
				</div>
				<b-field horizontal :label="$t('PC ( Windows explorer )')" class="mb-5">
					<b-input name="subject" expanded readonly :value="pcPath" icon-pack="casa" icon-right="copy"
							 icon-right-clickable @icon-right-click="copyToClipboard(pcPath)"></b-input>
				</b-field>
				<b-field horizontal :label="$t('Mac ( Finder )')" class="mb-5">
					<b-input name="subject" expanded readonly :value="macPath" icon-pack="casa" icon-right="copy"
							 icon-right-clickable @icon-right-click="copyToClipboard(macPath)"></b-input>
				</b-field>
			</div>

		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('I Got it')" type="is-primary" rounded expaned @click="$emit('close')"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
	</div>
</template>

<script>
import copy from 'clipboard-copy'

export default {
	props: {
		item: {
			type: Object,
			default: () => ({})
		},
	},
	computed: {
		pcPath() {
			const name = this.item.path.split('/').pop()
			return "\\\\" + this.$baseIp + `\\` + name
		},
		macPath() {
			const name = this.item.path.split('/').pop()
			return "smb://" + this.$baseIp + `/` + name
		},
	},
	created() {

	},
	methods: {
		copyToClipboard(value) {
			copy(value)
			this.$buefy.toast.open({
				message: this.$t('Copied to clipboard'),
				type: 'is-success'
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.modal-card {
	max-width: 40rem;
}
</style>

<style lang="scss">
.share-detial-panel {
	.field-label {
		flex-grow: 9 !important;
		text-align: left;
	}

	.field-body {
		flex-grow: 15 !important;

		input {
			background-color: #f8f8f8;
		}
	}
}
</style>