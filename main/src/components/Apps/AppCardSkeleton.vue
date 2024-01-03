<template>
	<div class="common-card is-flex is-align-items-center is-justify-content-center p-55 app-card" :style="animation">
		<!-- Action Button End -->
		<div class="blur-background"></div>
		<div class="cards-content">
			<!-- Card Content Start -->
			<div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-5 pb-3">
				<div class="is-flex is-justify-content-center">
					<b-image :src="require('@/assets/img/app/sk_icon.svg')" class="is-64x64"></b-image>
				</div>
				<div class="sk-line mt-3"></div>

			</div>
			<!-- Card Content End -->˝
		</div>
	</div>
</template>

<script>
export default {
	props: {
		index: {
			type: Number,
			default: 0
		},
		gap: {
			type: Number,
			default: 0.2
		}
	},

	data() {
		return {
			animation: {
				animationDelay: this.index * this.gap + 's',
			}
		}
	},

}
</script>

<style lang="scss" scoped>
@keyframes light {
	from {
		opacity: 1;
	}

	to {
		opacity: 0.7;
	}
}

.common-card {

	animation-name: light;
	animation-duration: 1.5s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	animation-direction: alternate;

	&:hover {
		box-shadow: none
	}

	.sk-line {
		width: 4.5rem;
		height: 0.75rem;
		border-radius: 0.25rem;
		background-color: rgba(133, 149, 163, 0.6);
	}
}
</style>