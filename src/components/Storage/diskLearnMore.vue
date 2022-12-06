<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/2 下午8:57
  * @FilePath: /CasaOS-UI/src/components/Storage/diskLearnMore.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div>
		<header class="is-flex is-align-items-center mt-4 mb-2 ml-4 mr-4">
			<div class="is-flex-grow-1 ml-2">
				<h3 class="">12345</h3>
			</div>
			<!--			<img alt="" src="@/assets/img/learn/learnmore.svg" @click="close">-->
			<b-icon custom-class="mr-1" icon="close" size="is-medium" @click="close"></b-icon>
		</header>
		<section>
			<div class="learnmore">
				<div v-show="setps === 1" class="learnmore__title">
					<h3>什么是磁盘空间</h3>
					<p>磁盘空间是指您的设备上可用于存储数据的空间。磁盘空间越大，您可以存储的数据就越多。</p>
					<img alt="" src="@/assets/img/learn/diskLearnMore-1.svg"/>
				</div>
				<div v-show="setps === 2" class="learnmore__title">
					<h3>什么是磁盘空间</h3>
					<p>磁盘空间是指您的设备上可用于存储数据的空间。磁盘空间越大，您可以存储的数据就越多。</p>
					<img alt="" src="@/assets/img/learn/diskLearnMore-2.svg">
				</div>
				<div v-show="setps === 3" class="learnmore__title">
					<h3>什么是磁盘空间</h3>
					<p>磁盘空间是指您的设备上可用于存储数据的空间。磁盘空间越大，您可以存储的数据就越多。</p>
					<img alt="" src="@/assets/img/learn/diskLearnMore-3.svg">
				</div>
			</div>
		</section>
		<footer>
			<div>
				<b-button>

				</b-button>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	name: "diskLearnMore.vue",
	data() {
		return {
			setps: 1,
		};
	},
	methods: {
		close() {
			this.$emit("close");
		},
	},
}
</script>

<style scoped>

</style>
