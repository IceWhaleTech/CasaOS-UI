<template>
	<div
		:class="{ narrow: currentSlide > 0, 'card-width': isFirstInstall, _stepStoreList: currentSlide === 0 }"
		class="modal-card"
	>
		<!--    first setting！！ apps installation location-->
		<template v-if="isFirstInstall">
			<header class="modal-card-head b-line">
				<div class="is-flex-grow-1">
					<h3 class="is-flex-grow-1 title is-3 pri-line-height has-text-black">
						{{ $t('Apps Installation Location') }}
					</h3>
				</div>
				<b-icon
					class="close-button"
					icon="close-outline"
					pack="casa"
					@click.native="
						$emit('close')
						$messageBus('appstore_close')
					"
				/>
			</header>
			<p class="modal-card-body">
				{{ $t('Please choose a location with enough storage space and stable connection.') }}
				<span class="has-text-danger">
					{{ $t('(Cannot be changed)') }}
				</span>
			</p>

			<section class="modal-card-body is-overlay">
				<AppsInstallationLocation
					v-for="(item, index) in storageData"
					:key="'storage' + index"
					:item="item"
					:scence="storage_item_scence"
					@selection="getSelection"
				>
				</AppsInstallationLocation>
			</section>
		</template>
		<!--    first setting have done!!-->
		<template v-else>
			<!-- Sidebar Start -->
			<app-side-bar v-model="sidebarOpen" :overlay="true" :right="true" position="absolute">
				<template slot-scope="{ close }">
					<AppDetailInfo
						:appDetailData="appDetailData"
						:arch="arch"
						:cateMenu="cateMenu"
						:close="close"
						:currentInstallId="currentInstallId"
						:installedList="installedList"
						:showDetailSwiper="showDetailSwiper"
						@install="quickInstall"
						@switchAppConfigContent="switchAppConfigContent"
					>
					</AppDetailInfo>
				</template>
			</app-side-bar>
			<!-- Sidebar End -->

			<!-- Modal-Card Header Start -->
			<header :class="{ 'setting-compose-panel': currentSlide == 1 && isCasa }" class="modal-card-head _b-line">
				<div class="is-flex-grow-1">
					<h3 class="setting_title is-5">{{ panelTitle }}</h3>
				</div>
				<div class="is-flex is-align-items-center">
					<b-button
						v-if="currentSlide == 0"
						:label="$t('Custom Install')"
						class="mr-2"
						icon-left="view-grid-plus"
						rounded
						size="is-small"
						type="is-primary"
						@click="currentSlide = 1"
					/>

					<b-tooltip v-if="showImportButton" :label="$t('Import')" position="is-bottom" type="is-dark">
						<button class="icon-button mdi mdi-import" type="button" @click="showImportPanel" />
					</b-tooltip>

					<b-tooltip
						v-if="showTerminalButton"
						:label="$t('Terminal & Logs')"
						position="is-bottom"
						type="is-dark"
					>
						<button class="icon-button mdi mdi-console" type="button" @click="showTerminalPanel" />
					</b-tooltip>

					<b-tooltip
						v-if="showExportButton"
						:label="$t('Export ComposeFile')"
						position="is-bottom"
						type="is-dark"
					>
						<button class="icon-button mdi mdi-export-variant" type="button" @click="exportYAML" />
					</b-tooltip>
					<div
						v-if="currentSlide < 2"
						class="is-flex is-align-items-center modal-close-container modal-close-container-line"
					>
						<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close')" />
					</div>
					<div v-else-if="currentSlide === 2" class="is-flex is-align-items-center">
						<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close')" />
					</div>
				</div>
			</header>
			<!-- Modal-Card Header End -->
			<!-- Modal-Card Body Start -->
			<!-- App Store List Start -->
			<section v-if="currentSlide == 0" :class="{ _hideOverflow: !isCasa }" class="modal-card-body pt-3 _pl">
				<template v-if="!isLoadError">
					<template v-if="recommendList.length > 0">
						<h3 class="title is-5 has-text-weight-normal">{{ $t('Featured Apps') }}</h3>
						<!-- Featured Slider Start -->
						<div class="is-relative featured-app b-line">
							<swiper ref="featureSwiper" :options="featureSwiperOptions" class="swiper">
								<swiper-slide
									v-for="(item, index) in recommendList"
									:key="index + item.title + item.id"
									class="pb-5"
								>
									<div class="gap" @click="showAppDetial(item.id)">
										<b-image
											:placeholder="require('@/assets/img/app/swiper_placeholder.png')"
											:src="item.thumbnail"
											:src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
											class="border-8 is-clickable"
											ratio="16by9"
										></b-image>
									</div>
									<div class="is-flex pt-5 is-align-items-center">
										<div class="mr-3" @click="showAppDetial(item.id)">
											<b-image
												:placeholder="require('@/assets/img/app/default.svg')"
												:src="item.icon"
												:src-fallback="require('@/assets/img/app/default.svg')"
												class="is-64x64 is-clickable icon-shadow"
											></b-image>
										</div>
										<div
											class="is-flex-grow-1 mr-4 is-clickable"
											@click="
												showAppDetial(item.id)
												$messageBus('appstore_detail', item.title)
											"
										>
											<h6 class="title is-6 mb-2">{{ item.title }}</h6>
											<p class="is-size-7 two-line">{{ item.tagline }}</p>
										</div>
										<div>
											<b-button
												v-if="installedList.includes(item.id)"
												:loading="item.id == currentInstallId"
												rounded
												size="is-small"
												type="is-primary is-light"
												@click="openThirdContainerByAppInfo(item)"
												>{{ $t('launch-and-open') }}
											</b-button>
											<b-button
												v-else
												:disabled="!item.architectures?.includes(arch)"
												:loading="item.id == currentInstallId"
												rounded
												size="is-small"
												type="is-primary is-light"
												@click="
													quickInstall(item.id)
													$messageBus('appstore_install', item.title)
												"
											>
												{{ $t('Install') }}
											</b-button>
										</div>
									</div>
								</swiper-slide>
							</swiper>
							<div class="swiper-button-prev" @click="$messageBus('appstore_slide')"></div>
							<div class="swiper-button-next" @click="$messageBus('appstore_slide')"></div>
						</div>
					</template>
					<!-- Featured Slider End -->

					<!-- List condition Start -->
					<div class="is-flex mt-5 mb-5 is-justify-content-center">
						<!-- Cate Start -->
						<transition name="slide-fade">
							<div
								v-if="!activeAppStoreSourceInput || !isMobile"
								class="mr-2 hover-effect is-flex is-align-items-center _dropdown is-clickable"
							>
								<b-dropdown
									v-model="currentCate"
									:max-height="240"
									:mobile-modal="false"
									animation="fade1"
									aria-role="list"
									class="app-select file-dropdown"
									scrollable
								>
									<template #trigger="{ active }">
										<b-button
											:label="currentCate.name"
											type="is-text"
											icon-left="category"
											icon-pack="casa"
											:icon-right="active ? 'up-outline' : 'down-outline'"
										/>
									</template>
									<b-dropdown-item
										v-for="menu in cateMenu"
										:key="menu.id"
										:class="menu.id == currentCate.id ? 'is-active' : ''"
										:data-title="menu.count"
										:value="menu"
										aria-role="listitem"
										class="_dropdown__item"
									>
										<div
											class="media is-align-items-center is-flex has-text-full-03"
											@click="$messageBus('appstore_type', menu.name)"
										>
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
							<div
								v-if="!activeAppStoreSourceInput || !isMobile"
								class="hover-effect is-flex is-align-items-center _dropdown is-clickable"
							>
								<b-dropdown
									v-model="currentAuthor"
									:max-height="240"
									:mobile-modal="false"
									animation="fade1"
									aria-role="list"
									class="app-select file-dropdown"
									position="is-bottom-right"
									scrollable
								>
									<template #trigger="{ active }">
										<b-button
											:label="currentAuthor.name"
											type="is-text"
											icon-left="posted-by"
											icon-pack="casa"
											:icon-right="active ? 'up-outline' : 'down-outline'"
										/>
									</template>
									<b-dropdown-item
										v-for="menu in authorMenu"
										:key="menu.id"
										:class="menu.id == currentAuthor.id ? 'is-active' : ''"
										:data-title="menu.count"
										:value="menu"
										aria-role="listitem"
										class="_dropdown__item"
									>
										<div
											class="media is-align-items-center is-flex has-text-full-03"
											@click="$messageBus('appstore_author', menu.name)"
										>
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
							<b-icon
								v-if="searchAndSourcesStatus === 'showSources'"
								class="is-flex is-align-self-center ml-2 is-clickable"
								icon="search-outline"
								pack="casa"
								@click.native="searchAndSourcesStatusController"
							></b-icon>
						</transition>
						<transition name="search-fade">
							<b-input
								v-if="searchAndSourcesStatus !== 'showSources'"
								ref="search_app"
								v-on-click-outside="resetSearchAndSourcesStatus"
								:placeholder="$t('Search an app...')"
								class="app-search ml-2"
								@input="debounceSearchInput"
								@keyup.enter.native="counterPatchGetStoreList++"
							></b-input>
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

					<!-- List condition End -->
					<!-- App list Start-->
					<div class="columns f-list is-multiline is-mobile pb-3 mb-5">
						<div
							v-for="(item, index) in filteredPageList"
							:key="index + item.title + item.id"
							class="column app-item is-one-quarter"
						>
							<div class="is-flex">
								<div class="mr-4 is-clickable" @click="showAppDetial(item.id)">
									<b-image
										:src="item.icon"
										:src-fallback="require('@/assets/img/app/default.svg')"
										class="is-64x64 icon-shadow"
										style="display: flex; align-items: center"
										webp-fallback=".jpg"
									></b-image>
								</div>
								<div
									class="is-flex-grow-1 mr-4 is-clickable"
									@click="
										showAppDetial(item.id)
										$messageBus('appstore_detail', item.title)
									"
								>
									<h6 class="title is-6 mb-2">{{ item.title }}</h6>
									<p class="is-size-7 two-line">{{ item.tagline }}</p>
								</div>
							</div>
							<div class="mt-1 ml-7 is-flex is-align-items-center">
								<div class="is-flex-grow-1 is-size-7 has-text-grey-light">{{ item.category }}</div>
								<b-button
									v-if="installedList.includes(item.id)"
									:loading="item.id == currentInstallId"
									rounded
									size="is-small"
									type="is-primary is-light"
									@click="openThirdContainerByAppInfo(item)"
								>
									{{ $t('launch-and-open') }}
								</b-button>
								<b-button
									v-else
									:disabled="!item.architectures?.includes(arch)"
									:loading="item.id == currentInstallId"
									rounded
									size="is-small"
									type="is-primary is-light"
									@click="
										quickInstall(item.id)
										$messageBus('appstore_install', item.title)
									"
								>
									{{ $t('Install') }}
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
								$t(
									'From community contributors, not optimized for CasaOS, but provides a basic App nexperience.'
								)
							}}
						</h3>

						<div class="columns f-list is-multiline is-mobile pb-3 mb-5">
							<div
								v-for="(item, index) in communityList"
								:key="index + item.title + item.id"
								class="column is-one-quarter"
							>
								<div class="is-flex is-align-items-center">
									<div class="mr-4 is-clickable" @click="showAppDetial(item.id)">
										<b-image
											:src="item.icon"
											:src-fallback="require('@/assets/img/app/default.svg')"
											class="is-64x64 icon-shadow"
											webp-fallback=".jpg"
										></b-image>
									</div>
									<div
										class="is-flex-grow-1 mr-4 is-clickable"
										@click="
											showAppDetial(item.id)
											$messageBus('appstorecommunity_detail', item.title)
										"
									>
										<h6 class="title is-6 mb-2">{{ item.title }}</h6>
										<p class="is-size-7 two-line">{{ item.tagline }}</p>
									</div>
								</div>
								<div class="mt-1 ml-7 is-flex is-align-items-center">
									<div class="is-flex-grow-1 is-size-7 has-text-grey-light">
										{{ item.category }}
									</div>
									<b-button
										v-if="installedList.includes(item.id)"
										:loading="item.id == currentInstallId"
										rounded
										size="is-small"
										type="is-primary is-light"
										@click="openThirdContainerByAppInfo(item)"
									>
										{{ $t('launch-and-open') }}
									</b-button>
									<b-button
										v-else
										:disabled="!item.architectures?.includes(arch)"
										:loading="item.id == currentInstallId"
										rounded
										size="is-small"
										type="is-primary is-light"
										@click="
											quickInstall(item.id)
											$messageBus('appstorecommunity_install', item.title)
										"
									>
										{{ $t('Install') }}
									</b-button>
								</div>
							</div>
						</div>
					</template>

					<!-- Community App List End -->
				</template>
				<template v-else>
					<div class="is-flex is-align-items-center is-justify-content-center mt-6 mb-6">
						<div class="has-text-centered mt-6 mb-6">
							<div class="is-flex is-align-items-center mb-5">
								<b-icon class="mr-2" icon="alert-circle-outline" pack="casa" type="is-danger"></b-icon>
								{{ $t('There was an error loading the data, please try again!') }}
							</div>

							<b-button rounded type="is-primary" @click="retry()">Retry</b-button>
						</div>
					</div>
				</template>
			</section>
			<!-- App Store List End -->

			<!-- App Install Form Start -->
			<template v-if="currentSlide == 1">
				<ComposeConfig
					v-if="isCasa"
					ref="ComposeConfig"
					:cap-array="capArray"
					:docker-compose-commands="dockerComposeConfig"
					:errInfo="errInfo"
					:networks="networks"
					:state="state"
					:total-memory="totalMemory"
					@updateDockerComposeCommands="updateDockerComposeCommands"
					@updateDockerComposeServiceName="updateDockerComposeServiceName"
					@updateMainName="name => (currentInstallId = name)"
				></ComposeConfig>

				<section v-else :class="{ _hideOverflow: !isCasa }" class="modal-card-body pt-3">
					<!--	导入"已存在的容器"，进行初始化操作	-->
					<ValidationObserver ref="containerValida">
						<ValidationProvider v-slot="{ errors, valid }" name="appName" rules="required">
							<b-field
								:label="$t('App name') + ' *'"
								:message="$t(errors)"
								:type="{ 'is-danger': errors[0], 'is-success': valid }"
							>
								<b-input
									v-model="settingData.label"
									:placeholder="$t('Your custom App Name')"
									maxlength="40"
								></b-input>
							</b-field>
						</ValidationProvider>

						<b-field :label="$t('Icon URL')">
							<p class="control">
								<span class="button is-static container-icon">
									<b-image
										:key="settingData.icon"
										:src="settingData.icon"
										:src-fallback="require('@/assets/img/app/default.svg')"
										class="is-32x32"
										ratio="1by1"
									></b-image>
								</span>
							</p>
							<b-input
								v-model="settingData.icon"
								:placeholder="$t('Your custom icon URL')"
								expanded
							></b-input>
						</b-field>

						<b-field label="Web UI">
							<b-select v-model="settingData.protocol">
								<option value="http">http://</option>
								<option value="https">https://</option>
							</b-select>
							<b-input v-model="settingData.host" :placeholder="this.$baseHostname" expanded></b-input>
							<b-autocomplete
								v-model="settingData.port_map"
								:data="
									(() => {
										return (settingData.ports || []).map(item => {
											return item.host
										})
									})()
								"
								:open-on-focus="true"
								:placeholder="$t('Port')"
								class="has-colon"
								field="hostname"
								@select="option => (settingData.port_map = option)"
							></b-autocomplete>
							<b-input
								v-model="settingData.index"
								:placeholder="'/index.html ' + $t('[Optional]')"
								expanded
							></b-input>
						</b-field>
					</ValidationObserver>
				</section>
			</template>
			<!-- App Install Form End -->

			<!-- App Install Process Start -->
			<section v-if="currentSlide == 2" :class="{ _hideOverflow: !isCasa }" class="modal-card-body pt-3 _b-line">
				<div class="installing-warpper mb-5">
					<div class="is-flex is-align-items-center is-justify-content-center">
						<lottie-animation
							:animationData="require('@/assets/ani/loading.json')"
							:autoPlay="true"
							:loop="true"
							class="install-animation mt-5 mb-2"
						></lottie-animation>
					</div>
					<b-progress :value="totalPercentage" format="percent" show-value type="is-primary"></b-progress>
					<h3
						:class="currentInstallAppTextClass"
						class="title is-6 has-text-centered"
						style="height: 20px"
						v-dompurify-html="currentInstallAppText"
					></h3>
				</div>
			</section>
			<!-- App Install Process End -->
			<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
			<!-- Modal-Card Body End -->
		</template>
		<!-- Modal-Card Footer Start-->
		<footer
			:class="{ 'is-justify-content-center': currentSlide == 0 }"
			class="modal-card-foot is-flex is-align-items-center"
		>
			<template>
				<div class="is-flex-grow-1"></div>
				<div>
					<b-button
						v-if="currentSlide == 2 && currentInstallAppError"
						:label="$t('Back')"
						rounded
						@click="prevStep"
					/>
					<b-button
						v-if="currentSlide == 1 && state == 'install'"
						:label="$t('Install')"
						:loading="isLoading"
						rounded
						type="is-primary"
						@click="checkComposeAppAndInstallComposeApp(dockerComposeCommands, currentInstallId)"
					/>
					<b-button
						v-if="isCasa && currentSlide == 1 && state == 'update'"
						:label="$t('Save')"
						:loading="isLoading"
						rounded
						type="is-primary"
						@click="updateApp()"
					/>
					<b-button
						v-if="!isCasa && currentSlide == 1 && state == 'update'"
						:label="$t('Save')"
						:loading="isLoading"
						rounded
						type="is-primary"
						@click="updateContainer()"
					/>
					<b-button
						v-if="currentSlide == 2 && !currentInstallAppError"
						:label="$t(cancelButtonText)"
						rounded
						type="is-primary"
						@click="$emit('close')"
					/>
					<b-button
						v-if="isFirstInstall"
						:label="$t('Submit')"
						:loading="isLoading"
						rounded
						type="is-primary"
						@click="submitInstallationLocation(installationLocation)"
					/>
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
import LottieAnimation from 'lottie-web-vue'
import '@/plugins/vee-validate'
import uniq from 'lodash/uniq'
import isNull from 'lodash/isNull'
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'
import FileSaver from 'file-saver'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import AppsInstallationLocation from '@/components/Apps/AppsInstallationLocation'
import business_ShowNewAppTag from '@/mixins/app/Business_ShowNewAppTag'
import business_OpenThirdApp from '@/mixins/app/Business_OpenThirdApp'
import ComposeConfig from '@/components/Apps/ComposeConfig.vue'
import AppDetailInfo from '@/components/Apps/AppDetailInfo.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { ice_i18n } from '@/mixins/base/common-i18n'
import { parse } from 'yaml'
import AppStoreSourceManagement from '@/components/Apps/AppStoreSourceManagement.vue'
import { vOnClickOutside } from '@vueuse/components'

const data = [
	'AUDIT_CONTROL',
	'AUDIT_READ',
	'BLOCK_SUSPEND',
	'BPF',
	'CHECKPOINT_RESTORE',
	'DAC_READ_SEARCH',
	'IPC_LOCK',
	'IPC_OWNER',
	'LEASE',
	'LINUX_IMMUTABLE',
	'MAC_ADMIN',
	'MAC_OVERRIDE',
	'NET_ADMIN',
	'NET_BROADCAST',
	'PERFMON',
	'SYS_ADMIN',
	'SYS_BOOT',
	'SYS_MODULE',
	'SYS_NICE',
	'SYS_PACCT',
	'SYS_PTRACE',
	'SYS_RAWIO',
	'SYS_RESOURCE',
	'SYS_TIME',
	'SYS_TTY_CONFIG',
	'SYSLOG',
	'WAKE_ALARM'
]

export default {
	components: {
		AppStoreSourceManagement,
		AppDetailInfo,
		AppSideBar,
		LottieAnimation,
		Swiper,
		SwiperSlide,
		AppsInstallationLocation,
		ComposeConfig,
		ValidationObserver,
		ValidationProvider
	},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp],
	directives: {
		OnClickOutside: vOnClickOutside
	},
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
		// for import app. this.isCasa is false
		settingData: {
			type: Object
		},
		// for compose app.
		settingComposeData: {
			type: String
		}
	},

	data () {
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
			currentInstallAppText: '',
			currentInstallAppProgress: {},
			currentInstallAppProgressTotals: {},

			sidebarOpen: false,
			cancelButtonText: 'Cancel',
			totalMemory: 0,
			networks: [],
			tempNetworks: [],
			networkModes: [],
			// about @compose
			// Assign value to compose_config component
			dockerComposeConfig: '',
			capArray: data,
			errInfo: {},
			dockerComposeCommands: '',
			dockerComposeServiceName: '',

			pageIndex: 1,
			pageSize: 5,
			listTotal: 0,
			pageList: {},
			communityList: {},
			recommendList: {},
			currentSlide: 0,
			currentInstallId: '',

			// Featured Swiper
			featureSwiperOptions: {
				loop: false,
				autoplay: true,
				spaceBetween: 24,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
					disabledClass: 'swiper-button-disabled'
				},
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
				}
				// on: {
				// 	slideChangeTransitionStart: this.handleFeaturedSlide
				// },
			},
			searchKey: '',
			currentCate: {},
			// currentAuthor: {},
			currentAuthor: { count: 0, font: 'author', id: 0, name: 'All' },
			currentSort: {},
			cateMenu: [],
			authorMenu: [
				{ count: 0, font: 'author', id: 0, name: 'All' },
				{ count: 0, font: 'author', id: 1, name: 'official' },
				{ count: 0, font: 'author', id: 2, name: 'by_casaos' },
				{ count: 0, font: 'author', id: 3, name: 'community' }
			],
			sortMenu: [
				{ icon: '', slash: 'rank', name: 'Popular' },
				{ icon: '', slash: 'new', name: 'New' },
				{ icon: '', slash: 'name', name: 'Name' }
			],
			storeQueryData: {
				index: 1,
				category: 'All',
				authorType: 'All',
				type: 'rank',
				key: this.searchKey,
				pageSize: 5
			},
			//  App Detail info
			appDetailData: {
				title: { en_us: '' },
				tagline: { en_us: '' },
				description: { en_us: '' }
			},
			arch: '',
			// unusable: false, // computer unusable
			architectures: [],

			// APPs Installation Location - requirement document
			storageData: [
				{
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
					temperature: 100
				}
			],
			storage_item_scence: 'select installation location',
			isFirstInstall: false,
			installationLocation: '',
			totalPercentage: 0,
			installedList: [],
			counterPatchGetStoreList: 0,
			searchAndSourcesStatus: '',
			activeAppStoreSourceInput: false,
		}
	},

	created () {
		window.addEventListener('resize', this.setCSSVHVar)
		this.setCSSVHVar()

		//Get recommend
		this.getStoreRecommend()

		//Get Max memory info form device
		this.totalMemory = Math.floor(this.configData.memory.total / 1048576)

		//Handling network types
		this.tempNetworks = this.configData.networks
		this.networkModes = uniq(
			this.tempNetworks.map(item => {
				return item.driver
			})
		)
		this.networks = this.networkModes.map(item => {
			let tempitem = {}
			tempitem.driver = item
			tempitem.networks = this.tempNetworks.filter(net => {
				return net.driver == item
			})
			return tempitem
		})
		this.networks = orderBy(this.networks, ['driver'], ['asc'])
		//If it is edit, Init data
		if (this.settingData != undefined || this.settingComposeData != undefined) {
			this.isLoading = false
			this.dockerComposeConfig = this.settingComposeData
			this.currentSlide = 1
		} else {
			this.getCategoryList()
		}

		// If StoreId is not 0
		if (this.storeId != 0) {
			this.showAppDetial(this.storeId)
		}

		// 这是 选择应用安装位置。 这块功能不被使用，暂且保留。
		// close the function - APPs Installation Location
		// prepare data - APPs Installation Location requirement document
		// this.getDiskList();
		// close the function - APPs Installation Location
		// this.askInstallationLocation();

		// get architecture
		this.arch = localStorage.getItem('arch')
		if (!this.arch) {
			this.$api.sys.hardwareInfo().then(res => {
				if (res.data.success == 200) {
					localStorage.setItem('arch', res.data.data.arch || '')
					this.arch = res.data.data.arch || ''
				}
			})
		}
	},

	mounted () {
		this.currentSlide === 0 &&
			!this.isMobile &&
			this.$nextTick().then(() => {
				this.$refs.search_app.$el.children[0].focus()
			})
		this.searchAndSourcesStatusController()
	},

	computed: {
		showImportButton () {
			return this.currentSlide == 1 && this.state == 'install'
		},
		showExportButton () {
			return this.currentSlide == 1 && this.state == 'update'
		},
		showTerminalButton () {
			return this.currentSlide == 1 && this.state == 'update' && this.runningStatus == 'running'
		},
		panelTitle () {
			if (this.currentSlide == 0) {
				return this.$t('App Store')
			} else if (this.currentSlide == 1) {
				if (!this.isCasa) {
					return this.$t('Import') + ' ' + this.currentInstallId
				} else {
					return this.settingData != undefined || this.settingComposeData != undefined
						? this.currentInstallId + ' ' + this.$t('Setting')
						: this.$t('Install a new App manually')
				}
			} else {
				return this.$t('Installing') + ' ' + this.currentInstallId
			}
		},
		showDetailSwiper () {
			return this.appDetailData.screenshot_link?.length > 0
		},
		currentInstallAppTextClass () {
			return this.currentInstallAppError ? 'has-text-danger' : 'has-text-black'
		},
		unuseable () {
			if (this.architectures.length === 0 || !this.arch) {
				return false
			}
			return this.architectures.indexOf(this.arch) < 0
		},
		archTitle () {
			if (this.arch === 'arm') {
				return 'armv7'
			}
			return this.arch
		},
		filteredPageList () {
			if (Object.keys(this.pageList).length === 0) return []
			return this.pageList.filter(app => {
				const keywords = (app.title + app.tagline)?.toLocaleLowerCase() ?? ''
				for (const term of this.searchKey.split(' ')) {
					if (keywords.indexOf(term.toLocaleLowerCase()) !== -1) {
						return true
					}
				}
				return false
			})
		},
		isMobile () {
			return this.$store.state.isMobile
		}
	},
	watch: {
		// Watch if Section index changes
		/*
		 *  === 0 App Store Panel.
		 *  === 1 Setting Panel.	(Importing、Update Setting)
		 *  === 2 Other Panel. (Installing)
		 * */
		currentSlide (val) {
			if (val == 1) {
				this.isLoading = false
			}
		},
		currentCate: {
			handler (val) {
				if (!this.isFirst) {
					this.counterPatchGetStoreList++
				}
			},
			deep: true
		},
		currentAuthor: {
			handler (val) {
				if (!this.isFirst) {
					this.counterPatchGetStoreList++
				}
			},
			deep: true
		},
		// Watch if app sort changes
		currentSort: {
			handler (val) {
				if (!this.isFirst) {
					this.counterPatchGetStoreList++
				}
			},
			deep: true
		},
		counterPatchGetStoreList () {
			this.getStoreList()
			return 0
		}
	},
	methods: {
		resetSearchAndSourcesStatus () {
			switch (this.isMobile) {
				case true:
					this.searchAndSourcesStatus = 'showSources'
					break
				case false:
					this.searchAndSourcesStatus = 'showAll'
					break
			}
		},
		searchAndSourcesStatusController () {
			// Status for three. One of them is "showSearch", "showSources", "showAll"
			if (this.isMobile && this.searchAndSourcesStatus === 'showSources') {
				this.searchAndSourcesStatus = 'showSearch'
			} else if (this.isMobile) {
				this.searchAndSourcesStatus = 'showSources'
			} else {
				this.searchAndSourcesStatus = 'showAll'
			}
		},

		refreshAppStoreSourceManagementSizeStatus (status) {
			if (status === 'active_input_state') {
				this.activeAppStoreSourceInput = true
			} else {
				this.activeAppStoreSourceInput = false
			}
		},

		setCSSVHVar () {
			const vh = window.innerHeight * 0.01
			document.documentElement.style.setProperty('--vh', `${vh}px`)
		},

		// this.cateMenu : {name: 'appstore', title: 'App Store', icon: 'mdi-apps', component: 'AppStore'}
		// param : this.cateMenu.name
		getCateIcon (name) {
			let tempO = this.cateMenu.find(item => item.name == name) || { font: 'mdi-apps' }
			return tempO.font
		},

		/**
		 * @description: Get category list
		 * @param {*}
		 * @return {*} void
		 */
		async getCategoryList () {
			this.isLoading = true
			try {
				this.cateMenu = await this.$openAPI.appManagement.appStore.categoryList().then(res =>
					res.data.data.filter(item => {
						return item.count > 0
					})
				)
				this.currentCate = this.cateMenu[0]
				this.currentSort = this.sortMenu[0]
				if (this.isFirst) {
					this.isFirst = false
				}
			} catch (error) {
				this.loadErrorStep = 1
				this.isLoading = false
				this.isLoadError = true
			}
		},

		async getStoreRecommend () {
			try {
				let res = await this.$openAPI.appManagement.appStore
					.composeAppStoreInfoList(undefined, undefined, true)
					.then(res => res.data.data.list)

				this.recommendList = Object.keys(res).map(id => {
					let main_app_info = res[id]
					return {
						id,
						category: main_app_info.category,
						icon: main_app_info.icon,
						tagline: ice_i18n(main_app_info.tagline),
						thumbnail: main_app_info.thumbnail || main_app_info.screenshot_link?.[0],
						title: ice_i18n(main_app_info.title),
						state: 0,
						architectures: main_app_info.architectures
						// scheme: main_app_info.apps[id].scheme,
						// port: main_app_info.apps[id].port_map,
						// index: main_app_info.apps[id].index,
					}
				})
			} catch (error) {
				console.log('load recommend error', error)
			}
		},

		/**
		 * @description: Get App store list
		 * @param {*}
		 * @return {*} void
		 */
		async getStoreList () {
			this.isLoading = true

			try {
				let category = this.currentCate.name
				let authorType = this.currentAuthor.name
				let res
				if (authorType !== 'All' && category !== 'All') {
					res = await this.$openAPI.appManagement.appStore
						.composeAppStoreInfoList(category, authorType)
						.then(res => res.data.data)
				} else if (authorType !== 'All') {
					res = await this.$openAPI.appManagement.appStore
						.composeAppStoreInfoList(undefined, authorType)
						.then(res => res.data.data)
				} else if (category !== 'All') {
					res = await this.$openAPI.appManagement.appStore
						.composeAppStoreInfoList(category, undefined, false)
						.then(res => res.data.data)
				} else {
					res = await this.$openAPI.appManagement.appStore
						.composeAppStoreInfoList()
						.then(res => res.data.data)
				}

				let list = res.list
				let listRes = Object.keys(list).map(id => {
					let main_app_info = list[id]
					return {
						id,
						category: main_app_info.category,
						icon: main_app_info.icon,
						tagline: ice_i18n(main_app_info.tagline),
						thumbnail: main_app_info.thumbnail || main_app_info.screenshot_link?.[0],
						title: ice_i18n(main_app_info.title),
						state: 0,
						architectures: main_app_info.architectures
						// scheme: main_app_info.apps[id].scheme,
						// port: main_app_info.apps[id].port_map,
						// index: main_app_info.apps[id].index,
					}
				})
				this.pageList = listRes
				this.installedList = res.installed
			} catch (e) {
				console.log('load store list error', e)
			}
			this.isLoading = false
		},

		/**
		 * @description: Show the details of app
		 * @param {id} String
		 * @return {*} void
		 */
		async showAppDetial (id) {
			this.isLoading = true
			let { min_memory, compose } = await this.$openAPI.appManagement.appStore.composeApp(id).then(res => {
				// A district that is reserved for resource.
				return {
					min_memory: res.data.data.compose.services[id]?.deploy?.resources?.reservations?.memory || '0',
					compose: res.data.data.compose
				}
			})

			if (min_memory.includes('GB')) {
				min_memory = min_memory.replace('GB', '') * 1024
			} else if (min_memory.includes('MB')) {
				min_memory = min_memory.replace('MB', '')
			} else {
				min_memory = min_memory / 1024 / 1024
			}
			this.$openAPI.appManagement.appStore
				.composeAppStoreInfo(id)
				.then(res => {
					this.isLoading = false
					this.sidebarOpen = true
					this.appDetailData = res.data.data
					this.appDetailData.id = id
					this.appDetailData.min_memory = min_memory
					this.appDetailData.compose = compose
					this.architectures = res.data.data.architectures || []
				})
				.catch(e => {
					this.$buefy.toast.open({
						message: e.response.data.message,
						// message: this.$t(`There was an error loading the data, please try again!`),
						type: 'is-danger'
					})
				})
				.finally(() => {
					this.isLoading = false
				})
		},

		retry () {
			if (this.loadErrorStep === 1) {
				this.getCategoryList()
			} else if (this.loadErrorStep === 2) {
				this.getStoreList()
			}
		},

		/**
		 * @description: Qucik Install App from app store
		 * @param {*}
		 * @return {*} void
		 */
		quickInstall (id) {
			this.sidebarOpen = false
			this.$openAPI.appManagement.appStore
				.composeApp(id, {
					headers: {
						'content-type': 'application/yaml',
						accept: 'application/yaml'
					}
				})
				.then(res => {
					if (res.status == 200) {
						let composeJSON = parse(res.data)
						if (composeJSON['x-casaos']?.tips?.before_install?.en_us) {
							this.$buefy.modal.open({
								parent: this,
								component: () => import('@/components/Apps/TipEditorModal.vue'),
								hasModalCard: true,
								customClass: '',
								trapFocus: true,
								canCancel: [''],
								scroll: 'keep',
								animation: 'zoom-in',
								events: {
									submit: () => {
										this.currentInstallId = id
										this.installComposeApp(res.data, id)
									}
								},
								props: {
									composeData: composeJSON
								}
							})
						} else {
							this.installComposeApp(res.data, id)
						}
					} else {
						this.$buefy.toast.open({
							message: this.$t(`There was an error installing the application, please try again!`),
							type: 'is-warning'
						})
					}
				})
				.catch(e => {
					this.$buefy.toast.open({
						message: e.response.data.message,
						type: 'is-danger'
					})
				})
		},
		/**
		 * @description: Format AppStore tip datas
		 * @param {data}
		 * @return {html} Str
		 */
		formatTips (data) {
			let html = ''
			if (!isNull(data) && data != '') {
				JSON.parse(data).forEach(item => {
					html += "<span class=' is-size-14px un-break-word'>" + item.content + '</span>'
					if (item.value != '') {
						html += "<span class='tag is-primary ml-1'>" + item.value + '</span>'
					}
					html += '<br/>'
				})
			}
			return html
		},

		/**
		 * @description: Get App icon form image
		 * @param {*} image
		 * @return {*}
		 */
		getIconFromImage (image) {
			if (image == '') {
				return ''
			} else {
				let appIcon = image.split(':')[0].split('/').pop()
				return `https://icon.casaos.io/main/all/${appIcon}.png`
			}
		},
		/**
		 * @description: Back to prev Step
		 * @param {*}
		 * @return {*} void
		 */
		prevStep () {
			this.currentSlide--
		},

		/**
		 * @description: Validate form async
		 * @param {Object} ref ref of component
		 * @return {Boolean}
		 */
		async checkStep (ref) {
			let isValid = await ref.validate()
			return isValid
		},

		/**
		 * @description: Submit datas after valid
		 * @param {*}
		 * @return {*} void
		 */
		installComposeApp (dockerComposeCommands, appName) {
			return this.$openAPI.appManagement.compose
				.installComposeApp(dockerComposeCommands, false, true)
				.then(res => {
					if (res.status !== 200) {
						this.dockerComposeConfig = dockerComposeCommands
						this.currentSlide = 1
						this.errInfo = res.data

						this.$buefy.toast.open({
							message: this.$t('The information filled in needs to be corrected'),
							type: 'is-warning'
						})
					}
				})
				.catch(e => {
					if (e.response.status === 400) {
						this.dockerComposeConfig = dockerComposeCommands
						this.currentSlide = 1
						this.errInfo = e.response.data.data
					}
					this.$buefy.toast.open({
						message: e.response.data || e.response.status,
						type: 'is-danger'
					})
				})
		},

		checkComposeAppAndInstallComposeApp (dockerComposeCommands, appName) {
			this.$refs.ComposeConfig.checkStep().then(valid => {
				if (valid.every(v => v === true)) {
					this.isLoading = true
					this.installComposeApp(dockerComposeCommands, appName)
						.finally(() => {
							this.isLoading = false
						})
				} else {
					// toast info error.
					this.$buefy.toast.open({
						message: this.$t('Please confirm the input content.'),
						duration: 5000,
						type: 'is-danger'
					})
				}
			})
		},

		switchAppConfigContent (composeCommands) {
			this.currentSlide = 1
			this.sidebarOpen = false
			this.dockerComposeConfig = composeCommands
		},

		/**
		 * @description: Save edit update
		 * @return {*} void
		 */
		updateApp () {
			this.$refs.ComposeConfig.checkStep().then(valid => {
				if (valid.every(v => v === true)) {
					this.$openAPI.appManagement.compose
						.applyComposeAppSettings(this.id, this.dockerComposeCommands, false, true)
						.then(res => {
							if (res.status == 200) {
								this.$emit('updateState')
							} else {
								this.errInfo = res.data

								this.$buefy.toast.open({
									message: this.$t('The information filled in needs to be corrected'),
									duration: 10000,
									type: 'is-warning'
								})
							}
							this.$emit('close')
						})
						.catch(err => {
							if (err.response.status === 400) {
								console.log('Get ERROR:', err.response.data)
								this.errInfo = err.response.data
							}
							this.$buefy.toast.open({
								message: err.response.data.message,
								duration: 5000,
								type: 'is-warning'
							})
						})
				} else {
					// toast info error.
					this.$buefy.toast.open({
						message: this.$t('Please confirm the input content.'),
						duration: 5000,
						type: 'is-danger'
					})
				}
			})
		},

		updateContainer () {
			this.$refs.containerValida.validate().then(valid => {
				if (valid) {
					this.isLoading = true
					this.$api.container
						.update(this.id, this.settingData)
						.then(res => {
							if (res.data.success == 200) {
								this.isLoading = false
								this.$emit('updateState')
							} else {
								this.$buefy.toast.open({
									message: res.data.message.data,
									type: 'is-warning'
								})
							}
							this.$emit('close')
						})
						.catch(err => {
							this.isLoading = false
							this.$buefy.toast.open({
								message: err.response.data.message,
								type: 'is-warning'
							})
						})
				}
			})
		},

		/**
		 * @description: Show import panel
		 * @return {*} void
		 */
		showImportPanel () {
			this.$buefy.modal.open({
				parent: this,
				component: ImportPanel,
				hasModalCard: true,
				customClass: '',
				trapFocus: true,
				canCancel: ['escape'],
				scroll: 'keep',
				animation: 'zoom-in',
				events: {
					update: e => {
						this.dockerComposeConfig = e
						this.$buefy.dialog.alert({
							title: '⚠️ ' + this.$t('Attention'),
							message:
								'<div class="nobrk"><h4 class="title is-5">' +
								this.$t('AutoFill only helps you to complete most of the configuration.') +
								'</h4>' +
								'<p class="mb-3">' +
								this.$t('Some configuration information such as:') +
								'</p>' +
								'<ul>' +
								'<li>1. ' +
								this.$t('the port and path of the Web UI') +
								'</li>' +
								'<li>2. ' +
								this.$t('the mount location of the volume or file') +
								'</li>' +
								'<li>3. ' +
								this.$t('the port mapping of the Host') +
								'</li>' +
								'<li>4. ' +
								this.$t('optional configuration items') +
								'</li>' +
								'</ul>' +
								'<p class="mt-3">' +
								this.$t(
									'These include but are not limited to these cases and <b>still need to be confirmed or modified by you.</b>'
								) +
								'</p>' +
								'<p class="mt-3">' +
								this.$t('Feel free to suggest improvements to this feature in Discord Server!') +
								'</p></div>',
							type: 'is-dark'
						})
					}
				},
				props: {
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
		exportYAML () {
			let title = YAML.parse(this.dockerComposeCommands)?.['x-casaos']?.['title']
			if (title) {
				title = ice_i18n(title)
			} else {
				title = this.currentInstallId
			}
			const blob = new Blob([this.dockerComposeCommands], { type: '' })
			FileSaver.saveAs(blob, `${title}.yaml`)
		},

		/**
		 * @description: change uuid to var
		 * @param {*} function
		 * @return {data} Object
		 */

		uuid2var (data) {
			data.volumes.forEach(item => {
				item.host = item.host.replace(this.id, '$AppID')
			})
			data.devices.forEach(item => {
				item.host = item.host.replace(this.id, '$AppID')
			})
			return data
		},

		/**
		 * @description: Get Network name from network list
		 * @param {*}
		 * @return {*} String
		 */
		getNetworkName (netId) {
			if (netId == '') {
				return 'bridge'
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
		showTerminalPanel () {
			this.$openAPI.appManagement.compose
				.composeAppContainers(this.id)
				.then(res => {
					if (res.status == 200) {
						const containers = res.data.data.containers
						const containerId = containers[this.dockerComposeServiceName].ID
						this.$buefy.modal.open({
							parent: this,
							component: AppTerminalPanel,
							hasModalCard: true,
							customClass: 'terminal-modal',
							trapFocus: true,
							canCancel: [],
							scroll: 'keep',
							animation: 'zoom-in',
							props: {
								appid: containerId,
								appName: this.currentInstallId,
								serviceName: this.dockerComposeServiceName
							}
						})
					}
				})
				.catch(err => {
					console.log('$openAPI.appManagement.compose.composeAppContainers', err.response)
				})
		},

		async getDiskList () {
			try {
				const storageRes = await this.$api.storage.list({ system: 'show' })
				const storageArray = []
				storageRes.data.data.forEach(item => {
					item.children.forEach(part => {
						part.disk = item.path
						part.diskName = item.disk_name
						storageArray.push(part)
					})
				})
				this.storageData = storageArray.map(storage => {
					return {
						name: storage.label,
						isSystem: storage.diskName == 'System',
						fsType: storage.type,
						size: storage.size,
						availSize: storage.avail,
						usePercent: 100 - Math.floor((storage.avail * 100) / storage.size),
						diskName: storage.drive_name,
						path: storage.path,
						mount_point: storage.mount_point,
						disk: storage.disk
					}
				})
			} catch (error) {
				console.log(error.response.message)
			}
		},

		getSelection (val) {
			this.installationLocation = val
		},

		async askInstallationLocation () {
			try {
				// get docker info
				let { data } = await this.$api.container.getInstallationLocation()
				switch (data.success) {
					case 200:
					case 400:
					default:
						this.isFirstInstall = !data.data.docker_root_dir
						break
				}
			} catch (err) {
				console.log(`${err} in askInstallationLocation`)
			}
		},

		async submitInstallationLocation (val) {
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

			this.$api.container
				.putInstallationLocation(path)
				.then(data => {
					this.isLoading = false
					this.isFirstInstall = data.data.docker_root_dir
				})
				.catch(err => {
					this.isLoading = false
					console.log(`${err} in submitInstallationLocation`)
					this.$buefy.toast.open({
						message: err.message,
						type: 'is-danger'
					})
				})
		},

		installAppProgress (resData) {
			if (this.currentInstallAppName !== resData.name) {
				return false
			}

			if (!resData.finished) {
				this.currentInstallAppError = !resData.success
				if (resData.success) {
					this.currentInstallAppType = resData.type

					if (resData.message !== '') {
						this.totalPercentage = Number(resData.message)

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
				localStorage.removeItem('app_data')
				this.addIdToSessionStorage(resData.name)

				setTimeout(() => {
					this.$emit('updateState')
					this.$emit('close')
				}, 500)
			}
		},

		updateDockerComposeCommands (val) {
			this.dockerComposeCommands = val
		},

		updateDockerComposeServiceName (val) {
			this.dockerComposeServiceName = val
		},
		debounceSearchInput: debounce(function (e) {
			this.searchKey = e
		}, 250)
	},

	destroyed () {
		window.addEventListener('resize', this.setCSSVHVar)
		clearInterval(this.timer)
	},

	sockets: {
		'app:install-begin' (res) {
			this.currentInstallAppName = res.Properties['app:name']
			this.currentSlide = 2
			this.currentInstallAppText = 'Start Installation...'
			this.cancelButtonText = 'Continue in background'
		},
		'app:install-end' (res) {
			this.installAppProgress({
				finished: true,
				name: res.Properties['app:name'],
				id: res.Properties['docker:container:id']
			})
		},
		'app:install-error' (res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties['app:name'],
				id: res.Properties['docker:container:id'],
				success: false,
				message: res.Properties['message']
			})
		},
		'app:install-progress' (res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties['app:name'],
				id: res.Properties['docker:container:id'],
				success: true,
				type: 'pull',
				message: res.Properties['app:progress']
			})
		},
		'docker:image:pull-progress' (res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties['app:name'],
				id: res.Properties['docker:container:id'],
				success: true,
				type: 'pull',
				message: res.Properties['message']
			})
		}
	}
}
</script>

<style lang="scss">
// appPanel global style
.app-panel {
	.modal-card-head {
		background-color: hsla(208, 16%, 94%, 1);
	}

	._stepStoreList {
		min-height: calc(100vh - 2.5rem);

		.modal-card-body {
			overflow-y: scroll;
			overflow-x: clip;
		}
	}
}

.app-search {
	max-width: 12.5rem;
	width: 100%;

	.input {
		height: 2rem !important;
	}
}

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
		top: calc(50% - 3.625rem);
		left: auto;
	}

	.swiper-button-prev,
	.swiper-rtl .swiper-button-next {
		left: -20px;
		top: calc(50% - 3.625rem);
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

			._pl {
				margin-right: 0;
				margin-left: calc(90vw - 100%);
			}
		}
	}
}

@media screen and (min-width: 1440px) {
	.app-panel {
		.modal-card {
			width: 81rem !important;

			._pl {
				margin-right: 0;
				margin-left: calc(81rem - 100%);
			}
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
		max-height: calc(var(--vh, 1vh) * 100);
		border-radius: 0;

		._pl {
			margin-right: 0;
			margin-left: calc(100vw - 100%);
		}
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
	height: 2rem;
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	background: #fff6e5;
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
.close {
	height: 2rem;
	width: 2rem;
	border-radius: 0.375rem;
}

.button[disabled] {
	opacity: 0.3;
}

._hideOverflow {
	overflow: unset;
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

._dropdown {
	height: 2rem;
	border-radius: 0.25rem;

	._dropdown__typeIcon {
		margin-left: 0.625rem;
		width: 18px;
		height: 18px;
	}

	._dropdown__stateIcon {
		margin-right: 0.625rem;
		width: 16px;
		height: 16px;
	}

	._dropdown__item {
		margin-bottom: 2px;
	}
}

.slide-fade-enter-active,
.search-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active,
search-fade-leave-active {
	transition: opacity 0s;
}

.search-fade-enter-from {
	transform: translateY(-20px);
	opacity: 0;
}

.slide-fade-enter-from {
	transform: translateX(20px);
	opacity: 0;
}
</style>
