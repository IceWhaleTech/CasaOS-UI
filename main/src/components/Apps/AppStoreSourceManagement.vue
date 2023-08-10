<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/6/21 下午3:18
  * @FilePath: /CasaOS-UI/main/src/components/Apps/AppStoreSourceManagement.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import {getCurrentInstance, onBeforeUnmount, onMounted, ref} from "vue";
import {vOnClickOutside}                                     from '@vueuse/components'

const emit = defineEmits(["refreshAppStore", "refreshSize"]);
const props = defineProps(['totalApps']);
/*
const stateBox = {
	init: "init",
	first_add_state: "first_add_state",
	second_list_state: "second_list_state",
	active_input_state: "active_input_state"
}
* 0. Initialization status
* @If the query list is empty, the first state is displayed, and the second state is displayed if there is data
* */

/* 1. First open, add a button，
* While click
* @The input box appears
* @Adding this.$openAPI.appManagement.appStore.registerAppStore(url).then(res=>{})
* @Finish adding and wait for the resulting socketIO notification
*
* @After the results are returned, change the status
*
* */

/*
* 2.Open the second time for the drop-down list
* @Query the list: this.$openAPI.appManagement.appStore.appStoreList().then(res => {})
*
* */
const app = getCurrentInstance().proxy
const subscribe = app.$socket.$subscribe
const unsubscribe = app.$socket.$unsubscribe
const componentState = ref("init")
const ignoreElRef = ref(null)
const onClickOutsideHandler = [
	(ev) => {
		changeInputState(true)
	},
	{ignore: [ignoreElRef]}
]

const addLoadingState = ref(false)
const removeLoadingState = ref(false)
const sourceList = ref([])
const url = ref("");
const operationSourceName = ref(-1);

function changeInputState(alwaysNotDisplay = false) {
	if (componentState.value !== 'active_input_state') {
		if (alwaysNotDisplay === true) {
			return
		}
		componentState.value = "active_input_state";
		emit("refreshSize", "active_input_state");
	} else if (sourceList.value.length > 0) {
		componentState.value = "second_list_state";
		emit("refreshSize", "second_list_state");
	} else {
		componentState.value = "first_add_state";
		emit("refreshSize", "first_add_state");
	}
}

function registerAppStore(url) {
	if (url) {
		addLoadingState.value = true
		app.$openAPI.appManagement.appStore.registerAppStore(url)
	}
}

function unregisterAppStore(id) {
	removeLoadingState.value = true;
	app.$openAPI.appManagement.appStore.unregisterAppStore(id).then(res => {
		if (res.status === 200) {
			emit("refreshAppStore");
			getSourceList();
		}
	}).finally(() => {
		operationSourceName.value = -1;
		removeLoadingState.value = false;
	})
}

function redirectURL() {
	window.open("https://awesome.casaos.io/content/3rd-party-app-stores/list.html", "_blank");
}

function activeInput() {
	if (componentState.value === "active_input_state") {
		app.$refs.inputSourceURL.focus()
	}
}

function getSourceList() {
	app.$openAPI.appManagement.appStore.appStoreList().then(res => {
		if (res.status === 200) {
			const storeList = res.data.data.filter(item => {
				const pathname = new URL(item.url).pathname;
				const pathnameList = pathname.split("/");
				const sourceName = pathnameList[1]// + "/" + pathnameList[2];

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
}

onMounted(() => {
	getSourceList()
	subscribe("app-store:register-end", res => {
		console.log(res)
		app.$buefy.toast.open({
			message: "Updating the information source of the app store is complete.",
			duration: 5000,
			type: 'is-success'
		})
		getSourceList();
		emit("refreshAppStore");
		url.value = "";
		addLoadingState.value = false;
	})
	subscribe("app-store:register-error", res => {
		app.$buefy.toast.open({
			message: "Failed to update the information source of the app store.",
			duration: 5000,
			type: 'is-warning'
		})
		url.value = "";
		addLoadingState.value = false;
	})
})

onBeforeUnmount(() => {
	unsubscribe("app-store:register-end");
	unsubscribe("app-store:register-error");
})
</script>

<template>
	<div v-on-click-outside="onClickOutsideHandler">
		<Transition mode="out-in" name="management-change" @after-enter="activeInput">
			<div v-if="componentState==='first_add_state'" key="1" class="one-line cursor-pointer"
				 @click="changeInputState">+ {{
					$t("Add Source")
				}}
			</div>
			<div v-else-if="componentState === 'second_list_state'" key="2">
				<b-dropdown aria-role="menu" position="is-bottom-left" style="height: 2rem;">
					<template #trigger>
						<b-button icon-pack="casa" icon-right="down-outline">
							{{ props.totalApps }} APPS
						</b-button>
					</template>

					<b-dropdown-item
					v-for="item in sourceList" :key="item.id" aria-role="menu-item"
					custom>
						<p :ref="`removeButton${item.id}`" class="is-flex is-align-items-center">
							<span class="has-text-full-04 is-flex-grow-1 one-line">{{ item.name }}</span>
							<b-button v-if="operationSourceName !== item.id" class="is-flex-shrink-0 _button-icon"
									  icon-pack="casa" icon-right="trash-outline"
									  type="is-text" @click.native="operationSourceName = item.id"></b-button>
							<template v-else>
								<b-button class="is-flex-shrink-0 _button-icon" icon-pack="casa"
										  icon-right="close-outline"
										  type="is-text" @click.native="operationSourceName = -1"></b-button>
								<b-button :loading="removeLoadingState" class="is-flex-shrink-0 _button-icon"
										  icon-pack="casa"
										  icon-right="check-outline" type="is-text"
										  @click.native="unregisterAppStore(item.id)"></b-button>
							</template>
						</p>
					</b-dropdown-item>
					<hr class="mt-1 mb-1"/>
					<b-dropdown-item @click="changeInputState">
						<a :ref="ignoreElRef" class="one-line"> {{
								$t("Add Source")
							}}
						</a>
					</b-dropdown-item>
					<b-dropdown-item @click="redirectURL">
						<a class="one-line"> {{
								$t("More")
							}}
						</a>
					</b-dropdown-item>
				</b-dropdown>
			</div>
			<div v-else-if="componentState === 'active_input_state'" key="3" class="is-flex is-align-items-center">
				<b-input ref="inputSourceURL" v-model="url" :disabled="addLoadingState"
						 class="is-flex-grow-1 _sources_input cursor-pointer" icon-pack="casa"
						 icon-right="question-outline"
						 icon-right-clickable @icon-right-click="redirectURL"></b-input>
				<b-button :loading="addLoadingState" class="is-flex-shrink-0 _button-icon"
						  icon-pack="casa" icon-right="plus-outline"
						  @click="registerAppStore(url)">add
				</b-button>
			</div>
		</Transition>
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

._sources_input {
	::v-deep .input {
		height: 2rem !important;
	}

	::v-deep span.icon {
		height: 2rem !important;
		width: 2rem !important;
	}
}

.management-change-enter-active {
	transition: all .3s ease;
}

//.slide-fade-leave-active {
//	transition: opacity 0;
//}

.management-change-enter {
	transform: translateX(-10px);
	opacity: 0;
}

.management-change-leave-to {
	opacity: 0;
}
</style>