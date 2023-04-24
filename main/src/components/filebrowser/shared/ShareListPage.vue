<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:48:34
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-10 17:05:19
 * @FilePath: /CasaOS-UI/src/components/filebrowser/shared/ShareListPage.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<div class="content is-flex-grow-1">
		<!-- Header Start -->
		<header class="modal-card-head">
			<!-- SideBar Button Start -->
			<sidebar-menu-button></sidebar-menu-button>
			<!-- SideBar Button End -->
			<div
				id="bread-container"
				class="is-flex-grow-1 is-flex breadcrumb-container"
			>
				<h3 class="title is-3 mb-0">{{ $t("Shared Folders") }}</h3>
			</div>
			<div class="is-flex is-align-items-center">
				<!--  Close Button Start -->
				<div class="close-button" @click="$emit('close')">
					<b-icon icon="close" pack="casa"></b-icon>
				</div>
				<!--  Close Button End -->
			</div>
		</header>
		<!-- Header End -->

		<share-list-view :isLoading="isLoading" :listData="list">
			<div>
				<div class="buttons is-justify-content-center">
					<b-image
						:src="require('@/assets/img/share/share-empty.svg')"
						class="is-160x160"
					></b-image>
				</div>
				{{
					$t(
						"Follow the guide to start sharing your files on the local network."
					)
				}}
				<div class="buttons is-justify-content-center pt-3">
					<b-button rounded type="is-primary" @click="selectShare">{{
							$t("Start")
						}}
					</b-button>
				</div>
			</div>
		</share-list-view>
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>
import ShareListView from "./ShareListView.vue";
import events        from "@/events/events";

export default {
	data() {
		return {
			list: [],
			isLoading: true,
		};
	},

	components: {
		ShareListView,
		SidebarMenuButton: () => import("../components/SidebarMenuButton.vue"),
	},

	mounted() {
		this.getSharedList();
	},

	methods: {
		async getSharedList() {
			this.isLoading = true;
			try {
				const list = await this.$api.samba.getShares();
				this.isLoading = false;
				this.list = list.data.data.map((item) => {
					const name = item.path.split("/").pop();
					return {
						id: item.id,
						date: "",
						isSelected: false,
						is_dir: true,
						name: name,
						path: item.path,
						size: 0,
						write: false,
					};
				});
			} catch (error) {
				this.isLoading = false;
				this.list = [];
			}
		},

		selectShare() {
			this.$EventBus.$emit(events.SELECT_SHARE);
		},
	},
};
</script>

<style lang="scss" scoped>
.modal-card-head {
	height: 4.5rem;
}
</style>
