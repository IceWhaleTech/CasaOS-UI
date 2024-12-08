<template>
	<div class="li">
		<div v-if="item.visible" :class="{ 'active': isActived }" class="is-flex list-item new-list-item"
			@click="open(item.path)">
			<div class="cover mr-2 is-flex-shrink-0 is-relative is-flex is-align-items-center">
				<template v-if="item.icon !== 'danger'">
					<b-icon v-if="isIconFont" :class="iconColor" :icon="item.icon" :pack="item.pack"
						custom-size="casa-24px"></b-icon>
					<div v-else class="img-container">
						<b-image :src="item.icon" class="is-24x24"></b-image>
					</div>
				</template>
				<b-icon v-else class="warn" custom-size="casa-16px" icon="danger" pack="casa"></b-icon>
				<div v-if="isShare" class="overlay-layer">
					<b-icon :pack="item.pack" class="casa-color-green casa-shape-rounded casa-shape-12px"
						custom-size="casa-10px" icon="share"></b-icon>
				</div>
			</div>
			<div class=" is-flex-grow-1 one-line">{{ item.name }}</div>
			<div v-if="iconName != ''" class=" is-flex-shrink-0 is-flex" @click.stop="rightIconClick">
				<b-icon :icon="iconName" :pack="item.pack" class="casa-color-gray" custom-size="casa-16px"></b-icon>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	inject: ['filePanel'],
	components: {},
	props: {
		item: {
			type: Object,
			default: null
		},
		iconColor: {
			type: String,
			default: ''
		},
		iconType: {
			type: String,
			default: 'font'
		},
		iconName: {
			type: String,
			default: ''
		},
		isShare: {
			type: Boolean,
			default: false
		},
		isShow: {
			type: Boolean,
			default: true
		},
		isActive: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {}
	},
	computed: {
		isActived() {
			if (!this.isActive) {
				return false;
			}
			if (this.item.path == this.$store.state.currentPath) {
				return true
			} else if (this.item.path != this.$store.state.currentPath && this.item.path != "/" && this.item.path != "/DATA") {
				if (this.$store.state.currentPath.indexOf(`${this.item.path}/`) != -1) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}

		},
		isIconFont() {
			return this.iconType == 'font'
		}
	},

	methods: {
		open() {
			this.filePanel.getFileList(this.item.path);
		},

		rightIconClick() {
			this.$emit('rightIconClick', this.item);
		},
	},
}
</script>

<style lang="scss" scoped>
.overlay-layer {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;

	.icon {
		position: absolute;
		right: -0.15rem;
		bottom: -0.1rem;
	}


}

.img-container {
	width: 24px;
	height: 24px;
}
</style>