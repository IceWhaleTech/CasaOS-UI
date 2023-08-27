<template>
	<footer 
	class="modal-card-foot is-flex is-align-items-center ">
		<template>
			<div class="is-flex-grow-1">
			</div>
			<div>
				<b-button v-if="state == 'install'" :label="$t('Install')" :loading="isLoading"
					rounded type="is-primary" @click="$emit('install')"/>
				<b-button v-if="isCasa && state == 'update'" :label="$t('Save')"
					:loading="isLoading"
					rounded type="is-primary" @click="$emit('update')"/>
				<b-button v-if="!isCasa && state == 'update'" :label="$t('Save')"
					:loading="isLoading"
					rounded type="is-primary" @click="$emit('updateContainer')"/>
			</div>
		</template>
	</footer>
</template>
<script setup>
defineProps({
	state: {
		type: String,
		required: true
	},
	isCasa: {
		type: Boolean,
		required: true
	},
	isLoading: {
		type: Boolean,
		required: true
	}
})

defineEmits([
	'install',
	'update',
	'updateContainer'
])
</script>