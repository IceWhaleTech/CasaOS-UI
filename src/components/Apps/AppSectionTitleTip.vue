<template>
	<h1 class="has-text-grey-100 is-flex-shrink-1 is-flex-grow-1 ml-2 mb-0 contextmenu-canvas home-app-tip">
		<b-tooltip :active="active" always position="is-right" type="is-dark">
			<template v-slot:content>
				<div class="mr-1">{{ $t(label) }}</div>
				<div class="is-clickable" @click="hideTip">
					<b-icon icon="close-xs-outline" pack="casa"></b-icon>
				</div>
			</template>
			<span class="mr-2">{{ $t(title) }}</span>
		</b-tooltip>
	</h1>
</template>

<script>
export default {
	name: "app-section-title-tip",
	props: {
		title: {
			type: String,
			default: ""
		},
		label: {
			type: String,
			default: ""
		},
		id: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			active: !localStorage.getItem(this.id),
		}
	},
	methods: {
		hideTip() {
			localStorage.setItem(this.id, "hide");
			this.active = false
		}
	},

}
</script>

<style lang="scss">
.home-app-tip {
	.tooltip-content {
		display: flex;
		align-items: center;
		padding-right: 0.25rem;
		line-height: 1.5rem;
	}

	.is-clickable {
		line-height: 1rem;
		height: 1.5rem;
	}
}
</style>
