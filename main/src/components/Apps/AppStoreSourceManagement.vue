<script setup>
import { defineEmits, defineProps, getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";

const emit = defineEmits(["refreshAppStore", "refreshSize", "close"]);
const props = defineProps(['totalApps']);
import { vOnClickOutside } from '@vueuse/components'
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
const sourceDorpRef = ref(null)
const onClickOutsideHandler = [
	(ev) => {
		changeInputState(true)
	},
	{ ignore: [ignoreElRef] }
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
	if (sourceDorpRef.value) {
		sourceDorpRef.value.toggle();
	}
	window.open("https://awesome.casaos.io/content/3rd-party-app-stores/list.html", "_blank", "noopener");
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
				console.log(item.url);
				const isHttp = item.url.includes("http");
				const pathname = isHttp ? new URL(item.url).pathname : item.url;
				const pathnameList = pathname.split("/");
				const sourceName = isHttp ? pathnameList[1] : pathnameList[pathnameList.length - 1].split('.').slice(0, -1).join('.');
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
			componentState.value = storeList.length === 0 ? 'first_add_state' : 'second_list_state';
		}
	})
}

onMounted(() => {
	getSourceList()
	subscribe("app-store:register-end", res => {
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
			<b-button v-if="componentState === 'first_add_state'" @click="changeInputState" icon-pack="casa"
				icon-left="plus-outline">
				{{ $t("Add Source") }}
			</b-button>
			<div v-else-if="componentState === 'second_list_state'" key="2">
				<b-dropdown aria-role="menu" position="is-bottom-left" class="file-dropdown source-dropdown"
					animation="fade1" :close-on-click="false" ref="sourceDorpRef">
					<template #trigger="{ active }">
						<b-button icon-pack="casa" :icon-right="active ? 'up-outline' : 'down-outline'">
							{{ props.totalApps }} apps
						</b-button>
					</template>

					<b-dropdown-item v-for="item in sourceList" :key="item.id" aria-role="menu-item" custom>
						<p :ref="`removeButton${item.id}`" class="is-flex is-align-items-center">
							<span class="has-text-full-04 is-flex-grow-1 one-line">{{ item.name }}</span>
							<template v-if="operationSourceName !== item.id">
								<b-icon class="close-button" custom-size="casa-16px" icon="trash-outline" pack="casa"
									@click.native="operationSourceName = item.id" />
							</template>
							<template v-else>
								<b-icon class="close-button" custom-size="casa-16px" icon="close-outline" pack="casa"
									@click.native="operationSourceName = -1" />
								<b-icon class="close-button" custom-size="casa-16px" icon="check-outline" pack="casa"
									@click.native="unregisterAppStore(item.id)" />
							</template>
						</p>
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item @click="changeInputState">
						<span :ref="ignoreElRef" class="one-line"> {{
							$t("Add Source")
						}}
						</span>
					</b-dropdown-item>
					<b-dropdown-item @click="redirectURL">
						<span class="one-line"> {{
							$t("More")
						}}
						</span>
					</b-dropdown-item>
				</b-dropdown>
			</div>
			<div v-else-if="componentState === 'active_input_state'" key="3" class="is-flex is-align-items-center">
				<b-field class="mb-0">
					<b-input class="_sources_input" ref="inputSourceURL" v-model="url" :disabled="addLoadingState"
						v-on:keyup.enter.native="registerAppStore(url)"></b-input>
					<b-tooltip label="Get more apps" position="is-bottom" class="add-tooltip" type="is-dark"
						:class="{ disabled: addLoadingState }">
						<b-icon class="is-clickable" icon="question-outline" pack="casa" size="is-small"
							@click.native="redirectURL" />
					</b-tooltip>
					<p class="control">
						<b-button class="_sources_input" @click="registerAppStore(url)" :loading="addLoadingState">{{
							$t("Add") }}</b-button>
					</p>
				</b-field>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.source-dropdown {
	::v-deep .dropdown-menu {
		min-width: 11rem !important;
	}
}

.add-tooltip {
	border-top: 1px solid #CFCFCF !important;
	border-bottom: 1px solid #CFCFCF !important;
	align-items: center !important;
	padding-right: 0.25rem;

	&.disabled {
		background-color: hsl(0, 0%, 96%) !important;
	}
}

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
	height: 2rem !important;

	::v-deep .input {
		height: 2rem !important;
		border-right: 0 !important;
	}

	::v-deep span.icon {
		height: 2rem !important;
		width: 2rem !important;

		i {
			font-size: 1rem !important;
		}
	}
}

.management-change-enter-active {
	transition: all .3s ease;
}

.management-change-enter {
	transform: translateX(-10px);
	opacity: 0;
}

.management-change-leave-to {
	opacity: 0;
}
</style>