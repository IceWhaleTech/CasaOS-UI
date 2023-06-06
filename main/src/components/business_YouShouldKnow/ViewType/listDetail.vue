<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/3 下午2:52
  * @FilePath: /CasaOS-UI/main/src/components/business_YouShouldKnow/listDetail.vue
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
	<div v-if="noticeData.contentType === 'list'"
		 class="info is-flex is-flex-direction-column is-justify-content-space-around is-flex-grow-1">
		<div class="_widget-body is-flex mr-0">
			<div class="image is-24x24 is-flex-shrink-0">
				<img v-if="!noticeData.content[Object.keys(noticeData.content)[0]].icon"
					 :src="require(`@/assets/img/logo/casa-white.svg`)" alt=""/>
				<img v-else
					 :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[0]].icon}`)"
					 alt=""/>
			</div>
			<div class="body-title is-flex-grow-1 _nowrap ml-2">
				{{ $t(noticeData.content[Object.keys(noticeData.content)[0]].title) }}
			</div>
			<div class="has-text-left is-size-14px _nowrap">
				<span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[0]].value }}</span>
			</div>
		</div>
		<div v-if="Object.keys(noticeData.content).length > 1" class="line _ml-2rem"></div>
		<div v-if="Object.keys(noticeData.content).length > 1" class="_widget-body is-flex mr-0">
			<div class="image is-24x24 is-flex-shrink-0">
				<img v-if="!noticeData.content[Object.keys(noticeData.content)[1]].icon"
					 :src="require(`@/assets/img/logo/casa-white.svg`)" alt=""/>
				<img v-else
					 :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[1]].icon}`)"
					 alt=""/>
			</div>
			<div class="body-title is-flex-grow-1 _nowrap ml-2">
				{{ $t(noticeData.content[Object.keys(noticeData.content)[1]].title) }}
			</div>
			<p class="has-text-left is-size-14px _nowrap">
				<span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[1]].value }}</span>
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
._widget-body {
	align-items: center;
	position: relative;

	.body-title {
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: hsla(208, 16%, 96%, 1);
	}
}

._nowrap {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>