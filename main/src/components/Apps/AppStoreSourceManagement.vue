<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/21 下午3:18
  * @FilePath: /CasaOS-UI/main/src/components/Apps/AppStoreSourceManagement.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";

/*
* 0. 初始化状态
* @查询列表 为空则显示第一种状态、有数据则显示第二种状态
* */

/* 1. 第一次打开，为添加按钮，
* 此时点击 @出现输入框
* @添加 this.$openAPI.appManagement.appStore.registerAppStore(url).then(res=>{})
* @完成添加，等待结果 socketIO 通知
*
* @返回结果之后，更改状态
*
* */

/*
* 2. 第二次打开 为下拉列表
* @查询列表 this.$openAPI.appManagement.appStore.appStoreList().then(res => {})
*
* */
const app = getCurrentInstance().proxy
const componentState = ref("init")
// const
const stateBox = {
	init: "init",
	first_add_state: "first_add_state",
	second_list_state: "second_list_state",
	active_input_state: "active_input_state"
}

function changeInputState() {
	if (componentState.value !== 'active_input_state') {
		componentState.value = "active_input_state"
	}
}

function registerAppStore(url) {
	app.$openAPI.appManagement.appStore.registerAppStore(url).then(res => {
		if (res.status === 200) {
		}
	})
}

function unregisterAppStore(id) {
	app.$openAPI.appManagement.appStore.unregisterAppStore(id);
}

class StateMachine {
	constructor(initialState) {
		this.state = initialState;
	}

	handleEvent(event) {
		// 状态转变逻辑
	}
}

const sourceList = ref([
	{url: "https://github.com/WisdomSky/CasaOS-Appstore/archive/refs/heads/main.zip", name: 'Data station'},
	{url: "https://github.com/WisdomSky/CasaOS-Appstore/archive/refs/heads/main.zip", name: 'Remote Access'},
	{url: "https://github.com/WisdomSky/CasaOS-Appstore/archive/refs/heads/main.zip", name: 'File Manage'},
])

const url = ref("");
const operationSourceName = ref("");

onMounted(() => {
	// new StateMachine("init")
	app.$openAPI.appManagement.appStore.appStoreList().then(res => {
		if (res.status === 200) {
			const storeList = res.data.data.filter(item => {
				let hostname = new URL(item.url).pathname.split("/")[1];
				if (hostname === "IceWhaleTech") {
					return false
				} else {
					item.name = hostname
					return true
				}
			})
			sourceList.value = storeList.map(item => {
				return {
					id: item.id,
					url: item.url,
					name: item.name
				}
			})
			switch (storeList.length) {
				case 0:
					componentState.value = 'first_add_state';
					break;
				default:
					componentState.value = 'second_list_state';
					break;
			}
		}
	})

})
</script>

<script>
export default {
	sockets: {
		"app-store:register-end"(res) {
		},
		"app-store:register-error"(res) {
		},
	}
}
</script>

<template>
	<div>
		<div v-if="componentState==='first_add_state'" class="one-line" @click="changeInputState">+ {{
				$t("Add Source")
			}}
		</div>
		<div v-else-if="componentState === 'second_list_state'">
			<b-dropdown multiple style="height: 2rem;">
				<template #trigger>
					<b-button icon-pack="casa" icon-right="down-outline">
						{{ }} items selected
					</b-button>
				</template>

				<b-dropdown-item
					v-for="item in sourceList" :key="item.name" :value="item.name"
					@click="">
					<div class="is-flex is-align-items-center">
						<span class="has-text-full-04 is-flex-grow-1">{{ item.name }}</span>
						<b-icon v-if="operationSourceName !== item.name" class="is-flex-shrink-0"
								icon="trash-outline" pack="casa"
								@click="operationSourceName = item.name"></b-icon>
						<template v-else>
							<b-icon class="is-flex-shrink-0" icon="checkmark-xs-outline" pack="casa"
									@click="operationSourceName = ''"></b-icon>
							<b-icon class="is-flex-shrink-0" icon="check-outline" pack="casa"
									@click="unregisterAppStore(item.id)"></b-icon>
						</template>
					</div>

				</b-dropdown-item>
			</b-dropdown>
		</div>
		<div v-else-if="componentState === 'active_input_state'" class="is-flex is-align-items-center">
			<b-input v-model="url" class="is-flex-grow-1"></b-input>
			<span class="is-flex-shrink-0" @click="registerAppStore(url)">add</span>
		</div>
	</div>

</template>

<style lang="scss" scoped>

</style>