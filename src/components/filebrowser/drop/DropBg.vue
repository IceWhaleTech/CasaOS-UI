<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-03-03 10:14:27
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-14 09:31:29
 * @FilePath: \CasaOS-UI-0.4.2\src\components\filebrowser\drop\DropBg.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
	<div class="container is-absolute">
		<div ref="circle1" class="circle"></div>
		<div ref="circle2" class="circle"></div>
	</div>
</template>

<script>
import {gsap} from "gsap";

export default {
	name: "drop-bg",
	mounted() {
		this.init();
	},
	methods: {
		init() {
			const repeats = 1;
			const repeatDelay = 1;
			const gapDelay = 0.8;
			const duration = 2;
			const ratio = 1.86;
			const circle1 = this.$refs.circle1;
			const circle2 = this.$refs.circle2;
			const endScale = 1;
			gsap
				.to(circle1, {
					duration: duration,
					autoAlpha: 0,
					ease: "none",
					scale: endScale,
					repeat: repeats,
					repeatDelay: repeatDelay,
				})
				.then((tween) => {
					tween.revert();
					gsap.to(circle1, {
						duration: duration,
						autoAlpha: 0.02,
						scale: endScale,
						delay: repeatDelay,
					});
				});
			gsap
				.to(circle2, {
					duration: duration,
					autoAlpha: 0,
					ease: "none",
					scale: endScale,
					repeat: repeats,
					repeatDelay: repeatDelay,
					delay: gapDelay,
				})
				.then((tween) => {
					tween.revert();
					gsap.to(circle2, {
						duration: duration / ratio,
						autoAlpha: 0.03,
						scale: endScale / ratio,
						delay: repeatDelay,
					});
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	pointer-events: none;
	z-index: 0;

	.circle {
		border-radius: 50%;
		width: var(--big-radius);
		height: var(--big-radius);
		background-color: #0f8fff;
		position: absolute;
		opacity: 0.06;
		transform: scale(0);
	}
}
</style>
