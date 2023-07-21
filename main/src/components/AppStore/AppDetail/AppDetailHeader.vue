<template>
	<header class="modal-card-head" style="background:#ff000">
		<div class="is-flex-grow-1">
			<div class="button is-ghost auto-height pl-0 pt-0 pb-0" @click="close">
				<b-icon class="mr-1" icon="chevron-left" size="is-medium"></b-icon>
				{{ $t('Back') }}
			</div>
		</div>
	</header>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
	close: {
		type: Function,
		default: () => {
		}
	},
});
</script>

