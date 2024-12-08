<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-11 15:21:54
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-02 12:15:00
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ListIconContainer.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<div :class="item | coverType">
		<transition name="fade">
			<img v-if="showThumb" key="thumb" :class="isWide?'thumb-w':'thumb-h'" :src="imageData" alt="folder"
				 class="is-absolute"/>
			<img v-else key="icon" :class="item | iconType" :src="getIconFile(item)" alt="folder"/>
		</transition>
		<div class="overlay-layer">
			<b-icon v-if="isShared" class="share-icon casa-color-green casa-shape-rounded casa-shape-16px" custom-size="casa-12px"
					icon="share" pack="casa"></b-icon>
		</div>
	</div>
</template>

<script>
import {mixin}            from '@/mixins/mixin';
import IconContainerMixin from '@/mixins/IconContainerMixin'

export default {
	mixins: [mixin, IconContainerMixin],
}
</script>

<style lang="scss" scoped>
.folder-cover {
	position: relative;
}

.overlay-layer {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 10;
	left: 0;
	top: 0;

	.share-icon {
		position: absolute;
		right: -0.5rem;
		bottom: 0.25rem;
	}
}
</style>