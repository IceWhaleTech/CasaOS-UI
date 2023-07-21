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

			<AppDescription 
				:appDetailData="appDetailData"
			></AppDescription>

		</section>
	</div>
</template>

<script setup>

import AppInfoTable 		  from './AppInfoTable';
import AppInfoHeader 		  from './AppInfoHeader';
import AppScreenshotSlider    from './AppScreenshotSlider';
import AppDetailHeader        from './AppDetailHeader'
import AppDescription         from './AppDescription';

import { defineProps, computed } from 'vue';

const props = defineProps({
	appDetailData: {
		type: Object,
		default: () => {}
	},
	installedList: {
		type: Array,
		default: () => {}
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
		default: () => {}
	}
	});

	const archTitle = computed(() => {
		// 如果是 arm 默认显示 armv7
		if (props.arch === 'arm') {
			return 'armv7'
		}
		return props.arch
	});

	const unusable = computed(() => {
		return !props.appDetailData.architectures?.includes(props.arch);
	});
</script>

<style scoped>

.app-detail {
	overflow: auto;
	height: 100%;
}

</style>