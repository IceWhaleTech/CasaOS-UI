<template>
	<nav class="level is-mobile mt-4">
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">{{ $t('CATEGORY') }}</p>
				<p class="title">
					<b-icon :icon="categoryIcon"
							custom-size="mdi-36px"></b-icon>
				</p>
				<p class="footing is-size-14px">{{ appDetailData.category }}</p>
			</div>
		</div>
    
		<div class="vertical-line"/>
    
		<div class="level-item has-text-centered">
			<div>
				<p class="heading">{{ $t('DEVELOPER') }}</p>
				<p class="title">
					<b-icon custom-size="mdi-36px" icon="account-circle-outline"></b-icon>
				</p>
				<p class="footing is-size-14px">{{ appDetailData.developer }}</p>
			</div>
		</div>

		<div class="vertical-line"/>

		<div class="level-item has-text-centered">
			<div>
				<p class="heading "><span class="is-hidden-mobile">{{
						$t('REQUIRE')
					}} </span>{{ $t('MEMORY') }}</p>
				<p class="title has-text-weight-normal">{{ appDetailData.min_memory }}</p>
				<p class="footing is-size-14px">MB</p>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { computed, defineProps } from 'vue';
const props = defineProps({
	appDetailData: {
		type: Object,
		default: () => {
		}
	},
	// cateMenu: {
	// 	type: Array,
	// 	default: []
	// },
});

// const getCategoryIcon = (name) => {
// 	let category = props.cateMenu.find(item => item.name == name) || {font: 'apps'}
// 	return category.font;
// };

const categoryIcon = computed(() => {
	return props.appDetailData.category;
});

</script>

<style scoped>
.level {
	position: relative;
  
	.footing {
		color: hsl(0, 0%, 48%);
	}
}

.vertical-line{
	border-left: 1px solid #cfcfcf;
	height: 36px;
}

@media screen and (max-width: 480px) {
	.level {
		.mdi-36px.mdi-set,
		.mdi-36px.mdi:before {
			font-size: 24px;
		}

		.title {
			font-size: 24px;
		}

		.footing {
			font-size: 0.6rem !important;
		}
	}
}

</style>