<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:23
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 22:17:58
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/Storage/DriveItem.vue
-->
<template>
	<div class="mb-5 mt-2">
		<div class="is-flex mb-2">
			<div class="header-icon">
				<b-image :src="require('@/assets/img/storage/disk.png')" class="is-64x64"></b-image>
			</div>
			<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
				<div>
					<h4 class="title is-size-14px mb-3 has-text-left one-line">{{ item.name }}</h4>
					<p class="has-text-left is-size-7 ">{{ item.model }}, {{ renderSize(item.size) }} {{ item.disk_type
						}}</p>
				</div>
			</div>
			<div class="is-flex is-align-items-center status pri-min-width">
				<div>
					<p class="has-text-left is-size-7 mb-3">{{ $t('Health') }}: <b v-if="item.health"
																				   class="has-text-success">{{
						$t('Healthy') }}</b><b
					v-if="!item.health" class="has-text-danger">{{ $t('Damage') }}</b></p>
					<p class="has-text-left is-size-7 ">{{ $t('Temp') }}: <b v-if="item.temperature > 0">{{
						item.temperature }}°C
						/ {{ item.temperature | toFahrenheit }}°F</b> <b v-else>N/A</b></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';

export default {
	name: "drive-item",
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: null
		},
	},
}
</script>
<style lang="scss" scoped>
.pri-min-width {
	min-width: 7.5rem;
}
</style>
