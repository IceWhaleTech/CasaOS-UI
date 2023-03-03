<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-01 21:10:57
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-07 21:07:35
 * @FilePath: \CasaOS-UI-0.4.2\src\components\Apps\AppPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.

-->
<template>
	<div
		:class="{'narrow': currentSlide > 0 ,'card-width': isFirstInstall}"
		class="app-card modal-card">
		<!--    first setting！！ apps installation location-->
		<template v-if="isFirstInstall">
			<header class="modal-card-head b-line">
				<div class="is-flex-grow-1">
					<h3 class="is-flex-grow-1 title is-3 pri-line-height has-text-black">{{
							$t('Apps Installation Location')
						}}</h3>
				</div>
				<!--				<button class="delete" type="button" @click="$emit('close')"/>-->
				<b-icon class="_polymorphic" icon="close" pack="casa"
				        @click.native="$emit('close'); $messageBus('appstore_close')"/>
			</header>
			<p class="modal-card-body">
				{{ $t('Please choose a location with enough storage space and stable connection.') }}
				<span class="has-text-danger">
		            {{ $t('(Cannot be changed)') }}
		        </span>
			</p>
			
			<section class="modal-card-body is-overlay">
				<AppsInstallationLocation v-for="(item,index) in storageData" :key="'storage'+index" :item="item"
				                          :scence="storage_item_scence"
				                          @selection="getSelection"></AppsInstallationLocation>
			</section>
		</template>
		<!--    first setting have done!!-->
		<template v-else>
			<!-- Sidebar Start -->
			<app-side-bar v-model="sidebarOpen" :overlay="true" :right="true" position="absolute">
				<template slot-scope="{close}">
					<div class="modal-card app-detial">
						<!-- Header Start -->
						<header class="modal-card-head" style="background:#ff000">
							<div class="is-flex-grow-1">
								<div class="button is-ghost auto-height pl-0 pt-0 pb-0" @click="close">
									<b-icon class="mr-1" icon="chevron-left" size="is-medium"></b-icon>
									{{ $t('Back') }}
								</div>
							</div>
						</header>
						<!-- Header End -->
						<section id="ss-content" class="modal-card-body">
							<!-- App Info Header Start -->
							<div class="app-header is-flex pb-4 b-line">
								<div class="header-icon mr-5">
									<b-image :key="appDetailData.icon" :src="appDetailData.icon"
									         :src-fallback="require('@/assets/img/app/default.svg')"
									         class="is-128x128 icon-shadow"
									         webp-fallback=".jpg"></b-image>
								</div>
								<div class="is-flex-grow-1 is-flex is-align-items-center">
									<div>
										<h4 class="title store-title is-4 ">{{ appDetailData.title }}</h4>
										<p class="subtitle is-size-14px two-line mb-3">{{ appDetailData.tagline }}</p>
										<p class="description mb-2">
											<b-button v-if="appDetailData.state===0" :disabled="unuseable"
											          :loading="appDetailData.id == currentInstallId"
											          rounded size="is-normal" type="is-primary"
											          @click="qucikInstall(appDetailData.id);$messageBus('appstore_install', appDetailData.title)">
												{{ $t('Install') }}
											</b-button>
											<b-button v-if="appDetailData.state===1"
											          :loading="appDetailData.id == currentInstallId" rounded
											          size="is-normal" type="is-primary"
											          @click="openThirdContainerByAppInfo(appDetailData)">
												{{ $t('Open') }}
											</b-button>
										</p>
										
										<p v-if="unuseable"
										   class="has-background-red-tertiary has-text-red has-text-full-04 _is-normal is-flex is-align-items-center font pr-2"
										   style="width: fit-content;height: 1.5rem;border-radius: 0.25rem">
											<label class="is-flex ml-2 mr-1">
												<b-icon class="is-16x16" custom-size="casa-19px" icon="close"
												        pack="casa"></b-icon>
											</label>
											{{ $t('Not compatible with {arch} devices.', {arch}) }}
										</p>
									
									</div>
								</div>
							</div>
							<!-- App Info Header End -->
							<!-- App Info Table Start -->
							<nav class="level is-mobile mt-4">
								<div class="level-item has-text-centered">
									<div>
										<p class="heading">{{ $t('CATEGORY') }}</p>
										<p class="title">
											<b-icon :icon="appDetailData.category_font" custom-size="mdi-36px"></b-icon>
										</p>
										<p class="footing is-size-14px">{{ appDetailData.category }}</p>
									</div>
								</div>
								<div class="level-item has-text-centered">
									<div>
										<p class="heading">{{ $t('DEVELOPER') }}</p>
										<p class="title">
											<b-icon custom-size="mdi-36px" icon="account-circle-outline"></b-icon>
										</p>
										<p class="footing is-size-14px">{{ appDetailData.developer }}</p>
									</div>
								</div>
								<div class="level-item has-text-centered">
									<div>
										<p class="heading "><span class="is-hidden-mobile">{{
												$t('REQUIRE')
											}} </span>{{ $t('MEMORY') }}</p>
										<p class="title has-text-weight-normal">{{ appDetailData.min_memory }}</p>
										<p class="footing is-size-14px">MB</p>
									</div>
								</div>
								<div class="level-item has-text-centered">
									<div>
										<p class="heading"><span class="is-hidden-mobile">{{
												$t('REQUIRE')
											}} </span>{{ $t('DISK') }}</p>
										<p class="title has-text-weight-normal">{{ appDetailData.min_disk }}</p>
										<p class="footing is-size-14px">MB</p>
									</div>
								</div>
							</nav>
							<!-- App Info Table End -->
							
							<!-- App Info Slider Start -->
							<div v-if="showDetailSwiper" class="is-relative">
								<swiper ref="infoSwiper" :options="swiperOptions"
								        class="swiper swiper-responsive-breakpoints">
									<swiper-slide v-for="item in appDetailData.screenshot_link" :key="'sc'+item">
										<div class="gap">
											<b-image :src="item"
											         :src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
											         class="border-8" placeholder ratio="16by9"></b-image>
										</div>
									</swiper-slide>
								
								</swiper>
								<div :class="{'swiper-button-disabled':disPrev}" class="swiper-button-prev"
								     @click="$refs.infoSwiper.$swiper.slidePrev()"></div>
								<div :class="{'swiper-button-disabled':disNext}" class="swiper-button-next"
								     @click="$refs.infoSwiper.$swiper.slideNext()"></div>
							</div>
							
							<!-- App Info Slider End -->
							
							<!-- App Info  Start -->
							<div class="app-desc mt-4 mb-6">
								<p class="is-size-14px mb-2 un-break-word">{{ appDetailData.tagline }}</p>
								<p class="is-size-14px un-break-word">{{ appDetailData.description }}</p>
								<!-- <p class="is-size-14px " v-html="appDetailData.tip"></p> -->
							</div>
							<!-- App Info  End -->
						
						</section>
					</div>
				
				</template>
			</app-side-bar>
			<!-- Sidebar End -->
			
			<!-- Modal-Card Header Start -->
			<header class="modal-card-head _b-line">
				<div class="is-flex-grow-1">
					<h3 class="_title is-5">{{ panelTitle }}</h3>
				</div>
				<div class="is-flex is-align-items-center">
					<b-button v-if="currentSlide == 0" :label="$t('Custom Install')" class="mr-2"
					          icon-left="view-grid-plus"
					          rounded size="is-small" type="is-primary" @click="currentSlide = 1"/>
					
					<b-tooltip v-if="showImportButton" :label="$t('Import')" position="is-bottom" type="is-dark">
						<button class="icon-button mdi mdi-import" type="button" @click="showImportPanel"/>
					</b-tooltip>
					
					<b-tooltip v-if="showTerminalButton" :label="$t('Terminal & Logs')" position="is-bottom"
					           type="is-dark">
						<button class="icon-button mdi mdi-console" type="button" @click="showTerminalPanel"/>
					</b-tooltip>
					
					<b-tooltip v-if="showExportButton" :label="$t('Export AppFile')" position="is-bottom"
					           type="is-dark">
						<button class="icon-button mdi mdi-export-variant" type="button" @click="exportJSON"/>
					</b-tooltip>
					<div v-if="currentSlide < 2"
					     class="is-flex is-align-items-center modal-close-container modal-close-container-line ">
						<!--						<button class="delete" type="button" @click="$emit('close')"/>-->
						<b-icon class="_polymorphic" icon="close" pack="casa" @click.native="$emit('close')"/>
					</div>
					<div v-else-if="currentSlide === 2" class="is-flex is-align-items-center">
						<b-icon class="_polymorphic" icon="close" pack="casa" @click.native="$emit('close')"/>
					</div>
				
				</div>
			
			</header>
			<!-- Modal-Card Header End -->
			<!-- Modal-Card Body Start -->
			<section class="modal-card-body pt-3">
				<!-- App Store List Start -->
				<section v-if="currentSlide == 0 ">
					
					<template v-if="!isLoadError">
						
						<template v-if="recommendList.length > 0">
							<h3 class="title is-5 has-text-weight-normal">{{ $t('Featured Apps') }}</h3>
							<!-- Featured Slider Start -->
							<div class="is-relative featured-app b-line">
								<swiper ref="featureSwiper" :options="featureSwiperOptions" class="swiper ">
									<swiper-slide v-for="(item,index) in recommendList " :key="index+item.title+item.id"
									              class="pb-5">
										<div class="gap" @click="showAppDetial(item.id)">
											<b-image :placeholder="require('@/assets/img/app/swiper_placeholder.png')"
											         :src="item.thumbnail"
											         :src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
											         class="border-8 is-clickable"
											         ratio="16by9"></b-image>
										</div>
										<div class="is-flex pt-5 is-align-items-center">
											<div class=" mr-3" @click="showAppDetial(item.id)">
												<b-image :placeholder="require('@/assets/img/app/default.svg')"
												         :src="item.icon"
												         :src-fallback="require('@/assets/img/app/default.svg')"
												         class="is-64x64 is-clickable icon-shadow"></b-image>
											</div>
											<div class="is-flex-grow-1 mr-4 is-clickable"
											     @click="showAppDetial(item.id);$messageBus('appstore_detail', item.title)">
												<h6 class="title is-6 mb-2 ">{{ item.title }}</h6>
												<p class="is-size-7 two-line">{{ item.tagline }}</p>
											</div>
											<div>
												<b-button v-if="item.state===0" :loading="item.id == currentInstallId"
												          rounded size="is-small"
												          type="is-primary is-light"
												          @click="qucikInstall(item.id);$messageBus('appstore_install', item.title)">
													{{ $t('Install') }}
												</b-button>
												<b-button v-if="item.state===1" :loading="item.id == currentInstallId"
												          rounded size="is-small"
												          type="is-primary is-light"
												          @click="openThirdContainerByAppInfo(item)">{{ $t('Open') }}
												</b-button>
											</div>
										</div>
									</swiper-slide>
								
								</swiper>
								<div :class="{'swiper-button-disabled':disFeaturedPrev}" class="swiper-button-prev"
								     @click="$refs.featureSwiper.$swiper.slidePrev();$messageBus('appstore_slide')"></div>
								<div :class="{'swiper-button-disabled':disFeaturedNext}" class="swiper-button-next"
								     @click="$refs.featureSwiper.$swiper.slideNext();$messageBus('appstore_slide')"></div>
							</div>
						</template>
						<!-- Featured Slider End -->
						
						<!-- List condition Start -->
						<div class="is-flex mt-5 mb-5">
							<!-- Cate Start -->
							<div class="is-flex-grow-1">
								<b-dropdown v-model="currentCate" :mobile-modal="false" animation="fade1"
								            aria-role="list" class="app-select file-dropdown" position="is-bottom-right"
								            scrollable>
									<template #trigger="{ active }">
										<div class="button is-text auto-height pl-0 pt-0 pb-0 ">
											<b-icon :icon="currentCate.font" class="mr-1 ml-0" size="is-small"></b-icon>
											{{ currentCate.name }}
											<b-icon :icon="active ? 'chevron-up' : 'chevron-down'" class="ml-1"
											        size="is-normal"></b-icon>
										</div>
									</template>
									<b-dropdown-item v-for="menu in cateMenu" :key="menu.id"
									                 :class="menu.id == currentCate.id?'is-active':''"
									                 :data-title="menu.count"
									                 :value="menu" aria-role="listitem">
										<div class="media is-align-items-center is-flex"
										     @click="$messageBus('appstore_type', menu.name)">
											<b-icon :icon="menu.font" class="mr-1" size="is-small"></b-icon>
											<div class="media-content">
												<h3>{{ menu.name }}</h3>
											</div>
										</div>
									</b-dropdown-item>
								</b-dropdown>
							
							</div>
							<!-- Cate End -->
							
							<!-- Sort Start -->
							<div>
								{{ $t('Sort by') }}:
								<b-dropdown v-model="currentSort" :mobile-modal="false" animation="fade1"
								            aria-role="list" class="app-select file-dropdown"
								            position="is-bottom-right">
									<template #trigger="{ active }">
										<div class="button is-text auto-height pl-0 pt-0 pb-0 is-size-14px">
											{{ currentSort.name }}
											<b-icon :icon="active ? 'chevron-up' : 'chevron-down'" class="ml-1"
											        size="is-normal"></b-icon>
										</div>
									
									</template>
									<b-dropdown-item v-for="(menu,index) in sortMenu" :key="'sort_'+index"
									                 :class="menu.slash == currentSort.slash?'is-active':''"
									                 :value="menu" aria-role="listitem">
										<div class="media align-items-center is-flex"
										     @click="$messageBus('appstore_sort', menu.name)">
											<div class="media-content">
												<h3>{{ menu.name }}</h3>
											</div>
										</div>
									</b-dropdown-item>
								</b-dropdown>
							</div>
							<!-- Sort End -->
						</div>
						
						<!-- List condition End -->
						<!-- App list Start-->
						<div class="columns f-list is-multiline is-mobile pb-3 mb-5">
							<div v-for="(item,index) in pageList" :key="index+item.title+item.id"
							     class="column app-item is-one-quarter">
								<div class="is-flex  is-align-items-center">
									<div class="list-icon mr-4 is-clickable" @click="showAppDetial(item.id)">
										<b-image :src="item.icon"
										         :src-fallback="require('@/assets/img/app/default.svg')"
										         class="is-64x64 icon-shadow" webp-fallback=".jpg"></b-image>
									</div>
									<div class="is-flex-grow-1 mr-4 is-clickable"
									     @click="showAppDetial(item.id);$messageBus('appstore_detail', item.title)">
										<h6 class="title is-6 mb-2">{{ item.title }}</h6>
										<p class="is-size-7 two-line">{{ item.tagline }}</p>
									</div>
								
								</div>
								<div class="mt-1 ml-7 is-flex is-align-items-center">
									<div class="is-flex-grow-1 is-size-7 has-text-grey-light	">{{
											item.category
										}}
									</div>
									<b-button v-if="item.state===0" :loading="item.id == currentInstallId" rounded
									          size="is-small"
									          type="is-primary is-light"
									          @click="qucikInstall(item.id);$messageBus('appstore_install', item.title)">
										{{ $t('Install') }}
									</b-button>
									<b-button v-if="item.state===1" :loading="item.id == currentInstallId" rounded
									          size="is-small"
									          type="is-primary is-light" @click="openThirdContainerByAppInfo(item)">
										{{ $t('Open') }}
									</b-button>
								</div>
							</div>
						</div>
						
						<!-- App list End-->
						
						<!-- Community App List Start -->
						<template v-if="communityList.length > 0">
							<h3 class="title is-5 has-text-weight-normal">{{ $t('Community Apps') }}</h3>
							<h3 class="subtitle is-7 has-text-grey-light">
								{{
									$t('From community contributors, not optimized for CasaOS, but provides a basic App experience.')
								}}
							</h3>
							
							<div class="columns f-list is-multiline is-mobile  pb-3 mb-5">
								<div v-for="(item,index) in communityList " :key="index+item.title+item.id"
								     class="column is-one-quarter">
									<div class="is-flex  is-align-items-center">
										<div class="list-icon mr-4 is-clickable" @click="showAppDetial(item.id)">
											<b-image :src="item.icon"
											         :src-fallback="require('@/assets/img/app/default.svg')"
											         class="is-64x64 icon-shadow" webp-fallback=".jpg"></b-image>
										</div>
										<div class="is-flex-grow-1 mr-4 is-clickable"
										     @click="showAppDetial(item.id);$messageBus('appstorecommunity_detail', item.title)">
											<h6 class="title is-6 mb-2">{{ item.title }}</h6>
											<p class="is-size-7 two-line">{{ item.tagline }}</p>
										</div>
									
									</div>
									<div class="mt-1 ml-7 is-flex is-align-items-center">
										<div class="is-flex-grow-1 is-size-7 has-text-grey-light	">
											{{ item.category }}
										</div>
										<b-button v-if="item.state===0" :loading="item.id == currentInstallId" rounded
										          size="is-small"
										          type="is-primary is-light"
										          @click="qucikInstall(item.id);$messageBus('appstorecommunity_install', item.title)">
											{{
												$t('Install')
											}}
										</b-button>
										<b-button v-if="item.state===1" :loading="item.id == currentInstallId" rounded
										          size="is-small"
										          type="is-primary is-light" @click="openThirdContainerByAppInfo(item)">
											{{ $t('Open') }}
										</b-button>
									</div>
								</div>
							</div>
						</template>
						
						<!-- Community App List End -->
					</template>
					<template v-else>
						<div class="is-flex is-align-items-center is-justify-content-center mt-6 mb-6">
							<div class=" has-text-centered mt-6 mb-6">
								<div class="is-flex is-align-items-center mb-5">
									<b-icon class="mr-2" icon="alert-circle" type="is-danger"></b-icon>
									{{ $t('There was an error loading the data, please try again!') }}
								</div>
								
								<b-button rounded type="is-primary" @click="retry()">Retry</b-button>
							
							</div>
						
						</div>
					</template>
				
				</section>
				<!-- App Store List End -->
				
				<!-- App Install Form Start -->
				<section v-if="currentSlide == 1">
					<!--:config-data="initConfigData"-->
					<ComposeConfig ref="compose" :cap-array="capArray"
					               :docker-compose-commands="configDataString"
					               :is-casa="isCasa" :networks="networks" :state="state"
					               :total-memory="totalMemory"
					               @updateConfigDataCommands="updateConfig"></ComposeConfig>
				</section>
				<!-- App Install Form End -->
				
				<!-- App Install Process Start -->
				<section v-if="currentSlide == 2" class="_b-line">
					<div class="installing-warpper mb-5">
						<div class="is-flex is-align-items-center is-justify-content-center">
							<lottie-animation :animationData="require('@/assets/ani/loading.json')" :autoPlay="true"
							                  :loop="true"
							                  class="install-animation mt-5 mb-2"></lottie-animation>
						</div>
						<b-progress
							:value="totalPercentage"
							format="percent"
							show-value type="is-primary"></b-progress>
						<h3 :class="currentInstallAppTextClass" class="title is-6 has-text-centered"
						    style="height: 20px"
						    v-html="currentInstallAppText"></h3>
					</div>
				</section>
				<!-- App Install Process End -->
				<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
			</section>
			<!-- Modal-Card Body End -->
		
		</template>
		<!-- Modal-Card Footer Start-->
		<footer :class="{'is-justify-content-center':currentSlide == 0}"
		        class="modal-card-foot is-flex is-align-items-center ">
			<template>
				<div class="is-flex-grow-1">
					<!-- <div v-if="currentSlide == 0">
					  <b-pagination v-if="listTotal > pageSize" :total="listTotal" v-model="pageIndex" range-before=1 range-after=1 order="is-centered" size="is-small" :simple="false" :rounded="true" :per-page="pageSize" icon-prev="chevron-left" icon-next="chevron-right" aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">
					  </b-pagination>
					</div> -->
				</div>
				<div>
					<b-button v-if="currentSlide == 2 && currentInstallAppError " :label="$t('Back')" rounded
					          @click="prevStep"/>
					<b-button v-if="currentSlide == 1 && state == 'install'" :label="$t('Install')" :loading="isLoading"
					          rounded type="is-primary" @click="installApp()"/>
					<b-button v-if="currentSlide == 1 && state == 'update'" :label="$t('Save')" :loading="isLoading"
					          rounded type="is-primary" @click="updateApp()"/>
					<b-button v-if="currentSlide == 2 && !currentInstallAppError" :label="$t(cancelButtonText)"
					          rounded type="is-primary" @click="$emit('close')"/>
					<b-button v-if="isFirstInstall" :label="$t('Submit')" :loading="isLoading" rounded type="is-primary"
					          @click="submitInstallationLocation(installationLocation)"/>
				</div>
			</template>
		
		</footer>
		<!-- Modal-Card Footer End -->
	
	</div>
</template>

<script>
import AppSideBar from './AppSideBar.vue'
import ImportPanel from '../forms/ImportPanel.vue'
import AppTerminalPanel from './AppTerminalPanel.vue'
import LottieAnimation from "lottie-web-vue";
import "@/plugins/vee-validate";
import debounce from 'lodash/debounce'
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import isNull from 'lodash/isNull'
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import FileSaver from 'file-saver';
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
// import AppsInstallationLocation from "@/components/Apps/AppsInstallationLocation";
// import storageItem from "@/components/Storage/StorageItem";
import AppsInstallationLocation from "@/components/Apps/AppsInstallationLocation";
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
import DockerProgress from "@/components/Apps/progress.js";

import ComposeConfig from "@/components/Apps/ComposeConfig.vue";
import YAML from "yamljs";

const data = [
	"AUDIT_CONTROL",
	"AUDIT_READ",
	"BLOCK_SUSPEND",
	"BPF",
	"CHECKPOINT_RESTORE",
	"DAC_READ_SEARCH",
	"IPC_LOCK",
	"IPC_OWNER",
	"LEASE",
	"LINUX_IMMUTABLE",
	"MAC_ADMIN",
	"MAC_OVERRIDE",
	"NET_ADMIN",
	"NET_BROADCAST",
	"PERFMON",
	"SYS_ADMIN",
	"SYS_BOOT",
	"SYS_MODULE",
	"SYS_NICE",
	"SYS_PACCT",
	"SYS_PTRACE",
	"SYS_RAWIO",
	"SYS_RESOURCE",
	"SYS_TIME",
	"SYS_TTY_CONFIG",
	"SYSLOG",
	"WAKE_ALARM"
]

export default {
	components: {
		AppSideBar,
		LottieAnimation,
		Swiper,
		SwiperSlide,
		AppsInstallationLocation,
		ComposeConfig,
	},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp],
	props: {
		id: String,
		state: String,
		storeId: {
			type: Number,
			default: 0
		},
		isCasa: {
			type: Boolean,
			default: true
		},
		runningStatus: String,
		configData: Object,
		settingData: {
			type: String,
		}
	},
	
	data() {
		return {
			timer: 0,
			data: [],
			isLoading: true,
			isFetching: false,
			isLoadError: false,
			loadErrorStep: 0,
			isFirst: true,
			errorType: 1,
			currentInstallAppName: null,
			currentInstallAppError: false,
			currentInstallAppType: null,
			currentInstallAppText: "",
			currentInstallAppProgress: {},
			currentInstallAppProgressTotals: {},
			
			sidebarOpen: false,
			cancelButtonText: "Cancel",
			totalMemory: 0,
			networks: [],
			tempNetworks: [],
			networkModes: [],
			initConfigData: {
				host: "",
				protocol: "http",
				port_map: null,
				cpu_shares: 10,
				memory: 300,
				restart: "always",
				label: "",
				position: true,
				index: "",
				icon: "",
				network_model: "",
				image: "",
				description: "",
				origin: "custom",
				ports: [],
				volumes: [],
				envs: [],
				devices: [],
				cap_add: [],
				cmd: [],
				privileged: false,
				host_name: "",
				container_name: "",
				appstore_id: 0,
			},
			configDataString: '',
			capArray: data,
			pageIndex: 1,
			pageSize: 5,
			listTotal: 0,
			pageList: {},
			communityList: {},
			recommendList: {},
			currentSlide: 0,
			currentInstallId: 0,
			
			//Image List Swiper
			disPrev: false,
			disNext: false,
			swiperOptions: {
				loop: false,
				autoplay: true,
				spaceBetween: 24,
				breakpoints: {
					640: {
						slidesPerView: 1
					},
					768: {
						slidesPerView: 2
					},
					1366: {
						slidesPerView: 3
					}
				},
				// on: {
				// 	slideChangeTransitionStart: this.handleInfoSlide
				// },
			},
			// Featured Swiper
			disFeaturedPrev: false,
			disFeaturedNext: false,
			featureSwiperOptions: {
				loop: false,
				autoplay: true,
				spaceBetween: 24,
				breakpoints: {
					640: {
						slidesPerView: 1
					},
					768: {
						slidesPerView: 2
					},
					1366: {
						slidesPerView: 3
					}
				},
				// on: {
				// 	slideChangeTransitionStart: this.handleFeaturedSlide
				// },
			},
			searchKey: "",
			currentCate: {},
			currentSort: {},
			cateMenu: [],
			sortMenu: [
				{icon: "", slash: "rank", name: "Popular"},
				{icon: "", slash: "new", name: "New"},
				{icon: "", slash: "name", name: "Name"},
			],
			storeQueryData: {
				index: 1,
				category_id: "",
				type: "rank",
				key: this.searchKey
			},
			//  App Detail info
			appDetailData: {},
			arch: "",
			// unusable: false, // computer unusable
			architectures: [],
			
			// APPs Installation Location - requirement document
			storageData: [{
				name: 12,
				isSystem: true,
				fsType: 'fsType',
				diskName: 'diakname',
				availSize: '1024',
				disk_type: 'type',
				path: 'path',
				mount_point: 'mount_point',
				usePercent: 20,
				model: 'model',
				size: 123,
				health: true,
				temperature: 100,
			}],
			storage_item_scence: 'select installation location',
			isFirstInstall: false,
			installationLocation: '',
			dockerProgress: null,
			totalPercentage: 0,
			configCommands: '',
		}
	},
	
	created() {
		//Get Max memory info form device
		this.totalMemory = Math.floor(this.configData.memory.total / 1048576);
		// this.initConfigData.memory = this.totalMemory
		
		//Handling network types
		this.tempNetworks = this.configData.networks;
		this.networkModes = uniq(this.tempNetworks.map(item => {
			return item.driver
		}))
		this.networks = this.networkModes.map(item => {
			let tempitem = {}
			tempitem.driver = item
			tempitem.networks = this.tempNetworks.filter(net => {
				return net.driver == item
			})
			return tempitem
		})
		this.networks = orderBy(this.networks, ['driver'], ['asc']);
		//If it is edit, Init data
		if (this.settingData != undefined) {
			this.isLoading = false
			// this.initConfigData = this.preProcessData(Object.assign(this.initConfigData, this.settingData))
			this.currentSlide = 1
			
		} else {
			// let gg = find(this.tempNetworks, (o) => {
			// 	return o.driver == "bridge"
			// }) || []
			// this.initConfigData.network_model = gg.length > 0 ? gg[0].name : "bridge";
			this.getCategoryList();
		}
		
		// If StoreId is not 0
		if (this.storeId != 0) {
			this.showAppDetial(this.storeId);
		}
		
		// prepare data - APPs Installation Location requirement document
		this.getDiskList();
		// close the function - APPs Installation Location
		// this.askInstallationLocation();
		
		// get architecture
		this.arch = localStorage.getItem('arch')
	},
	
	computed: {
		showImportButton() {
			return this.currentSlide == 1 && this.state == 'install'
		},
		showExportButton() {
			return this.currentSlide == 1 && this.state == 'update'
			
		},
		showTerminalButton() {
			return this.currentSlide == 1 && this.state == 'update' && this.runningStatus == 'running'
		},
		panelTitle() {
			if (this.currentSlide == 0) {
				return this.$t("App Store");
			} else if (this.currentSlide == 1) {
				if (!this.isCasa) {
					return this.$t("Import") + " " + this.initConfigData.label
				} else {
					return (this.settingData != undefined) ? this.initConfigData.label + " " + this.$t("Setting") : this.$t("Install a new App manually")
				}
				
			} else {
				return this.$t("Installing") + " " + this.initConfigData.image
			}
		},
		showDetailSwiper() {
			return (!this.appDetailData.screenshot_link) ? false : true;
		},
		currentInstallAppTextClass() {
			return this.currentInstallAppError ? 'has-text-danger' : 'has-text-black'
		},
		unuseable() {
			if (this.architectures.length === 0 || !this.arch) {
				return false
			}
			return this.architectures.indexOf(this.arch) < 0
		}
		
	},
	watch: {
		// Watch if Section index changes
		currentSlide(val) {
			if (val == 1) {
				this.isLoading = false;
			}
		},
		// Watch if initConfigData changes
		// initConfigData: {
		// 	handler(val) {
		// 		if (this.state == 'install') {
		// 			localStorage.setItem("app_data", JSON.stringify(val))
		// 		}
		// 	},
		// 	deep: true
		// },
		// initConfigData: {
		// 	handler(val) {
		// 		this.configDataString = YAML.stringify(val)
		// 	},
		// 	deep: true
		// },
		// Watch if the query data of app store changes
		storeQueryData: {
			handler() {
				this.getStoreList();
			},
			deep: true
		},
		// Watch if app cates changes
		currentCate: {
			handler(val) {
				if (!this.isFirst) {
					this.storeQueryData.category_id = val.id
				}
			},
			deep: true
		},
		// Watch if app sort changes
		currentSort: {
			handler(val) {
				if (!this.isFirst) {
					this.storeQueryData.type = val.slash
				}
			},
			deep: true
		}
	},
	methods: {
		// updateLabel: debounce(function (string) {
		// 	this.initConfigData.label = string
		// }, 50),
		
		/**
		 * @description:
		 * @param {*} swiper
		 * @return {*}
		 */
		/*handleInfoSlide(swiper) {
		  this.disPrev = (swiper.activeIndex == 0) ? true : false;
		  this.disNext = swiper.isEnd;
		},*/
		/**
		 * @description:
		 * @param {*} swiper
		 * @return {*}
		 */
		/*handleFeaturedSlide(swiper) {
		  this.disFeaturedPrev = (swiper.activeIndex == 0) ? true : false;
		  this.disFeaturedNext = swiper.isEnd;
		},*/
		
		/**
		 * @description: Get category list
		 * @param {*}
		 * @return {*} void
		 */
		async getCategoryList() {
			this.isLoading = true
			try {
				const res = await this.$api.appCategories.getAppCategory();
				this.cateMenu = res.data.data.filter((item) => {
					return item.count > 0
				})
				this.currentCate = this.cateMenu[0]
				this.currentSort = this.sortMenu[0]
				if (this.isFirst) {
					this.isFirst = false
				}
			} catch (error) {
				this.loadErrorStep = 1
				this.isLoading = false;
				this.isLoadError = true;
			}
			
		},
		
		/**
		 * @description: Get App store list
		 * @param {*}
		 * @return {*} void
		 */
		getStoreList() {
			this.isLoading = true
			this.$api.apps.getAppList(this.storeQueryData).then(res => {
				this.isLoading = false
				this.isLoadError = false
				if (res.data.success == 200) {
					// this.listTotal = res.data.data.count
					this.pageList = res.data.data.list
					this.communityList = res.data.data.community
					this.recommendList = res.data.data.recommend
				}
			}).catch(() => {
				this.loadErrorStep = 2
				this.isLoading = false;
				this.isLoadError = true;
			})
		},
		
		/**
		 * @description: Show the details of app
		 * @param {id} String
		 * @return {*} void
		 */
		showAppDetial(id) {
			this.isLoading = true;
			this.$api.apps.getAppInfo(id).then(resp => {
				this.isLoading = false;
				this.sidebarOpen = true;
				this.appDetailData = resp.data.data
				this.architectures = resp.data.data.architectures || [];
				// messageBus :: appstore_detail
				// this.$messageBus('appstore_detail', resp.data.data.title.toString())
			}).catch(() => {
				this.isLoading = false;
				this.$buefy.toast.open({
					message: this.$t(`There was an error loading the data, please try again!`),
					type: 'is-danger'
				})
			})
		},
		
		retry() {
			if (this.loadErrorStep === 1) {
				this.getCategoryList()
			} else if (this.loadErrorStep === 2) {
				this.getStoreList()
			}
		},
		
		
		/**
		 * @description: Quick Install App from app store
		 * @param {*}
		 * @return {*} void
		 */
		qucikInstall(id) {
			this.currentInstallId = id
			this.$api.apps.getAppInfo(id).then(resp => {
				if (resp.data.success == 200) {
					// messageBus :: installApp
					// this.$messageBus('appstore_install', respData.title.toString())
					resp.data.data.appstore_id = id
					this.configDataString = YAML.stringify(resp.data.data)
					
					// let respData = resp.data.data
					// this.initConfigData.protocol = respData.protocol
					// this.initConfigData.host = respData.host
					// this.initConfigData.port_map = respData.port_map
					// this.initConfigData.cpu_shares = 50
					// this.initConfigData.memory = respData.max_memory
					// this.initConfigData.restart = "always"
					// this.initConfigData.label = respData.title
					// this.initConfigData.position = true
					// this.initConfigData.index = respData.index
					// this.initConfigData.icon = respData.icon
					// this.initConfigData.network_model = respData.network_model
					// this.initConfigData.image = respData.image
					// this.initConfigData.description = respData.description
					// this.initConfigData.origin = respData.origin
					// this.initConfigData.ports = isNull(respData.ports) ? [] : respData.ports
					// this.initConfigData.volumes = isNull(respData.volumes) ? [] : respData.volumes
					// this.initConfigData.envs = isNull(respData.envs) ? [] : respData.envs
					// this.initConfigData.devices = isNull(respData.devices) ? [] : respData.devices
					// this.initConfigData.cap_add = isNull(respData.cap_add) ? [] : respData.cap_add
					// this.initConfigData.cmd = isNull(respData.cmd) ? [] : respData.cmd
					// this.initConfigData.privileged = respData.privileged
					// this.initConfigData.host_name = respData.host_name
					// this.initConfigData.appstore_id = id
					
					// currentInstallId is used to identify the app that is being installed
					this.currentInstallId = 0
					
					this.architectures = respData.architectures
					if (this.unuseable) {
						// this.showAppDetial(id);
						this.sidebarOpen = true;
						this.appDetailData = respData
						return
					}
					
					if (respData.tip !== "null" && respData.tip !== "[]" && respData.tip !== "") {
						this.$buefy.dialog.confirm({
							title: this.$t('Attention'),
							message: this.formatTips(respData.tip),
							type: 'is-dark',
							onConfirm: () => {
								this.sidebarOpen = false;
								this.installAppData()
							}
						})
					} else {
						this.sidebarOpen = false;
						this.installAppData()
					}
				}
			}).catch(() => {
				this.currentInstallId = 0
				this.$buefy.toast.open({
					message: this.$t(`There was an error loading the data, please try again!`),
					type: 'is-danger'
				})
			})
		},
		/**
		 * @description: Format AppStore tip datas
		 * @param {data}
		 * @return {html} Str
		 */
		formatTips(data) {
			let html = "";
			if (!isNull(data) && data != "") {
				JSON.parse(data).forEach(item => {
					html += "<span class=' is-size-14px un-break-word'>" + item.content + "</span>"
					if (item.value != '') {
						html += "<span class='tag is-primary ml-1'>" + item.value + "</span>"
					}
					html += "<br/>"
				})
			}
			return html
		},
		
		/**
		 * @description: Pre-processed data before setting
		 * @param {ConfigObject} data
		 * @return {ConfigObject} data
		 */
		preProcessData(data) {
			data.ports = isNull(data.ports) ? [] : data.ports
			data.volumes = isNull(data.volumes) ? [] : data.volumes
			data.envs = isNull(data.envs) ? [] : data.envs
			data.devices = isNull(data.devices) ? [] : data.devices
			data.cap_add = isNull(data.cap_add) ? [] : data.cap_add
			data.cmd = isNull(data.cmd) ? [] : data.cmd
			data.port_map = data.port_map === "" ? null : data.port_map
			data.cpu_shares = (data.cpu_shares === 0 || data.cpu_shares > 99) ? 90 : data.cpu_shares
			data.memory = data.memory === 0 ? this.totalMemory : data.memory
			data.restart = data.restart === "no" ? "unless-stopped" : data.restart
			data.network_model = data.network_model === "default" ? "bridge" : data.network_model
			data.icon = data.icon === "" ? this.getIconFromImage(data.image) : data.icon
			
			return data
		},
		
		/**
		 * @description: Get App icon form image
		 * @param {*} image
		 * @return {*}
		 */
		getIconFromImage(image) {
			if (image == "") {
				return ""
			} else {
				let appIcon = image.split(":")[0].split("/").pop();
				return `https://icon.casaos.io/main/all/${appIcon}.png`;
			}
		},
		
		/**
		 * @description: Process the datas before submit
		 * @param {*}
		 * @return {*} void
		 */
		processData() {
			
			this.initConfigData.cpu_shares = Number(this.initConfigData.cpu_shares)
			let model = this.initConfigData.network_model.split("-");
			this.initConfigData.network_model = model[0]
		},
		
		/**
		 * @description: Back to prev Step
		 * @param {*}
		 * @return {*} void
		 */
		prevStep() {
			this.currentSlide--;
		},
		
		/**
		 * @description: Validate form async
		 * @param {Object} ref ref of component
		 * @return {Boolean}
		 */
		async checkStep(ref) {
			let isValid = await ref.validate()
			return isValid
		},
		
		/**
		 * @description: Submit datas after valid
		 * @param {*}
		 * @return {*} void
		 */
		installApp() {
			this.$refs.compose.checkStep().then((valid) => {
				if (valid) {
					// this.installAppData(this.id);
					console.log(this.configCommands)
					this.isLoading = true;
					this.$api.container.installV2(this.configCommands,).then((res) => {
						// this.$openAPI.installComposeApp(this.configCommands).then((res) => {
						if (res.data.success == 200) {
							this.currentInstallAppName = res.data.data
							this.currentSlide = 2;
							this.currentInstallAppText = "Start Installation..."
							this.cancelButtonText = 'Continue in background'
							this.dockerProgress = new DockerProgress();
						} else {
							this.$buefy.toast.open({
								message: res.data.message,
								type: 'is-warning'
							})
						}
					}).catch(() => {
						this.$buefy.toast.open({
							message: this.$t(`There was an error loading the data, please try again!`),
							type: 'is-danger'
						})
					}).finally(() => {
						this.isLoading = false;
					});
				}
			})
			console.log('执行命令。', this.configCommands);
		},
		
		installAppData() {
			// this.processData();
			// this.isLoading = true;
			// this.$api.container.install(this.initConfigData).then((res) => {
			// 	this.isLoading = false;
			// 	if (res.data.success == 200) {
			// 		this.currentInstallAppName = res.data.data
			// 		this.currentSlide = 2;
			// 		this.currentInstallAppText = "Start Installation..."
			// 		this.cancelButtonText = 'Continue in background'
			// 		this.dockerProgress = new DockerProgress();
			// 	} else {
			// 		this.$buefy.toast.open({
			// 			message: res.data.message,
			// 			type: 'is-warning'
			// 		})
			// 	}
			// }).catch((err) => {
			// 	this.isLoading = false;
			// 	this.$buefy.toast.open({
			// 		message: err.response.data.message,
			// 		type: 'is-warning'
			// 	})
			// })
		},
		
		
		/**
		 * @description: Save edit update
		 * @return {*} void
		 */
		updateApp() {
			// this.processData();
			// this.isLoading = true;
			// let updateData = this.uuid2var(cloneDeep(this.initConfigData));
			// this.$api.container.update(this.id, updateData).then((res) => {
			// 	if (res.data.success == 200) {
			// 		this.isLoading = false;
			// 		this.$emit('updateState')
			// 	} else {
			// 		this.$buefy.toast.open({
			// 			message: res.data.message.data,
			// 			type: 'is-warning'
			// 		})
			// 	}
			// 	this.$emit('close')
			// }).catch((err) => {
			// 	this.isLoading = false;
			// 	this.$buefy.toast.open({
			// 		message: err.response.data.message,
			// 		type: 'is-warning'
			// 	})
			// })
		},
		
		/**
		 * @description: Show import panel
		 * @return {*} void
		 */
		showImportPanel() {
			this.$buefy.modal.open({
				parent: this,
				component: ImportPanel,
				hasModalCard: true,
				customClass: '',
				trapFocus: true,
				canCancel: ['escape'],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'update': (e) => {
						//localStorage.removeItem("app_data")
						// this.initConfigData = this.preProcessData(e)
						// if (this.initConfigData.icon == "") {
						// 	this.changeIcon(this.initConfigData.image)
						// }
						this.configDataString = e;
						// this.settingData = e;
						this.$buefy.dialog.alert({
							title: '⚠️ ' + this.$t('Attention'),
							message: '<div class="nobrk"><h4 class="title is-5">' + this.$t('AutoFill only helps you to complete most of the configuration.') + '</h4>' +
								'<p class="mb-3">' + this.$t('Some configuration information such as:') + '</p>' +
								'<ul>' +
								'<li>1. ' + this.$t('the port and path of the Web UI') + '</li>' +
								'<li>2. ' + this.$t('the mount location of the volume or file') + '</li>' +
								'<li>3. ' + this.$t('the port mapping of the Host') + '</li>' +
								'<li>4. ' + this.$t('optional configuration items') + '</li>' +
								'</ul>' +
								'<p class="mt-3">' + this.$t('These include but are not limited to these cases and <b>still need to be confirmed or modified by you.</b>') + '</p>' +
								'<p class="mt-3">' + this.$t('Feel free to suggest improvements to this feature in Discord Server!') + '</p></div>',
							type: 'is-dark'
						})
					}
				},
				props: {
					initData: this.initConfigData,
					netWorks: this.networks,
					oriNetWorks: this.tempNetworks,
					deviceMemory: this.totalMemory
				}
			})
		},
		
		/**
		 * @description: Export AppData to json file
		 * @param {*} function
		 * @return {*} void
		 */
		exportJSON() {
			let exportData = cloneDeep(this.initConfigData);
			exportData.network_model = this.getNetworkName(this.initConfigData.network_model);
			exportData.version = "1.0"
			exportData = this.uuid2var(exportData)
			delete exportData.memory
			const data = JSON.stringify(exportData);
			const blob = new Blob([data], {type: ''});
			FileSaver.saveAs(blob, `${exportData.label}.json`);
		},
		
		/**
		 * @description: change uuid to var
		 * @param {*} function
		 * @return {data} Object
		 */
		
		uuid2var(data) {
			data.volumes.forEach((item) => {
				item.host = item.host.replace(this.id, '$AppID');
			})
			data.devices.forEach((item) => {
				item.host = item.host.replace(this.id, '$AppID');
			})
			return data
		},
		
		/**
		 * @description: Get Network name from network list
		 * @param {*}
		 * @return {*} String
		 */
		getNetworkName(netId) {
			if (netId == "") {
				return "bridge"
			} else {
				let network = this.tempNetworks.filter(net => {
					return net.name == netId
				})
				return network[0].name
			}
		},
		
		/**
		 * @description: Show Terminal & Logs panel
		 * @return {*} void
		 */
		showTerminalPanel() {
			this.$buefy.modal.open({
				parent: this,
				component: AppTerminalPanel,
				hasModalCard: true,
				customClass: 'terminal-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					appid: this.id,
					appName: this.initConfigData.label
				}
			})
		},
		
		async getDiskList() {
			try {
				const storageRes = await this.$api.storage.list({system: "show"})
				const storageArray = []
				storageRes.data.data.forEach(item => {
					item.children.forEach(part => {
						part.disk = item.path
						part.diskName = item.disk_name
						storageArray.push(part)
					})
				})
				this.storageData = storageArray.map((storage) => {
					return {
						name: storage.label,
						isSystem: storage.diskName == "System",
						fsType: storage.type,
						size: storage.size,
						availSize: storage.avail,
						usePercent: 100 - Math.floor(storage.avail * 100 / storage.size),
						diskName: storage.drive_name,
						path: storage.path,
						mount_point: storage.mount_point,
						disk: storage.disk
					}
					
				})
			} catch (error) {
				console.log(error.response.message);
			}
		},
		
		getSelection(val) {
			this.installationLocation = val
		},
		
		async askInstallationLocation() {
			try {
				// get docker info
				let {data} = await this.$api.container.getInstallationLocation()
				switch (data.success) {
					case 200:
					case 400:
					default:
						this.isFirstInstall = !data.data.docker_root_dir
						break;
				}
			} catch (err) {
				console.log(`${err} in askInstallationLocation`)
			}
		},
		
		async submitInstallationLocation(val) {
			this.isLoading = true
			let path = ''
			if (val === '/') {
				path = val + 'var/lib/docker'
			} else {
				path = val + '/docker'
			}
			try {
				
				await this.$api.folder.create(path)
			} catch (e) {
				this.$buefy.toast.open({
					message: this.$t('Error when creating installation path for apps'),
					type: 'is-danger'
				})
				return
			}
			
			this.$api.container.putInstallationLocation(path).then(data => {
				this.isLoading = false
				this.isFirstInstall = data.data.docker_root_dir
			}).catch(err => {
				this.isLoading = false
				console.log(`${err} in submitInstallationLocation`)
				this.$buefy.toast.open({
					message: err.message,
					type: 'is-danger'
				})
			})
		},
		
		installAppProgress(resData) {
			if (this.currentInstallAppName != resData.name) {
				return false
			}
			if (!resData.finished) {
				this.currentInstallAppError = !resData.success;
				if (resData.success) {
					this.currentInstallAppType = resData.type;
					if (resData.message !== "") {
						const messageArray = resData.message.split(/[(\r\n)\r\n]+/);
						messageArray.forEach((item, index) => {
							if (!item) {
								messageArray.splice(index, 1);
							}
						})
						messageArray.forEach(item => {
							const evt = JSON.parse(item)
							this.totalPercentage = this.dockerProgress.getProgress(evt)
						})
						if (this.totalPercentage === 0) {
							this.currentInstallAppText = 'Starting installation'
						} else if (this.totalPercentage === 100) {
							this.currentInstallAppText = 'Installation completed'
						} else {
							this.currentInstallAppText = 'Installing'
						}
					}
				} else {
					this.currentInstallAppText = resData.message
				}
			} else {
				localStorage.removeItem("app_data")
				
				// business :: Tagging of new app / scrollIntoView
				this.addIdToSessionStorage(resData.id)
				
				setTimeout(() => {
					this.$emit('updateState')
					this.$emit('close')
				}, 500)
			}
		},
		
		updateConfig(val) {
			console.log(val, 'updateConfig');
			this.configCommands = val
		},
	},
	
	destroyed() {
		clearInterval(this.timer)
	},
	
	sockets: {
		// app_install(resData) {
		//   this.installAppProgress(resData);
		// },
		"app:install-end"(res) {
			this.installAppProgress({
				finished: true,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"]
			});
		},
		"app:install-error"(res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"],
				success: false,
				message: res.Properties["message"]
			});
		},
		"docker:image:pull-progress"(res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"],
				success: true,
				type: "pull",
				message: res.Properties["message"]
			});
		},
	}
}
</script>


<style lang="scss">
.app-item {
	border-radius: 0.5rem;
	transition: background 0.3s ease;
	
	&:hover {
		background-color: hsl(0, 0%, 97%);
	}
}

.level-item {
	.icon {
		overflow: initial;
	}
}

.install-animation {
	width: 100px;
	height: 100px;
}

.creating-animation {
	width: 16rem;
	height: 16rem;
}

.app-detial {
	overflow: auto;
	height: 100%;
	
	.app-header {
		position: relative;
	}
	
	.level {
		.footing {
			color: hsl(0, 0%, 48%);
		}
	}
	
	.swiper-button-next,
	.swiper-rtl .swiper-button-prev {
		right: -20px;
		left: auto;
	}
	
	.swiper-button-prev,
	.swiper-rtl .swiper-button-next {
		left: -20px;
		right: auto;
	}
}

.featured-app {
	.swiper-button-next,
	.swiper-rtl .swiper-button-prev {
		right: -20px;
		top: calc(50% - 2.25rem);
		left: auto;
	}
	
	.swiper-button-prev,
	.swiper-rtl .swiper-button-next {
		left: -20px;
		top: calc(50% - 2.25rem);
		right: auto;
	}
	
	.button {
		box-sizing: border-box !important;
	}
}

.app-select {
	.dropdown-menu {
		min-width: 1rem !important;
	}
	
	.dropdown-content {
		border-radius: 0.5rem;
		overflow-y: overlay !important;
		
		&::-webkit-scrollbar {
			width: 8px;
		}
		
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		
		&::-webkit-scrollbar-thumb {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			outline: none;
		}
	}
	
	a.dropdown-item {
		padding-right: 1.5rem;
		font-size: 0.875rem;
	}
}

@media screen and (min-width: 769px) {
	.app-panel {
		.animation-content {
			max-width: 90% !important;
		}
		
		.modal-card {
			width: 90vw;
			transition: all 0.3s;
			
			&.narrow {
				width: 50rem !important;
			}
		}
	}
}

@media screen and (min-width: 1440px) {
	.app-panel {
		.modal-card {
			width: 81rem !important;
		}
	}
}

@media screen and (max-width: 1366px) {
	.f-list {
		.is-one-quarter {
			width: 33.333333% !important;
		}
	}
}

@media screen and (max-width: 1024px) {
	.f-list {
		.is-one-quarter {
			width: 50% !important;
		}
	}
}

@media screen and (max-width: 768px) {
	.modal-card {
		max-height: 100vh !important;
		border-radius: 0;
	}
}

@media screen and (max-width: 480px) {
	.app-detial {
		overflow: auto;
		height: 100%;
		
		.modal-card-head {
			.button {
				-webkit-tap-highlight-color: transparent;
			}
		}
		
		.app-header {
			position: relative;
			
			.header-icon {
				.is-128x128 {
					height: 96px;
					width: 96px;
				}
			}
			
			.store-title {
				font-size: 1.125rem;
			}
			
			.subtitle {
				font-size: 0.75rem;
				margin-bottom: 0.75rem;
			}
			
			.description {
				.button {
					font-size: 0.75rem;
				}
			}
		}
		
		.level {
			.mdi-36px.mdi-set,
			.mdi-36px.mdi:before {
				font-size: 24px;
			}
			
			.title {
				font-size: 24px;
			}
			
			.footing {
				font-size: 0.6rem !important;
			}
		}
	}
	
	.f-list {
		.is-one-quarter {
			width: 100% !important;
		}
	}
}

.pri-line-height {
	line-height: 1.875rem;
}

.pri-message-alert {
	//padding: 0.4rem 1rem;
	height: 2rem;
	//text-align: center;
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	background: #FFF6E5;
	border-radius: 0.25rem;
	color: #d99000;
	font-size: 0.875rem;
	font-style: normal;
}

.is-overlay {
	overflow: overlay;
}

.card-width {
	max-width: 35rem;
	min-width: 30rem;
}
</style>
<style lang="scss" scoped>
._polymorphic {
	height: 2rem;
	width: 2rem;
	border-radius: 0.375rem;
}

.button[disabled] {
	opactiy: 0.3;
}

._polymorphic:hover {
	background: hsla(208, 16%, 96%, 1);
}

//._polymorphic:active {
//	background: blue;
//}
._title {
	/* Text 500Medium/Text02 */
	
	font-family: 'Roboto';
	font-style: normal;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.5rem;
	/* identical to box height, or 150% */
	
	font-feature-settings: 'pnum' on, 'lnum' on;
	
	/* Gary/800 */
	
	color: #29343D;
}

._b-line {
	border-bottom: 1px solid hsla(208, 16%, 94%, 1) !important;
}

.progress {
	border-radius: 6px;
	height: 12px;
	
	&::-webkit-progress-bar {
		background: rgba(172, 184, 195, 0.4);
	}
	
	&::-webkit-progress-value {
		opacity: 1;
	}
}
</style>
