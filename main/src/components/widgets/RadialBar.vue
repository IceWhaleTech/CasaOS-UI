<template>
	<div :style="cssVariables">
		<div class="container">
			<svg class="circle-container" viewBox="2 -3 28 38" xmlns="http://www.w3.org/2000/svg">
				<linearGradient id="gradient" x1="0.17" x2="0.83" y1="0.13" y2="0.87">
					<stop :style="{ stopColor: stop2 }" offset="0%"/>
					<stop :style="{ stopColor: stop1 }" offset="100%"/>
				</linearGradient>
				<circle
					class="circle-container__background"
					cx="16"
					cy="16"
					r="16"
					shape-rendering="geometricPrecision"
				></circle>
				<circle
					:style="{ 'stroke-dashoffset': inPercent }"
					class="circle-container__progress"
					cx="16"
					cy="16"
					r="16"
					shape-rendering="geometricPrecision"
				></circle>
			</svg>
			<div class="overlay">
				<div class="per">{{ percent }}</div>
				<div class="label">{{ label }}</div>
			</div>
		</div>
		<div :class="{ 'is-clickable': extendContentClickable }" class="bar-content" @click="extendClick">
			{{ extendContent }}
		</div>
	</div>
</template>

<script>
export default {
	props: {
		dotDiameter: {
			type: String,
			default: "92px",
		},
		circleBorderWidth: {
			type: String,
			default: "5px",
		},
		circleBackgroundColor: {
			type: String,
			default: "rgba(255, 255, 255, 0.4)",
		},
		stopColorStart: {
			type: String,
			default: "#33FFAA",
		},
		stopColorEnd: {
			type: String,
			default: "#FFD580",
		},
		percent: {
			type: Number,
			default: 0,
		},
		label: {
			type: String,
			default: "",
		},
		extendContent: {
			type: String,
			default: "",
		},
		extendContentClickable: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			stop1: this.stopColorStart,
			stop2: this.stopColorEnd,
		};
	},
	computed: {
		inPercent() {
			return (100 - this.percent) * 0.75;
		},
		cssVariables() {
			return {
				"--dot-diameter": this.dotDiameter,
				"--circle-border-width": this.circleBorderWidth,
				"--circle-background-color": this.circleBackgroundColor,
			};
		},
	},
	methods: {
		extendClick() {
			if (this.extendContentClickable) {
				this.$emit("extendContentClick");
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	margin: auto;
	width: var(--dot-diameter);
	height: var(--dot-diameter);
	display: flex;
	flex-direction: column;
	justify-items: center;
	align-content: stretch;
	align-items: center;

	.circle-container {
		width: var(--dot-diameter);
		height: var(--dot-diameter);
		transform: rotate(-225deg);
		fill: none;
		stroke: white;
		stroke-dasharray: 75 100;
		stroke-linecap: round;
	}

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.per {
		font-size: 1.5rem;
		font-weight: 500;
		color: $grey-200;
		position: relative;
		line-height: 2rem;

		&::after {
			content: "%";
			position: absolute;
			font-size: 0.875rem;
			color: $grey-400;
			bottom: 0.4rem;
			line-height: 1em;
			margin-left: 0.1rem;
		}
	}

	.label {
		position: absolute;
		font-size: 0.875rem;
		font-weight: 400;
		color: $grey-200;
		bottom: 0;
		margin-bottom: 0;
		line-height: 1.25rem;
	}
}

.bar-content {
	text-align: center;
	font-size: 0.875rem;
	font-weight: 500;
	color: $grey-200;
	line-height: 1.25rem;
	margin-top: 0.25rem;
}

.circle-container__background {
	fill: none;
	stroke: var(--circle-background-color);
	stroke-width: var(--circle-border-width);
	stroke-dasharray: 75 100;
	stroke-linecap: round;
}

.circle-container__progress {
	fill: none;
	stroke-linecap: round;
	stroke: url(#gradient);
	stroke-dasharray: 75 100;
	stroke-width: var(--circle-border-width);
	transition: stroke-dashoffset 1s ease-in-out;
}
</style>
