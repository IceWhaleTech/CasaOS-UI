<template>
	<footer 
	class="modal-card-foot is-flex is-align-items-center ">
		<template>
			<div class="is-flex-grow-1">
			</div>
			<div>
				<b-button v-if="currentInstallAppError" :label="$t('Back')" rounded
						@click="$emit('back')"/>
				<b-button v-if="!currentInstallAppError" :label="$t(cancelButtonText)"
						rounded type="is-primary" @click="$emit('close')"/>
			</div>
		</template>
	</footer>
</template>

<script setup>
defineProps({
	currentInstallAppError: {
		type: Boolean,
		required: true
	},
	cancelButtonText: {
		type: String,
		default: 'CANCEL'
	}
})

const emit = defineEmits([
	'close',
	'back',
])

</script>