<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/21 下午3:18
  * @FilePath: /CasaOS-UI/main/src/components/Apps/AppStoreSourceManagement.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import {defineEmits, defineProps, getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import {vOnClickOutside}                                                               from '@vueuse/components'

const emit = defineEmits(["refreshAppStore"]);
const props = defineProps(['totalApps']);
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
const clickedInCompontent = ref(false)
const ignoreElRef = ref()
const onClickOutsideHandler = [
	(ev) => {
		changeInputState()
	},
	{ignore: [ignoreElRef]}
]

function changeInputState() {
	if (componentState.value !== 'active_input_state') {
		// if (clickedInCompontent.value) {
		// 	clickedInCompontent.value = false
		// 	return
		// }
		componentState.value = "active_input_state"
	} else if (sourceList.value.length > 0) {
		componentState.value = "second_list_state"
	} else {
		componentState.value = "first_add_state"
	}
}

function registerAppStore(url) {
	if (!url) {
		return
	}
	clickedInCompontent.value = true
	addLoadingState.value = true
	app.$openAPI.appManagement.appStore.registerAppStore(url).then(res => {
		if (res.status === 200) {
			// handle
			addLoadingState.value = false;
			emit("refreshAppStore");
		}
	})
}

function unregisterAppStore(id) {
	removeLoadingState.value = true
	app.$openAPI.appManagement.appStore.unregisterAppStore(id).then(res => {
		removeLoadingState.value = false;
		emit("refreshAppStore");
	})
}

function redirectURL() {
	clickedInCompontent.value = true
	window.open("https://github.com/IceWhaleTech/CasaOS-AppStore", "_blank");
}

const addLoadingState = ref(false)
const removeLoadingState = ref(false)
const sourceList = ref([])
const url = ref("");
const operationSourceName = ref(-1);

watch(componentState, (newState, oldState) => {
	url.value = "";
	if (newState === "active_input_state") {
		nextTick(() => {
			app.$refs.inputSourceURL.focus()
		})
	}
})

onMounted(() => {
	app.$openAPI.appManagement.appStore.appStoreList().then(res => {
		if (res.status === 200) {
			const storeList = res.data.data.filter(item => {
				const pathname = new URL(item.url).pathname;
				const pathnameList = pathname.split("/");
				const sourceName = pathnameList[1] + "/" + pathnameList[2];

				if (pathnameList[1] === "IceWhaleTech") {
					return false
				} else {
					item.name = sourceName
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
	<div v-on-click-outside="onClickOutsideHandler">
		<div v-if="componentState==='first_add_state'" class="one-line" @click="changeInputState">+ {{
				$t("Add Source")
			}}
		</div>
		<div v-else-if="componentState === 'second_list_state'">
			<b-dropdown aria-role="menu" style="height: 2rem;">
				<template #trigger>
					<b-button icon-pack="casa" icon-right="down-outline">
						{{ props.totalApps }} APPS
					</b-button>
				</template>

				<b-dropdown-item
					v-for="item in sourceList" :key="item.id" aria-role="menu-item"
					custom>
					<div :ref="`removeButton${item.id}`" class="is-flex is-align-items-center">
						<span class="has-text-full-04 is-flex-grow-1 one-line">{{ item.name }}</span>
						<b-button v-if="operationSourceName !== item.id" class="is-flex-shrink-0 _button-icon"
								  icon-pack="casa" icon-right="trash-outline"
								  type="is-text" @click.native="operationSourceName = item.id"></b-button>
						<template v-else>
							<b-button class="is-flex-shrink-0 _button-icon" icon-pack="casa" icon-right="close-outline"
									  type="is-text" @click.native="operationSourceName = -1"></b-button>
							<b-button :loading="removeLoadingState" class="is-flex-shrink-0 _button-icon"
									  icon-pack="casa"
									  icon-right="check-outline" type="is-text"
									  @click.native="unregisterAppStore(item.id)"></b-button>
						</template>
					</div>
				</b-dropdown-item>
				<hr/>
				<b-dropdown-item>
					<a ref="ignoreElRef" class="one-line" @click="changeInputState">+ {{
							$t("Add Source")
						}}
					</a>
				</b-dropdown-item>
				<b-dropdown-item>
					<a class="one-line" href="https://github.com/IceWhaleTech/CasaOS-AppStore"> {{
							$t("More")
						}}
					</a>
				</b-dropdown-item>
			</b-dropdown>
		</div>
		<div v-else-if="componentState === 'active_input_state'" class="is-flex is-align-items-center">
			<b-input ref="inputSourceURL" v-model="url" :disabled="addLoadingState" class="is-flex-grow-1"
					 icon-pack="casa" icon-right="question-outline" icon-right-clickable
					 @icon-right-click="redirectURL"></b-input>
			<b-button :loading="addLoadingState" class="is-flex-shrink-0 _button-icon"
					  icon-pack="casa" icon-right="plus-outline"
					  @click="registerAppStore(url)">add
			</b-button>
		</div>
	</div>

</template>

<style lang="scss" scoped>
._button-icon {
	border: 0;
	box-shadow: none;
	background-color: transparent;

	&:focus {
		background-color: transparent;
		box-shadow: none;
	}
}
</style>