<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/5/23 下午3:19
  * @FilePath: /CasaOS-UI/main/src/components/basicComponents/helper/helper.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<template v-if="isOpen">
	<div class="is-flex is-align-items-center is-justify-content-center background-tips">
		<div>
			<p class="has-text-title-06">Tips:</p>
			<p class="has-text-full-03">Insert more hard drives and restart.</p>
		</div>
		<b-image :src="require('@/assets/img/learn/tips-insertMoreDrives.svg')"></b-image>
		<b-icon v-if="can_close" class="ml-3" icon="close-outline" pack="casa" size="is-small" @click="close"></b-icon>
	</div>
</template>
<script setup>
import {defineProps} from 'vue'

const props = defineProps({
	title: {
		type: String,
		default: 'Tips'
	},
	content: {
		type: String,
		default: 'Insert more hard drives and restart.'
	},
	img: {
		type: String,
		default: '@/assets/img/learn/helper-insertMoreDrives.svg'
	},
	can_close: {
		type: Boolean,
		default: true
	},
})
let isOpen = true;
// can_close event
const close = () => {
	console.log('close')
	isOpen = false
}

</script>
<style lang="scss" scoped>
.background-tips {
	background-color: hsla(208, 16%, 98%, 1);
	border: 1px solid hsla(208, 16%, 91%, 1);
	border-radius: 0.5rem;
}
</style>