<template>
	<div class="column is-narrow is-3">
		<div class="common-card is-flex is-align-items-center is-justify-content-center p-55 app-card">
			<div class="blur-background"></div>

			<div class="cards-content">
				<!-- Card Content Start -->
				<b-tooltip :label="$t('Open')" type="is-dark" animation="fade1" :animated="true">
					<div
					class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3 img-c">
						<a class="is-flex is-justify-content-center">
							<b-image :src="require('@/assets/img/app/appstore.svg')" class="is-64x64"></b-image>
						</a>
						<p class="mt-3 one-line">
							<a class="one-line">
								{{ $t('App Store') }}
							</a>
						</p>

					</div>
				</b-tooltip>
				<!-- Card Content End -->
			</div>
		</div>
	</div>
</template>

<script>
export default {}
</script>
