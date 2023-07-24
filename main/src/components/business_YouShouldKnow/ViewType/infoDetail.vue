<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/3 下午2:52
  * @FilePath: /CasaOS-UI/main/src/components/business_YouShouldKnow/infoDetail.vue
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
	<div v-if="noticeData.contentType === 'info'" class="is-flex is-align-items-center is-flex-grow-1 _content">
		<img v-if="noticeData.content.icon" :src="noticeData.content.icon" alt=""
			 class="image is-64x64 is-flex-shrink-0 mr-2"/>
		<div class="_des-text has-text-full-03">
			{{ $t(noticeData.content.text) }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
._content {
	padding: 0.625rem 2rem 0.75rem 2rem;

	._des-text {
		height: 5rem;
		word-wrap: break-word;
		white-space: pre-line;
		overflow: hidden;
		width: auto;
		text-overflow: ellipsis;
		-webkit-line-clamp: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
}
</style>