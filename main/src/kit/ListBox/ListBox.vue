<<template>
	<transition name="slide-fade">
		<div v-if="!activeAppStoreSourceInput || !isMobile"
			class="_polymorphic is-flex is-align-items-center _dropdown">
			<b-dropdown v-model="currentOptionProxy" :max-height="240" :mobile-modal="false"
						animation="fade1" aria-role="list" class="app-select file-dropdown"
						position="is-bottom-right" scrollable>
				<template #trigger="{ active }">
					<div
						class="is-text auto-height pl-0 pt-0 pb-0 is-flex is-align-items-center">
						<b-icon 
							class="mr-1 _dropdown__typeIcon" 
							custom-size="mdi-18px"
							:icon="icon"
							pack="casa">
						</b-icon>
						<span class="has-text-full-03">
							{{ currentOption.name }}
						</span>
						<b-icon 
							:icon="active ? 'chevron-up' : 'chevron-down'"
							class="ml-2 _dropdown__stateIcon"
							custom-size="casa-16px">
						</b-icon>
					</div>
				</template>
				<b-dropdown-item v-for="option in listData" :key="option.id"
					:class="option.id == listData.id?'is-active':''"
					:data-title="option.count"
					:value="option" aria-role="listitem"
					class="_dropdown__item">
					<div class="media is-align-items-center is-flex has-text-full-03"
						@click="handleOptionClick(option)">
						<div class="media-content">
							<h3>{{ option.name }}</h3>
						</div>
					</div>
				</b-dropdown-item>
			</b-dropdown>

		</div>
	</transition>
</template>
<script setup>
import { computed, defineProps } from 'vue';

const emit = defineEmits([
	'update-current-option',
])

const props = defineProps({
	activeAppStoreSourceInput: Boolean,
	isMobile: Boolean,
	currentOption: Object,
	listData: Array,
	handleOptionClickCallBack: {
		type: Function,
		default: () => {}
	},
	icon: String,
});

// to avoid mutating a prop directly
const currentOptionProxy = computed({
	get: () => props.currentOption,
	set: (val) => {
		emit('update-current-option', val)
	}
})

const handleOptionClick = (option) => {
	props.handleOptionClickCallBack(option)
}
</script>

<style scoped>
.slide-fade-enter-active, .search-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active, search-fade-leave-active {
	transition: opacity 0s;
}

.search-fade-enter-from {
	transform: translateY(-20px);
	opacity: 0;
}

.slide-fade-enter-from {
	transform: translateX(20px);
	opacity: 0;
}
</style>