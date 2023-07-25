<template>
	<div class="is-flex mt-5 mb-5 is-justify-content-center">
		<!-- Cate Start -->
		<transition name="slide-fade">
			<div v-if="!activeAppStoreSourceInput || !isMobile"
				class="mr-2 _polymorphic is-flex is-align-items-center _dropdown">
				<b-dropdown v-model="currentCate" :max-height="240" :mobile-modal="false"
							animation="fade1"
							aria-role="list" class="app-select file-dropdown" scrollable>
					<template #trigger="{ active }">
						<div
							class="is-text auto-height pl-0 pt-0 pb-0 is-flex is-align-items-center">
							<b-icon class="mr-1 _dropdown__typeIcon" custom-size="mdi-18px"
								icon="category"
								pack="casa">
							</b-icon>
							<span class="has-text-full-03">{{ currentCate.name }}</span>
							<b-icon :icon="active ? 'chevron-up' : 'chevron-down'"
									class="ml-2 _dropdown__stateIcon"
									custom-size="casa-16px"></b-icon>
						</div>
					</template>
					<b-dropdown-item v-for="menu in cateMenu" :key="menu.id"
						:class="menu.id == currentCate.id?'is-active':''"
						:data-title="menu.count"
						:value="menu" aria-role="listitem"
						class="_dropdown__item">
						<div class="media is-align-items-center is-flex has-text-full-03"
							@click="messageBus('appstore_type', menu.name)">
							<div class="media-content">
								<h3>{{ menu.name }}</h3>
							</div>
						</div>
					</b-dropdown-item>
				</b-dropdown>

			</div>
		</transition>
		<!-- Cate End -->


		<!-- Author Start -->
		<transition name="slide-fade">
			<div v-if="!activeAppStoreSourceInput || !isMobile"
				class="_polymorphic is-flex is-align-items-center _dropdown">
				<b-dropdown v-model="currentAuthor" :max-height="240" :mobile-modal="false"
							animation="fade1" aria-role="list" class="app-select file-dropdown"
							position="is-bottom-right" scrollable>
					<template #trigger="{ active }">
						<div
							class="is-text auto-height pl-0 pt-0 pb-0 is-flex is-align-items-center">
							<b-icon class="mr-1 _dropdown__typeIcon" custom-size="mdi-18px"
									icon="posted-by-outline"
									pack="casa"></b-icon>
							<span class="has-text-full-03">{{ currentAuthor.name }}</span>
							<b-icon :icon="active ? 'chevron-up' : 'chevron-down'"
									class="ml-2 _dropdown__stateIcon"
									custom-size="casa-16px"></b-icon>
						</div>
					</template>
					<b-dropdown-item v-for="menu in authorMenu" :key="menu.id"
						:class="menu.id == currentAuthor.id?'is-active':''"
						:data-title="menu.count"
						:value="menu" aria-role="listitem"
						class="_dropdown__item">
						<div class="media is-align-items-center is-flex has-text-full-03"
							@click="handleAuthorOptionClick(menu.name)">
							<div class="media-content">
								<h3>{{ menu.name }}</h3>
							</div>
						</div>
					</b-dropdown-item>
				</b-dropdown>

			</div>
		</transition>
		<!-- Author End -->

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
				@keyup.enter.native="counterPatchGetStoreList++"></b-input>

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
import { defineProps, ref } from 'vue';
import messageBus from '@/events';
import AppStoreSourceManagement                 from "@/components/Apps/AppStoreSourceManagement.vue";

const props = defineProps({
	pageList: {
		type: Array,
		default: () => {}
	},
	cateMenu: {
		type: Array,
		default: () => {}
	},
	authorMenu: {
		type: Array,
		default: () => {}
	},
	activeAppStoreSourceInput: {
		type: Boolean,
		default: false
	},
	isMobile: {
		type: Boolean,
		default: false
	},
	refreshAppStoreSourceManagementSizeStatus: {
		type: Function,
		default: () => {}
	},
	searchAndSourcesStatus: {
		type: String,
		default: 'showSearch'
	},
	searchAndSourcesStatusController: {
		type: Function,
		default: () => {}
	},
	resetSearchAndSourcesStatus: {
		type: Function,
		default: () => {}
	},
	debounceSearchInput: {
		type: Function,
		default: () => {}
	},
	getStoreList: {
		type: Function,
		default: () => {}
	},
})


const currentAuthor = ref({count: 0, font: "author", id: 0, name: "All"});
const currentCate = ref({count: 0, font: "author", id: 0, name: "All"});


const handleAuthorOptionClick = (author) => {
	// currentAuthor.value = author;
	messageBus('appstore_author', author.name)
};

</script>