<template>
	<div class="app-header is-flex pb-4 b-line">
		<div class="header-icon mr-5">
			<b-image :key="appDetailData.icon" :src="appDetailData.icon"
				:src-fallback="require('@/assets/img/app/default.svg')"
				class="is-128x128 icon-shadow"
				webp-fallback=".jpg">
			</b-image>
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
						@click="handleInstallBtnClick">
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

</template>

<script setup>
import { defineProps, defineExpose, defineEmits } from 'vue';
import { usei18n } from '@/composables/usei18n';
import messageBus from '@/events';

const props = defineProps({
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
	unusable: {
		type: Boolean,
		default: false
	},
	currentInstallId: {
		type: String,
		default: ''
	},
	archTitle: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['install']);

const { i18n } = usei18n();

const handleInstallBtnClick = ()=>{
	emit('install');
	messageBus('appstore_install', i18n(props.appDetailData.title));
}

defineExpose({
	i18n
})

</script>


<style scoped>
.app-header {
	position: relative;
}

@media screen and (max-width: 480px) {
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
}
</style>