<!--
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-08-09 15:05:16
 * @FilePath: /CasaOS-UI/main/src/components/AppStore/AppConditionSelector/AppConditionSelector.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<template>
	<div class="is-flex mt-5 mb-5 is-justify-content-center app-condition-selector">
		<ListBox
		:activeAppStoreSourceInput="activeAppStoreSourceInput"
		:currentOption="currentCategory"
		:handleOptionClickCallBack="handleCategoryOptionClick"
		:isMobile="isMobile"
		:listData="categoryMenu"
		icon="category"
		@update-current-option="updateCurrentCategory"
		></ListBox>

		<ListBox
		:activeAppStoreSourceInput="activeAppStoreSourceInput"
		:currentOption="currentAuthor"
		:isMobile="isMobile"
		:listData="authorMenu"
		icon="posted-by-outline"
		@update-current-option="updateCurrentAuthor"
		></ListBox>

		<transition name="search-fade">
			<b-icon
			v-if="searchAndSourcesStatus === 'showSources'"
			class="is-flex is-align-self-center cursor-pointer"
			icon="search-outline"
			pack="casa"
			@click.native="searchAndSourcesStatusController"
			></b-icon>
		</transition>

		<transition name="search-fade">
			<b-input
			v-if="searchAndSourcesStatus !== 'showSources'"
			ref="search_app"
			v-on-click-outside="searchAndSourcesStatusController"
			:placeholder="$t('Search an app...')"
			class="app-search cursor-pointer"
			type="text"
			@input="debounceSearchInput"
			@keyup.enter.native="counterPatchGetStoreList++"
			>
			</b-input>
		</transition>

		<div class="is-flex-grow-1"></div>

		<AppStoreSourceManagement
		v-show="searchAndSourcesStatus !== 'showSearch'"
		:totalApps="pageList.length"
		class="ml-2"
		@refreshAppStore="getStoreList"
		@refreshSize="refreshAppStoreSourceManagementSizeStatus"
		>
		</AppStoreSourceManagement>
	</div>
</template>

<script setup>
import {defineEmits, defineProps, onMounted, ref, watch, nextTick} from "vue";
import {vOnClickOutside}                                           from '@vueuse/components'

// TODO import ListBox from kit not a file.
import ListBox                  from "@/kit/ListBox/ListBox.vue";
import AppStoreSourceManagement from "@/components/Apps/AppStoreSourceManagement.vue";
import messageBus               from "@/events";
import openAPI                  from "@/service/index.js";
import {ice_i18n}               from "@/mixins/base/common-i18n";
import debounce                 from "lodash/debounce";

const emit = defineEmits([
	"update-pageList",
	"update-installed-list",
	"update-isLoading",
	"update-isLoadError",
	"update-searchKey",
]);

const props = defineProps({
	pageList: {
		type: Array,
		default: () => {
		},
	},
	isMobile: {
		type: Boolean,
		default: false,
	},
	installedList: {
		type: Array,
		default: () => {
		},
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
});

const search_app = ref(null);
const categoryMenu = ref([]);
const authorMenu = [
	{count: 0, font: "author", id: 0, name: "All"},
	{count: 1, font: "author", id: 1, name: "official"},
	{count: 2, font: "author", id: 2, name: "by_casaos"},
	{count: 3, font: "author", id: 3, name: "community"},
];

const currentAuthor = ref(authorMenu[0]);
const updateCurrentAuthor = (value) => {
	currentAuthor.value = value;
};

const currentCategory = ref({count: 0, font: "category", id: 0, name: "All"});
const updateCurrentCategory = (value) => {
	currentCategory.value = value;
};

const searchAndSourcesStatus = ref("");
const activeAppStoreSourceInput = ref(false);

const searchAndSourcesStatusController = () => {
	// Status for three. One of them is "showSearch", "showSources", "showAll"
	if (props.isMobile && searchAndSourcesStatus.value === "showSources") {
		searchAndSourcesStatus.value = "showSearch";
	} else if (props.isMobile) {
		searchAndSourcesStatus.value = "showSources";
	} else {
		searchAndSourcesStatus.value = "showAll";
	}
};

const refreshAppStoreSourceManagementSizeStatus = (status) => {
	if (status === "active_input_state") {
		activeAppStoreSourceInput.value = true;
	} else {
		activeAppStoreSourceInput.value = false;
	}
};

const getCategoryList = async () => {
	emit("update-isLoading", true);
	try {
		const categoryMenuRes = await openAPI.appManagement.appStore
		.categoryList()
		.then((res) =>
		res.data.data.filter((item) => {
			return item.count > 0;
		})
		);
		categoryMenu.value = categoryMenuRes;
		currentCategory.value = categoryMenuRes[0];
	} catch (error) {
		emit("update-isLoadError", true);
	} finally {
		emit("update-isLoading", false);
	}
};

onMounted(async () => {
	await getCategoryList();
	await getStoreList();
	searchAndSourcesStatusController();

	!props.isMobile &&
	nextTick().then(() => {
		search_app.value.focus();
	});
});

const getStoreList = async () => {
	emit("update-isLoading", true);
	try {
		let {name: category} = currentCategory.value;
		let {name: authorType} = currentAuthor.value;
		if (category === "All") {
			category = undefined;
		}
		if (authorType === "All") {
			authorType = undefined;
		}
		const res = await openAPI.appManagement.appStore
		.composeAppStoreInfoList(category, authorType)
		.then((res) => res.data.data);

		const formattedList = Object.keys(res.list).map((id) => {
			const mainAppInfo = res.list[id];
			return {
				id,
				category: mainAppInfo.category,
				icon: mainAppInfo.icon,
				tagline: ice_i18n(mainAppInfo.tagline),
				thumbnail: mainAppInfo.thumbnail || mainAppInfo.screenshot_link?.[0],
				title: ice_i18n(mainAppInfo.title),
				state: 0,
				architectures: mainAppInfo.architectures,
			};
		});
		emit("update-pageList", formattedList);
		emit("update-installedList", res.installed);
	} catch (e) {
		console.log("load store list error", e);
	}
	emit("update-isLoading", false);
};

const handleCategoryOptionClick = (category) => {
	messageBus("appstore_type", category.name);
};

const handleAuthorOptionClick = (author) => {
	// TODO the `appstore_author` message bus is not implemented in the backend
	messageBus("appstore_author", author.name);
};

watch(currentCategory, (val) => {
	getStoreList();
	handleCategoryOptionClick(val);
});

watch(currentAuthor, (val) => {
	getStoreList();
	handleAuthorOptionClick(val);
});

const debounceSearchInput = debounce(function (e) {
	emit("update-searchKey", e);
}, 250);
</script>

<style scoped>
.app-condition-selector {
	display: flex;
	gap: 10px;
}
</style>
