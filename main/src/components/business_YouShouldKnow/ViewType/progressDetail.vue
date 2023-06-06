<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/3 下午2:53
  * @FilePath: /CasaOS-UI/main/src/components/business_YouShouldKnow/progressDetail.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import {defineProps} from 'vue'

const props = defineProps({
	noticeData: Object
})
</script>

<template>
	<div v-if="noticeData.contentType === 'progress'"
		 class="info is-flex is-flex-direction-column is-justify-content-center is-flex-grow-1">
		<div :title="noticeData.content.text"
			 class="has-text-grey-200 _is-normal mb-2 is-flex-wrap-nowrap _nowrap">
			{{ noticeData.content.text }}
		</div>
		<b-progress :value="noticeData.content.value" size="c-is-small" type="is-primary"></b-progress>
	</div>
</template>

<style lang="scss" scoped>
::v-deep .progress.c-is-small {
	height: 0.75rem !important;
	border-radius: 0.5rem;
}
</style>