<template>
	<div class="is-flex mt-5 mb-5 is-justify-content-center app-condition-selector">
		<ListBox
			icon="category"
			:activeAppStoreSourceInput="activeAppStoreSourceInput"
			:isMobile="isMobile"
			:currentOption="currentCategory"
			:listData="categoryMenu"
			:handleOptionClickCallBack="handleCategoryOptionClick"
			@update-current-option="updateCurrentCategory"
		></ListBox>

		<ListBox
			icon="posted-by-outline"
			:activeAppStoreSourceInput="activeAppStoreSourceInput"
			:isMobile="isMobile"
			:currentOption="currentAuthor"
			:listData="authorMenu"
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
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';

import ListBox  from "@/kit/ListBox/ListBox.vue";
import AppStoreSourceManagement                 from "@/components/Apps/AppStoreSourceManagement.vue";

import messageBus from '@/events';
import openAPI from '@/service/index.js'
import { ice_i18n }                               from "@/mixins/base/common-i18n";
import debounce                                 from 'lodash/debounce'


const emit = defineEmits([
	'update-pageList',
	'update-installed-list',
	'update-isLoading',
	'update-isLoadError',
	"update-searchKey"
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
	emit('update-isLoading',true)
	try {
		const categoryMenuRes = await openAPI.appManagement.appStore.categoryList().then(res => res.data.data.filter((item) => {
			return item.count > 0
		}));
		categoryMenu.value = categoryMenuRes
		currentCategory.value = categoryMenuRes[0]
		// if (this.isFirst) {
		// 	this.isFirst = false
		// }
	} catch (error) {
		// this.loadErrorStep = 1
		emit('update-isLoading',false)
		emit('update-isLoadError',true)
	}
	emit('update-isLoading',false)
}

onMounted(async () => {
	await getCategoryList()
	await getStoreList()
	searchAndSourcesStatusController()
})

const getStoreList = async () => {
	emit('update-isLoading',true)
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
		emit('update-installedList',res.installed)
	} catch (e) {
		console.log('load store list error', e)
	}
	emit('update-isLoading',false)
}

const handleCategoryOptionClick = (category) => {
	messageBus('appstore_type', category.name)
};

const handleAuthorOptionClick = (author) => {
	// TODO the `appstore_author` message bus is not implemented in the backend
	messageBus('appstore_author', author.name)
};


watch(currentCategory, (val) => {
	getStoreList()
	handleCategoryOptionClick(val)
})

watch(currentAuthor, (val) => {
	getStoreList()
	handleAuthorOptionClick(val)
})

const debounceSearchInput =  debounce(function (e) {
	emit('update-searchKey',e)
}, 250)

</script>

<style  scoped>
.app-condition-selector{
	display: flex;
	gap: 10px;
}
</style>