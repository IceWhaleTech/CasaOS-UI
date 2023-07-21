<template>
	<div class="modal-card app-detail">
		<AppDetailHeader
			:close="close"
		></AppDetailHeader>

		<section id="ss-content" class="modal-card-body">

			<AppInfoHeader 
				:appDetailData="appDetailData" 
				:installedList="installedList" 
				:unusable="unusable"
				:currentInstallId="currentInstallId"
				:archTitle="archTitle"
				@install="$emit('install',appDetailData.id)">
			></AppInfoHeader>

			<AppInfoTable 
				:appDetailData="appDetailData" 
				:cateMenu="cateMenu"
			></AppInfoTable>

			<AppScreenshotSlider 
				v-if="showDetailSwiper"
				:appDetailData="appDetailData"
			></AppScreenshotSlider>

			<!-- App Info  Start -->
			<div class="app-desc mt-4 mb-6">
				<p class="is-size-14px mb-2 un-break-word">{{ i18n(appDetailData.tagline) }}</p>
				<p class="is-size-14px un-break-word">{{ i18n(appDetailData.description) }}</p>
				<!-- <p class="is-size-14px " v-html="appDetailData.tip"></p> -->
			</div>
			<!-- App Info  End -->

		</section>
	</div>
</template>

<script>

import business_OpenThirdApp  from "@/mixins/app/Business_OpenThirdApp";
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import commonI18n             from "@/mixins/base/common-i18n";
import AppInfoTable 		  from './AppInfoTable';
import AppInfoHeader 		  from './AppInfoHeader';
import AppScreenshotSlider    from './AppScreenshotSlider';
import AppDetailHeader        from './AppDetailHeader'

export default {
	name: "AppDetail.vue",
	components: { AppInfoTable, AppInfoHeader, AppScreenshotSlider, AppDetailHeader },
	mixins: [business_ShowNewAppTag, business_OpenThirdApp, commonI18n],
	props: {
		appDetailData: {
			type: Object,
			default: () => {

			}
		},
		installedList: {
			type: Array,
			default: () => {
			}
		},
		currentInstallId: {
			type: String,
			default: ""
		},
		arch: {
			type: String,
			default: ""
		},
		showDetailSwiper: {
			type: Boolean,
			default: false
		},
		cateMenu: {
			type: Array,
			default: []
		},
		close: {
			type: Function,
			default: () => {
			}
		}
	},
	computed: {
		archTitle() {
			// 如果是 arm 默认显示 armv7
			if (this.arch === 'arm') {
				return 'armv7'
			}
			return this.arch
		},
		unusable() {
			return !this.appDetailData.architectures?.includes(this.arch);
		},
	},
}
</script>

<style scoped>

.app-detail {
	overflow: auto;
	height: 100%;
}

</style>