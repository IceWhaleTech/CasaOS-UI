<template>
	<div class="app-desc mt-4 mb-6">
		<p class="is-size-14px mb-2 un-break-word">{{ i18n(appDetailData.tagline) }}</p>
		<p class="is-size-14px un-break-word">{{ i18n(appDetailData.description) }}</p>
		<!-- <p class="is-size-14px " v-html="appDetailData.tip"></p> -->
	</div>
</template>

<script setup>
import { defineProps } from 'vue';
import { usei18n } from '@/composables/usei18n';

const { i18n } = usei18n();

const props = defineProps({
	appDetailData: {
		type: Object,
		default: () => {
		}
	}
});

defineExpose({
	i18n
})
</script>