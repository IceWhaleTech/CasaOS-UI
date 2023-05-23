<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/5/23 下午2:03
  * @FilePath: /CasaOS-UI/main/src/components/Storage/DriveItem.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:23
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 22:17:58
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/Storage/DriveItem.vue
-->
<template>
	<div class="mb-4 background-item is-flex">
		<div class="is-flex mt-3 mr-3 mb-3 ml-3 is-flex-grow-1">
			<div class="header-icon">
				<b-image :src="require('@/assets/img/storage/disk.png')" class="is-64x64"></b-image>
			</div>
			<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
				<div>
					<h4 class="mb-3 has-text-left one-line has-text-emphasis-02">{{ item.name }}</h4>
					<p class="has-text-left has-text-full-04">{{ item.model }}, {{ renderSize(item.size) }} {{
							item.disk_type
						}}</p>
				</div>
			</div>
			<div class="is-flex is-align-items-center status pri-min-width">
				<div>
					<p class="has-text-left has-text-full-04 mb-3">{{ $t('Health') }}: <b v-if="item.health"
																						  class="has-text-success">{{
							$t('Healthy')
						}}</b><b
						v-if="!item.health" class="has-text-danger">{{ $t('Damage') }}</b></p>
					<p class="has-text-left has-text-full-04 ">{{ $t('Temp') }}: <b v-if="item.temperature > 0">{{
							item.temperature
						}}°C
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

.background-item {
	background-color: hsla(208, 16%, 98%, 1);
	border-radius: 0.5rem;
}
</style>
