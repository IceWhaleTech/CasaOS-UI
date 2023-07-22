<template>
	<div class="is-relative">
		<swiper ref="infoSwiper" :options="swiperOptions"
				class="swiper swiper-responsive-breakpoints">
			<swiper-slide v-for="item in appDetailData.screenshot_link" :key="'sc'+item">
				<div class="gap">
					<b-image 
						class="app-screenshot"
						:src="item"
						:src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
						placeholder ratio="16by9">
					</b-image>
				</div>
			</swiper-slide>
		</swiper>

		<div :class="{'swiper-button-disabled':disPrev}" class="swiper-button-prev"
			@click="$refs.infoSwiper.$swiper.slidePrev()">
		</div>

		<div :class="{'swiper-button-disabled':disNext}" class="swiper-button-next"
			@click="$refs.infoSwiper.$swiper.slideNext()">
		</div>
	</div>
</template>

<script setup>
import { defineProps,defineExpose,ref,reactive } from 'vue';
import { Swiper, SwiperSlide }  from 'vue-awesome-swiper'

const props = defineProps({
	appDetailData: {
		type: Object,
		default: () => {
		}
	},
});

const disPrev = ref(false);
const disNext = ref(false);

const swiperOptions =reactive( {
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
})

defineExpose({
	disPrev,
	disNext,
	swiperOptions
});

</script>

<style lang="scss" scoped>
.app-screenshot{
	border-radius: 8px;
	border: 1px solid #cfcfcf;
	overflow: hidden;

}
.swiper-button-next, .swiper-rtl .swiper-button-prev {
	right: -20px;
	left: auto;
}

.swiper-button-prev,
.swiper-rtl .swiper-button-next {
	left: -20px;
	right: auto;
}

</style>