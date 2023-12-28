<template>
	<div class="modal-card">
		<header class="is-flex is-align-items-center pt-4 pb-3 pl-4 pr-4 _b-line">
			<div class="is-flex-grow-1 ml-2 mt-1">
				<h3 class="_header-title">{{ $t('Build data station') }}</h3>
			</div>
			<!--			<img alt="" src="@/assets/img/learn/learnmore.svg" @click="close">-->
			<b-icon custom-class="mr-1" icon="close-outline" size="is-medium" @click.native="close"></b-icon>
		</header>
		<section>
			<div class="pl-4 pr-4 pt-4 pb-4 _b-line _font">
				<div v-show="steps === 1" class="ml-2 mr-2">
					<p>{{ $t('Get a huge storage space merged from several hard drives.') }}</p>
					<div>
						<span class="_content-title">{{ $t('Step1:') }}</span>
						<span>{{ $t('Insert more Immovable hard drives and restart.') }}</span>
					</div>
					<img alt="" src="@/assets/img/learn/diskLearnMore-1.svg">
				</div>
				<div v-show="steps === 2" class="ml-2 mr-2">
					<p>{{ $t('Get a huge storage space merged from several hard drives.') }}</p>
					<div>
						<span class="_content-title">{{ $t('Step2:') }}</span>
						<span>{{ $t('Create storages.') }}</span>
					</div>
					<img alt="" src="@/assets/img/learn/diskLearnMore-2.svg">
				</div>
				<div v-show="steps === 3" class="ml-2 mr-2">
					<p>{{ $t('Get a huge storage space merged from several hard drives.') }}</p>
					<div>
						<span class="_content-title">{{ $t('Step3:') }}</span>
						<span>{{ $t('Merge several storages and submit.') }}</span>
					</div>
					<img alt="" src="@/assets/img/learn/diskLearnMore-3.svg">
				</div>
			</div>
		</section>
		<footer class="mb-5 mr-5 ml-5 mt-3">
			<div class="is-flex is-flex-direction-row-reverse">
				<b-button class="is-flex-shrink-0" rounded size="is-small" type="is-primary" @click="steps+=1">
					{{ $t(nextTitle) }}
				</b-button>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	name: "diskLearnMore.vue",
	data() {
		return {
			steps: 1,
			nextTitle: "Next"
		};
	},
	watch: {
		steps(val) {
			if (val === 3) {
				this.nextTitle = "Cancel";
			}
			if (val > 3) {
				this.close();
			}
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
	},
}
</script>

<style lang="scss"  scoped>
._header-title {
	/* Text 500Medium/Text02 */

	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 24px;
	/* identical to box height, or 150% */

	font-feature-settings: 'pnum' on, 'lnum' on;

	/* Gary/800 */

	color: #29343D;
}

._b-line {
	border-bottom: 1px solid hsla(208, 16%, 94%, 1)
}

._font {
	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	/* identical to box height, or 150% */

	color: hsla(0, 0%, 29%, 1);
}

._content-title {
	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 24px;
	/* identical to box height, or 150% */

	color: hsla(0, 0%, 0%, 0.9);

}
</style>
