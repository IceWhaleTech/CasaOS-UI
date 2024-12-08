<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:14:43
 * @FilePath: \CasaOS-UI-0.4.2\src\components\basicComponents\tooltip\tooltip.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<span :class="rootClass">{{ $t(content) }}</span>
</template>

<script>
export default {
	name: "tooltip-vue",
	props: {
		modal: {
			type: String,
			default: "is-success",
			validator(v) {
				return ["is-warning", "is-success", "is-danger", "is-info"].includes(v);
			}
		},
		'isBlock': {
			type: Boolean,
			default: false
		},
		content: {
			type: String,
			default: "Beta"
		}
	},
	computed: {
		rootClass() {
			return ['has-text-white', '_is-normal', {
				'_has-background-green': this.modal === 'is-success',
				'_has-background-red': this.modal === 'is-danger',
				'_tooltip-right-inline': this['isBlock'] === false,
				'_tooltip-right-block': this['isBlock'] === true
			}];
		},
	},
}
</script>

<style scoped>
._has-background-green {
	background: hsla(118, 70%, 45%, 1);
}

._has-background-red {
	background: hsla(18, 98%, 55%, 1);
}

._is-normal {
	/* Text 400Regular/Text04 */

	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 0.75rem;
	line-height: 1rem;
	/* identical to box height, or 133% */

	font-feature-settings: 'pnum' on, 'lnum' on;
	height: 1.125rem;
}

span._tooltip-right-inline {
	position: relative;
	padding: 1px 0.25rem;
	gap: 0.5rem;
	border-radius: 0.25rem;
	top: -1rem;
	left: -0.875rem;
}

span._tooltip-right-block {
	position: relative;
	padding: 1px 0.25rem;
	gap: 0.5rem;
	border-radius: 0.25rem;
	top: -0.375rem;
	right: -0.5rem;
}


</style>