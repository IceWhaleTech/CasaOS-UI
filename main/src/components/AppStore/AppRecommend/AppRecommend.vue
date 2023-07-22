<template>
	<div>
	<h3 class="title is-5 has-text-weight-normal">{{ $t('Featured Apps') }}</h3>
	<!-- Featured Slider Start -->
	<div class="is-relative featured-app b-line">
		<swiper ref="featureSwiper" :options="featureSwiperOptions" class="swiper ">
			<swiper-slide v-for="(item,index) in recommendList " :key="index+item.title+item.id"
					class="pb-5">
				<div class="gap" @click="showAppDetial(item.id)">
					<b-image 
						:placeholder="require('@/assets/img/app/swiper_placeholder.png')"
						:src="item.thumbnail"
						:src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
						class="border-8 is-clickable"
						ratio="16by9">
					</b-image>
				</div>
				<div class="is-flex pt-5 is-align-items-center">
					<div class=" mr-3" @click="showAppDetial(item.id)">
						<b-image :placeholder="require('@/assets/img/app/default.svg')"
							:src="item.icon"
							:src-fallback="require('@/assets/img/app/default.svg')"
							class="is-64x64 is-clickable icon-shadow">
						</b-image>
					</div>
					<div class="is-flex-grow-1 mr-4 is-clickable"
						@click="showAppDetial(item.id);$messageBus('appstore_detail', item.title)">
						<h6 class="title is-6 mb-2 ">{{ item.title }}</h6>
						<p class="is-size-7 two-line">{{ item.tagline }}</p>
					</div>
					<div>
						<b-button v-if="installedList.includes(item.id)"
							:loading="item.id == currentInstallId"
							rounded size="is-small"
							type="is-primary is-light"
							@click="openThirdContainerByAppInfo(item)">{{ $t('Open') }}
						</b-button>
						<b-button v-else :disabled="!item.architectures?.includes(arch)"
							:loading="item.id == currentInstallId"
							rounded size="is-small"
							type="is-primary is-light"
							@click="quickInstall(item.id);$messageBus('appstore_install', item.title)">
							{{ $t('Install') }}
						</b-button>
					</div>
				</div>
			</swiper-slide>

		</swiper>
		<div :class="{'swiper-button-disabled':disFeaturedPrev}" class="swiper-button-prev"
			@click="$refs.featureSwiper.$swiper.slidePrev();$messageBus('appstore_slide')">
		</div>
		<div :class="{'swiper-button-disabled':disFeaturedNext}" class="swiper-button-next"
			@click="$refs.featureSwiper.$swiper.slideNext();$messageBus('appstore_slide')">
		</div>
	</div>
</div>
</template>

<script setup>
import { defineProps,ref,reactive } from 'vue';
import { Swiper, SwiperSlide }  from 'vue-awesome-swiper'

const disFeaturedPrev =ref(false)
const disFeaturedNext =ref(false)
const featureSwiperOptions =reactive({
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
})


const props = defineProps({
	recommendList: {
		type: Array,
		default: () => []
	},
	installedList: {
		type: Array,
		default: () => []
	},
	currentInstallId: {
		type: String,
		default: ''
	},
	arch: {
		type: String,
		default: ''
	},
	showAppDetial: {
		type: Function,
		default: () => {}
	},
	quickInstall: {
		type: Function,
		default: () => {}
	},
	featureSwiperOptions: {
		type : Object,
	}
});
</script>

<style scoped>
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
</style>