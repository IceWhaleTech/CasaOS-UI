<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/3/17 下午4:43
  * @FilePath: /CasaOS-UI/src/components/Apps/AppDetailInfo.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  
  -->
<template>
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
						<h4 class="title store-title is-4 ">{{ i18n(appDetailData.title) }}</h4>
						<p class="subtitle is-size-14px two-line mb-3">{{
								i18n(appDetailData.tagline)
							}}</p>
						<p class="description mb-2">
							<b-button v-if="installedList.includes(appDetailData.id)"
									  :loading="appDetailData.id == currentInstallId" rounded
									  size="is-normal" type="is-primary"
									  @click="openThirdContainerByAppInfo(appDetailData)">
								{{ $t('Open') }}
							</b-button>
							<b-button v-else :disabled="unusable"
									  :loading="appDetailData.id == currentInstallId"
									  rounded size="is-normal" type="is-primary"
									  @click="$emit('install', appDetailData.id, appDetailData);$messageBus('appstore_install', i18n(appDetailData.title) )">
								{{ $t('Install') }}
							</b-button>
						</p>

						<p v-if="unusable"
						   class="has-background-red-tertiary has-text-red has-text-full-04 _is-normal is-flex is-align-items-center font pr-2"
						   style="width: fit-content;height: 1.5rem;border-radius: 0.25rem">
							<label class="is-flex ml-2 mr-1">
								<b-icon class="is-16x16" custom-size="casa-19px" icon="close"
										pack="casa"></b-icon>
							</label>
							{{ $t('Not compatible with {arch} devices.', {arch: archTitle}) }}
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
							<b-icon :icon="getCateIcon(appDetailData.category)"
									custom-size="mdi-36px"></b-icon>
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
				<p class="is-size-14px mb-2 un-break-word">{{ i18n(appDetailData.tagline) }}</p>
				<p class="is-size-14px un-break-word">{{ i18n(appDetailData.description) }}</p>
				<!-- <p class="is-size-14px " v-html="appDetailData.tip"></p> -->
			</div>
			<!-- App Info  End -->

		</section>
	</div>
</template>

<script>

import {Swiper, SwiperSlide}  from 'vue-awesome-swiper'
import business_OpenThirdApp  from "@/mixins/app/Business_OpenThirdApp";
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import commonI18n             from "@/mixins/base/common-i18n";
import app                    from "../../App.vue";

export default {
	name: "AppDetailInfo.vue",
	components: {Swiper, SwiperSlide},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp, commonI18n],
	props: {
		appDetailData: {
			type: Object,
			default: () => {

			}
		},
		installedList: {
			type: Array,
			default: () => {
			}
		},
		currentInstallId: {
			type: String,
			default: ""
		},
		arch: {
			type: String,
			default: ""
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
			default: () => {
			}
		}
	},
	computed: {
		app() {
			return app
		},
		archTitle() {
			// 如果是 arm 默认显示 armv7
			if (this.arch === 'arm') {
				return 'armv7'
			}
			return this.arch
		},
		unusable() {
			return !this.appDetailData.architectures?.includes(this.arch);
		},
	},
	data() {
		return {
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
		}
	},
	methods: {
		// migrate START ======
		// TODO remove the deprecate code.
		/**
		 * @description:
		 * @param {*} swiper
		 * @return {*}
		 */
		/*handleInfoSlide(swiper) {
		  this.disPrev = (swiper.activeIndex == 0) ? true : false;
		  this.disNext = swiper.isEnd;
		},*/

		// migrate END ======

		// this.cateMenu : {name: 'appstore', title: 'App Store', icon: 'mdi-apps', component: 'AppStore'}
		// param : this.cateMenu.name
		getCateIcon(name) {
			let tempO = this.cateMenu.find(item => item.name == name) || {font: 'apps'}
			return tempO.font;
		},

	}
}
</script>

<style scoped>

</style>