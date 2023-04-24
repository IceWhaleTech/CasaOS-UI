<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-31 20:24:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 17:53:42
 * @FilePath: /CasaOS-UI/src/components/filebrowser/shared/SelectShareModal.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-3">{{ $t('Select Shared Folder') }}</h3>
			</div>
			<div>
				<button class="delete" type="button" @click="$emit('close')"/>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body">

			<ul class="folder-list scrollbars-light mt-5 mb-5">
				<li v-for="(item,index) in rootDataList" :key="'rs'+index">
					<div class="is-flex list-item new-list-item is-align-items-center disbiled">
						<div class="cover ml-2 mr-2 is-flex-shrink-0  is-flex is-align-items-center">
							<b-icon :icon="item.icon" :pack="item.pack" class="casa-color-blue" custom-size="casa-28px"></b-icon>
						</div>
						<div class=" is-flex-grow-1">{{ item.name }}</div>
						<div class=" is-flex-shrink-0  is-flex is-align-items-center">
							<b-checkbox :value="item.selected" class="mr-0" disabled></b-checkbox>
						</div>
					</div>
				</li>
				<li v-for="(item,index) in dataList" :key="'s'+index">
					<div v-if="item.visible" class="is-flex list-item new-list-item is-align-items-center" @click="toggle(item)">
						<div class="cover ml-2 mr-2 is-flex-shrink-0 is-flex is-align-items-center">
							<b-icon :icon="item.icon" :pack="item.pack" class="casa-color-blue" custom-size="casa-28px"></b-icon>
						</div>
						<div class=" is-flex-grow-1 is-unselectable">{{ item.name }}</div>
						<div class=" is-flex-shrink-0  is-flex is-align-items-center">
							<b-checkbox :value="item.selected" class="mr-0 none-click"></b-checkbox>
						</div>
					</div>
				</li>
			</ul>
		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Submit')" :loading="isSaving" rounded type="is-primary" @click="saveShares"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End-->
	</div>
</template>

<script>
export default {
	data() {
		return {
			isSaving: false,
			rootDataList: [
				{
					name: 'Root',
					icon: 'folder-root',
					pack: 'casa',
					path: '/',
					visible: true,
					selected: false,
					extensions: null
				},
			],

			initFolders: [
				{
					name: 'DATA',
					icon: 'folder-data',
					pack: 'casa',
					path: '/DATA',
					visible: true,
					selected: true,
					extensions: null
				},
				{
					name: 'Documents',
					icon: 'folder-documents',
					pack: 'casa',
					path: '/DATA/Documents',
					visible: true,
					selected: true,
					extensions: null
				},
				{
					name: 'Downloads',
					icon: 'folder-downloads',
					pack: 'casa',
					path: '/DATA/Downloads',
					visible: true,
					selected: true,
					extensions: null
				},
				{
					name: 'Gallery',
					icon: 'folder-gallery',
					pack: 'casa',
					path: '/DATA/Gallery',
					visible: true,
					selected: true,
					extensions: null
				},
				{
					name: 'Media',
					icon: 'folder-media',
					pack: 'casa',
					path: '/DATA/Media',
					visible: true,
					selected: true,
					extensions: null
				},

			],
			dataList: [],
		}
	},
	async created() {
		this.getNewList()
	},
	methods: {
		/**
		 * @description: Get new list
		 * @return {*}
		 */
		async getNewList() {
			const newList = await this.$api.folder.getList(this.rootDataList[0].path)
			const dataList = await this.$api.folder.getList(this.initFolders[0].path)
			this.shortcutList = this.$store.state.shortcutData
			this.dataList = [...this.initFolders, ...this.shortcutList]
			const contactList = []
			contactList.push(...newList.data.data.content, ...dataList.data.data.content, ...this.shortcutList)
			this.dataList.forEach(dir => {
				dir.visible = contactList.some(item => item.path == dir.path && item.is_dir)
				dir.extensions = contactList.find(item => item.path == dir.path && item.is_dir).extensions;
			})
		},
		/**
		 * @description: Toggle folder select
		 * @param {*} item
		 * @return {*}
		 */
		toggle(item) {
			item.selected = !item.selected
		},

		/**
		 * @description: Save shares
		 * @return {*}
		 */
		async saveShares() {
			this.isSaving = true
			const selectedList = this.dataList.filter(item => item.selected)
			const data = selectedList.map(item => {
				return {
					path: item.path,
					anonymous: true
				}
			})
			try {
				await this.$api.samba.createShare(data)
				this.isSaving = false
				this.$emit('close')
				this.$emit('reload')
			} catch (error) {
				this.isSaving = false
				this.$buefy.toast.open({
					message: error.response.data.message,
					type: 'is-danger'
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.folder-list {
	background: #f8f8f8;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 0.75rem;
	padding: 1.5rem;

	li {
		.list-item {
			padding: 0.625rem 0.75rem 0.625rem 0.75rem;
			margin: 0.125rem 0;
			border-radius: 4px;
			cursor: pointer;
			transition: all 0.2s;
			align-items: center;
			font-size: 14px;

			.arrow-container {
				width: 24px;
				height: 24px;
			}

			span {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			&:hover {
				background: #deebfd;
			}

			&.active {
				background: #deebfd;
			}

			.icon {
				overflow: hidden;
			}

			&.disbiled {
				opacity: 0.2;
				pointer-events: none;
			}

			.none-click {
				pointer-events: none;
			}
		}

		.new-list-item {
			font-size: 0.875rem;
		}
	}
}
</style>

<style lang="scss">
.folder-list {
	.control-label {
		display: none !important;
	}
}
</style>
