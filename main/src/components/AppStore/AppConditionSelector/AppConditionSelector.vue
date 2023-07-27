<template>
	<div class="is-flex mt-5 mb-5 is-justify-content-center app-condition-selector">
		<ListBox
			icon="category"
			:activeAppStoreSourceInput="activeAppStoreSourceInput"
			:isMobile="isMobile"
			:current="currentCategory"
			:menuData="categoryMenu"
			:handleOptionClickCallBack="handleCategoryOptionClick"
			@update-current-option="updateCurrentCategory"
		></ListBox>

		<ListBox
			icon="posted-by-outline"
			:activeAppStoreSourceInput="activeAppStoreSourceInput"
			:isMobile="isMobile"
			:current="currentAuthor"
			:menuData="authorMenu"
			:handleOptionClickCallBack="handleAuthorOptionClick"
			@update-current-option="updateCurrentAuthor"
		></ListBox>

		<transition name="search-fade">
			<b-icon v-if="searchAndSourcesStatus === 'showSources'"
					class="is-flex is-align-self-center" icon="search-outline"
					pack="casa"
					@click.native="searchAndSourcesStatusController"></b-icon>
		</transition>
		<transition name="search-fade">

		<b-input v-if="searchAndSourcesStatus !== 'showSources'"
			ref="search_app"
			:placeholder="$t('Search an app...')"
			class="app-search"
			type="text"
			@input="debounceSearchInput"
			@keyup.enter.native="counterPatchGetStoreList++">
		</b-input>

		</transition>
		<div class="is-flex-grow-1"></div>
		<AppStoreSourceManagement v-show="searchAndSourcesStatus !== 'showSearch'"
			:totalApps="pageList.length" class="ml-2"
			@refreshAppStore="getStoreList"
			@refreshSize="refreshAppStoreSourceManagementSizeStatus">
		</AppStoreSourceManagement>
	</div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive, watch, onMounted } from 'vue';
import messageBus from '@/events';
import AppStoreSourceManagement                 from "@/components/Apps/AppStoreSourceManagement.vue";
import openAPI from '@/service/index.js'
import {ice_i18n}                               from "@/mixins/base/common-i18n";
import debounce                                 from 'lodash/debounce'

import {ListBox} from "@/kit";

const emit = defineEmits([
	'update-pageList',
	'updateInstalledList',
	'updateIsLoading',
	'updateIsLoadError',
	"updateSearchKey"
	// 'updateCategoryMenu'
])

const props = defineProps({
	pageList: {
		type: Array,
		default: () => {}
	},
	isMobile: {
		type: Boolean,
		default: false
	},
	installedList: {
		type: Array,
		default: () => {}
	},
	isLoading: {
		type: Boolean,
		default: false
	},
})

const categoryMenu = ref([]);
const authorMenu =  [
	{count: 0, font: "author", id: 0, name: "All"},
	{count: 1, font: "author", id: 1, name: "official"},
	{count: 2, font: "author", id: 2, name: "by_casaos"},
	{count: 3, font: "author", id: 3, name: "community"}
]

const currentAuthor = ref(authorMenu[0]);
const updateCurrentAuthor = (value)=>{
	currentAuthor.value = value
}


const currentCategory = ref({count: 0, font: "category", id: 0, name: "All"});
const updateCurrentCategory = (value)=>{
	currentCategory.value = value
}

const searchAndSourcesStatus = ref("")
const activeAppStoreSourceInput = ref(false)

// const resetSearchAndSourcesStatus = () => {
// 	switch (props.isMobile) {
// 		case true:
// 			searchAndSourcesStatus.value = 'showSources'
// 			break;
// 		case false:
// 			searchAndSourcesStatus.value = 'showAll'
// 			break;
// 	}
// }

const searchAndSourcesStatusController = () => {
	// Status for three. One of them is "showSearch", "showSources", "showAll"
	if (props.isMobile && searchAndSourcesStatus.value === "showSources") {
		searchAndSourcesStatus.value = "showSearch";
	} else if (props.isMobile) {
		searchAndSourcesStatus.value = "showSources";
	} else {
		searchAndSourcesStatus.value = "showAll";
	}
}

const refreshAppStoreSourceManagementSizeStatus = (status) =>{
	if (status === "active_input_state") {
		activeAppStoreSourceInput.value = true
	} else {
		activeAppStoreSourceInput.value = false
	}
}

const getCategoryList = async() => {
	emit('updateIsLoading',true)
	try {
		const categoryMenuRes = await openAPI.appManagement.appStore.categoryList().then(res => res.data.data.filter((item) => {
			return item.count > 0
		}));
		categoryMenu.value = categoryMenuRes
		currentCategory.value = categoryMenuRes[0]
		// currentSort = this.sortMenu[0]
		// if (this.isFirst) {
		// 	this.isFirst = false
		// }
	} catch (error) {
		// this.loadErrorStep = 1
		emit('updateIsLoading',false)
		emit('updateIsLoadError',true)
	}
	emit('updateIsLoading',false)

}

onMounted(async () => {
	console.log("init")
	await getCategoryList()
	await getStoreList()
	searchAndSourcesStatusController()
})

const getStoreList = async () => {
	emit('updateIsLoading',true)
	try {
		const category = currentCategory.value.name
		const authorType = currentAuthor.value.name
		let res;
		if (authorType !== 'All' && category !== 'All') {
			res = await openAPI.appManagement.appStore.composeAppStoreInfoList(category, authorType).then(res => res.data.data)
		} else if (authorType !== 'All') {
			res = await openAPI.appManagement.appStore.composeAppStoreInfoList(undefined, authorType).then(res => res.data.data)
		} else if (category !== 'All') {
			res = await openAPI.appManagement.appStore.composeAppStoreInfoList(category, undefined, false).then(res => res.data.data)
		} else {
			res = await openAPI.appManagement.appStore.composeAppStoreInfoList().then(res => res.data.data)
		}
		const list = res.list
		const listRes = Object.keys(list).map(id => {
			const main_app_info = list[id]
			return {
				id,
				category: main_app_info.category,
				icon: main_app_info.icon,
				tagline: ice_i18n(main_app_info.tagline),
				thumbnail: main_app_info.thumbnail || main_app_info.screenshot_link?.[0],
				title: ice_i18n(main_app_info.title),
				state: 0,
				architectures: main_app_info.architectures,
				// scheme: main_app_info.apps[id].scheme,
				// port: main_app_info.apps[id].port_map,
				// index: main_app_info.apps[id].index,
			}
		})
		emit('update-pageList', listRes)
		emit('updateInstalledList',res.installed)
	} catch (e) {
		console.log('load store list error', e)
	}
	emit('updateIsLoading',false)
}

const handleCategoryOptionClick = (category) => {
	messageBus('appstore_type', category.name)
	// TODO to fix the bug
	getStoreList()

};

const handleAuthorOptionClick = (author) => {
	messageBus('appstore_author', author.name)
	getStoreList()
};

const debounceSearchInput =  debounce(function (e) {
	// this.searchKey = e;
	emit('updateSearchKey',e)
}, 250)


</script>

<style  scoped>
.app-condition-selector{
	display: flex;
	gap: 10px;
}
</style>