<template>
	<div class="widget has-text-white clock">
		<div class="blur-background"></div>
		<div class="widget-content">
			<div class="time mb-2 is-clickable" @click="changeFormat">{{ timeText }}</div>
			<div class="date">{{ dateText }}</div>
		</div>
	</div>
</template>

<script>
import dateFormat from "dateformat";

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "clock",
	icon: "time-outline",
	title: "Time",
	initShow: true,
	data() {
		return {
			timer: 0,
			timeText: "",
			dateText: "",
			lang: this.$i18n.locale.replace("_", "-"),
			timeFormat: localStorage.getItem("timeFormat") ? localStorage.getItem("timeFormat") : "HH:MM",
		};
	},
	mounted() {
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.updateClock();
		this.timer = setInterval(() => {
			this.updateClock();
		}, 1000);
	},
	watch: {
		"$i18n.locale": {
			handler(data) {
				this.lang = data.replace("_", "-");
			},
			deep: true,
		},
	},

	methods: {
		updateClock() {
			const today = new Date();

			this.timeText = dateFormat(today, this.timeFormat);
			this.dateText = today.toLocaleDateString(this.lang, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		},
		changeFormat() {
			this.timeFormat = this.timeFormat == "HH:MM" ? "h:MM TT" : "HH:MM";
			localStorage.setItem("timeFormat", this.timeFormat);
			this.updateClock();
		},
	},
};
</script>

<style lang="scss" scoped>
.clock {
	font-style: normal;
	font-weight: 300;
	text-align: left;

	.time {
		font-size: 2rem;
		font-weight: 600;
		line-height: 1.125em;
		color: $grey-100;
	}

	.date {
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.25rem;
		color: $grey-400;
	}
}
</style>
