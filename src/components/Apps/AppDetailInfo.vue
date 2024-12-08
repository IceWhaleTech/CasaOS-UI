<template>
	<div class="modal-card app-detial">
		<!-- Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<div class="button is-ghost auto-height pl-0 pt-0 pb-0" @click="close">
					<b-icon class="mr-1" icon="left-outline" size="is-20x20" pack="casa"></b-icon>
					{{ $t('Back') }}
				</div>
			</div>
		</header>
		<!-- Header End -->
		<section id="ss-content" class="modal-card-body">
			<!-- App Info Header Start -->
			<div class="app-header is-flex pb-4 b-line">
				<div class="header-icon mr-5">
					<b-image
						:key="appDetailData.icon"
						:src="appDetailData.icon"
						:src-fallback="require('@/assets/img/app/default.svg')"
						class="is-128x128 icon-shadow"
						webp-fallback=".jpg"
					></b-image>
				</div>
				<div class="is-flex-grow-1 is-flex is-align-items-center">
					<div>
						<h4 class="title store-title is-4">{{ i18n(appDetailData.title) }}</h4>
						<p class="subtitle is-size-14px two-line mb-3">{{ i18n(appDetailData.tagline) }}</p>
						<p class="description mb-2">
							<b-button
								v-if="installedList.includes(appDetailData.id)"
								:loading="appDetailData.id == currentInstallId"
								rounded
								size="is-normal"
								type="is-primary"
								@click="openThirdContainerByAppInfo(appDetailData)"
							>
								{{ $t('launch-and-open') }}
							</b-button>
							<b-button
								v-else
								class="p-0 custom-install-button"
								:disabled="unusable"
								:loading="appDetailData.id == currentInstallId"
								rounded
								size="is-normal"
								type="is-primary"
							>
								<div
									@click.self="
										$emit('install', appDetailData.id, appDetailData)
										$messageBus('appstore_install', i18n(appDetailData.title))
									"
									class="custom-install-button-content"
								>
									{{ $t('Install') }}
								</div>
								<b-dropdown :triggers="['hover', 'click']" @click.stop>
									<template #trigger>
										<div class="casa-down-outline custom-install-dropdown-trigger"></div>
									</template>
									<b-button
										:disabled="unusable"
										:loading="appDetailData.id == currentInstallId"
										rounded
										size="is-normal"
										type="is-primary"
										@click="openConfigPanle"
									>
										{{ $t('Custom Install') }}
									</b-button>
								</b-dropdown>
							</b-button>
						</p>

						<p
							v-if="unusable"
							class="has-background-red-tertiary has-text-red has-text-full-04 _is-normal is-flex is-align-items-center font pr-2"
							style="width: fit-content; height: 1.5rem; border-radius: 0.25rem"
						>
							<label class="is-flex ml-2 mr-1">
								<b-icon
									class="is-16x16"
									custom-size="casa-19px"
									icon="close-outline"
									pack="casa"
								></b-icon>
							</label>
							{{ $t('Not compatible with {arch} devices.', { arch: archTitle }) }}
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
							<b-icon :icon="getCateIcon(appDetailData.category)" custom-size="mdi-36px"></b-icon>
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
						<p class="heading">
							<span class="is-hidden-mobile">{{ $t('REQUIRE') }} </span>{{ $t('MEMORY') }}
						</p>
						<p class="title has-text-weight-normal">{{ appDetailData.min_memory }}</p>
						<p class="footing is-size-14px">MB</p>
					</div>
				</div>
			</nav>
			<!-- App Info Table End -->

			<!-- App Info Slider Start -->
			<div v-if="showDetailSwiper" class="is-relative">
				<swiper
					ref="infoSwiper"
					:options="swiperOptions"
					class="swiper swiper-responsive-breakpoints"
					@observer-update="updateSwiper"
					@ready="handleSwiperReadied"
				>
					<swiper-slide v-for="item in appDetailData.screenshot_link" :key="'sc' + item">
						<div class="gap">
							<b-image
								:src="item"
								:src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
								class="border-8 is-clickable"
								placeholder
								ratio="16by9"
								@click.native="zoomScreenshot(item)"
							></b-image>
						</div>
					</swiper-slide>
				</swiper>
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			</div>

			<!-- App Info Slider End -->

			<!-- App Info  Start -->
			<div class="app-desc mt-4 mb-6 is-size-14px">
				<VMdEditor :value="i18n(appDetailData.description)" mode="preview" left-toolbar right-toolbar>
				</VMdEditor>
			</div>
			<!-- App Info  End -->
		</section>
	</div>
</template>

<script>
import VMdEditor from '@kangc/v-md-editor'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import business_OpenThirdApp from '@/mixins/app/Business_OpenThirdApp'
import business_ShowNewAppTag from '@/mixins/app/Business_ShowNewAppTag'
import commonI18n from '@/mixins/base/common-i18n'
import app from '@/App.vue'
import YAML from 'yaml'

export default {
	name: 'AppDetailInfo.vue',
	components: { VMdEditor, Swiper, SwiperSlide },
	mixins: [business_ShowNewAppTag, business_OpenThirdApp, commonI18n],
	props: {
		appDetailData: {
			type: Object,
			default: () => {}
		},
		installedList: {
			type: Array,
			default: () => {}
		},
		currentInstallId: {
			type: String,
			default: ''
		},
		arch: {
			type: String,
			default: ''
		},
		showDetailSwiper: {
			type: Boolean,
			default: false
		},
		cateMenu: {
			type: Array,
			default: []
		},
		close: {
			type: Function,
			default: () => {}
		}
	},
	computed: {
		app () {
			return app
		},
		archTitle () {
			// 如果是 arm 默认显示 armv7
			if (this.arch === 'arm') {
				return 'armv7'
			}
			return this.arch
		},
		unusable () {
			return !this.appDetailData.architectures?.includes(this.arch)
		}
	},
	data () {
		return {
			//Image List Swiper
			disPrev: false,
			disNext: false,
			slidesPerView: 3,
			swiper: null,
			swiperOptions: {
				loop: false,
				autoplay: true,
				observer: true,
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
				},
				on: {
					breakpoint: swiper => {
						this.slidesPerView = swiper.slidesPerView
					}
				}
			}
		}
	},
	methods: {
		updateSwiper () {
			this.swiper.slideTo(0, 0, false)
		},
		handleSwiperReadied (swiper) {
			this.swiper = swiper
		},
		getCateIcon (name) {
			let tempO = this.cateMenu.find(item => item.name == name) || { font: 'apps' }
			return tempO.font
		},
		zoomScreenshot (img) {
			const customVNode = this.$createElement(
				'div',
				{
					class: 'modal-content'
				},
				[this.$createElement('img', { attrs: { src: img } })]
			)

			this.$buefy.modal.open({
				content: [customVNode],
				customClass: '_zoom-screenshot',
				fullScreen: true,
				hasModalCard: true,
				destroyOnHide: true,
				animation: 'zoom-in',
				canCancel: ['outside', 'x']
			})
		},
		openConfigPanle () {
			this.$emit('switchAppConfigContent', YAML.stringify(this.appDetailData.compose))
		},
	}
}
</script>

<style lang="scss">
//The underscore "_" here represents that it is only used in this context and needs to be placed in the modularized CSS later.
.modal._zoom-screenshot {
	.animation-content {
		display: flex;
		align-items: center;
	}

	.modal-content {
		width: auto;
		overflow: unset;

		img {
			max-width: 90vw;
			max-height: 90vh;
			border: 3px solid #ccc;
			border-radius: 1rem;
			box-shadow: 0 0 40px 0 rgba(255, 255, 255, 0.2);
		}
	}

	.modal-close {
		position: absolute;

		&::before,
		&::after {
			background: #fff;
		}
	}
}

.app-detial .modal-card-body .github-markdown-body {
	padding: 1rem 0 0 0;
	font-size: 0.875rem;
	line-height: 1.25rem;
}

// version dropdown css
.custom-install-button {
	span {
		display: flex;
		.custom-install-button-content {
			display: flex;
			flex-shrink: 0;
			padding-left: 1.25rem;
			padding-top: 0.25rem;
			padding-bottom: 0.25rem;
		}
		.custom-install-dropdown-trigger {
			width: 3rem;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.dropdown-menu,
		.dropdown-content {
			box-shadow: none;
		}
		.dropdown-content .button {
			display: flex;
		}
	}
}
</style>
