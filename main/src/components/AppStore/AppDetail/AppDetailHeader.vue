<template>
	<header class="modal-card-head">
		<div class="is-flex-grow-1">
			<div class="button is-ghost auto-height pl-0 pt-0 pb-0" @click="handleBackBtnClick">
				<b-icon class="mr-1" icon="chevron-left" size="is-medium"></b-icon>
				{{ $t('Back') }}
			</div>
		</div>
	</header>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
	handleBackBtnClick: {
		type: Function,
		default: () => {
		}
	},
});
</script>
