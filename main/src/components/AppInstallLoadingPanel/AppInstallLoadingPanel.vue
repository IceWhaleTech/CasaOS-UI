<template>
<div :class="{'_hideOverflow': !isCasa}" class="modal-card-body pt-3 _b-line">
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

	<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
</div>
</template>

<script setup>
import LottieAnimation                          from "lottie-web-vue";

defineProps({
	isCasa: Boolean,
	totalPercentage: Number,
	currentInstallAppText: String,
	currentInstallAppTextClass: String,
	isLoading: Boolean,
})
</script>