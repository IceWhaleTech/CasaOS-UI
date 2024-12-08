<template>
	<div class="widget has-text-grey-100 cpu">
		<div class="blur-background"></div>
		<div class="widget-content pb-1">
			<!-- Header Start -->
			<div class="widget-header is-flex">
				<div class="widget-title is-flex-grow-1">
					{{ $t("System Status") }}
				</div>
				<div class="widget-icon-button is-flex-shrink-0" @click="showMoreInfo">
					<b-icon :class="{ open: showMore }" class="arrow-btn" icon="right-outline" pack="casa"></b-icon>
				</div>
			</div>
			<!-- Header End -->

			<div class="columns is-mobile mt-0 mb-1">
				<div class="column is-half has-text-centered">
					<radial-bar :extendContent="power + temperature" :extendContentClickable="true"
						:percent="parseInt(cpuSeries)" label="CPU" @extendContentClick="changeFormat"></radial-bar>
				</div>
				<div class="column is-half has-text-centered">
					<radial-bar :extendContent="renderSize(totalMemory)" :percent="parseInt(ramSeries)"
						label="RAM"></radial-bar>
				</div>
			</div>
			<div v-if="showMore">
				<div class="more-info pt-1 pb-1">
					<b-tabs v-model="activeTab">
						<b-tab-item label="CPU">
							<div v-for="(item, index) in containerCpuList" :key="item.title + index + '-cpu'">
								<div v-if="!isNaN(item.usage)" class="is-flex is-size-7 is-align-items-center mb-2">
									<div class="is-flex-grow-1 is-flex is-align-items-center is-clipped">
										<b-image :lazy="false" :src="item.icon"
											:src-fallback="require('@/assets/img/app/default.svg')"
											class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
										<span class="one-line">{{ item.title }}</span>
									</div>
									<div class="is-flex-shrink-0">{{ item.usage }}%</div>
								</div>
							</div>
						</b-tab-item>

						<b-tab-item label="RAM">
							<div v-for="(item, index) in containerRamList" :key="item.title + index + '-rem'">
								<div v-if="!isNaN(item.usage) && renderSize(item.usage).split(' ')[0] != 0"
									class="is-flex is-size-7 is-align-items-center mb-2">
									<div class="is-flex-grow-1 is-flex-shrink-1 is-flex is-align-items-center is-clipped">
										<b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.svg')"
											class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
										<span class="one-line">{{ item.title }}</span>
									</div>
									<div class="is-flex-shrink-0">{{ item.usage | renderSize }}</div>
								</div>
							</div>
						</b-tab-item>
					</b-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
import smoothReflow from "vue-smooth-reflow";
import orderBy from "lodash/orderBy";
import has from "lodash/has";
import slice from "lodash/slice";
import { mixin } from "@/mixins/mixin";
import RadialBar from "@/components/widgets/RadialBar.vue";

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "cpu",
	icon: "system-outline",
	title: "System Status",
	initShow: true,
	mixins: [smoothReflow, mixin],
	components: {
		RadialBar,
	},

	data() {
		return {
			timmer: null,
			activeTab: 0,
			showMore: false,
			cpuCores: 0,
			totalMemory: 0,
			barHeight: 132,
			cpuSeries: 0,
			ramSeries: 0,
			containerCpuList: [],
			containerRamList: [],
			temperatureFormat: localStorage.getItem("temperatureFormat")
				? localStorage.getItem("temperatureFormat")
				: "°C",
			orgTemperature: 0,
			power: "0W / ",
			powerList: [],
		};
	},
	watch: {
		activeTab: {
			handler(val, oldVal) {
				if (val === oldVal) {
					return;
				}
				switch (val) {
					case 0:
						this.$messageBus("widget_cpu");
						break;
					case 1:
						this.$messageBus("widget_ram");
						break;
				}
			},
		},
	},
	computed: {
		temperature() {
			const temp =
				this.temperatureFormat == "°C"
					? this.orgTemperature + "°C"
					: this.celsiusToFahrenheit(this.orgTemperature) + "°F";
			return temp;
		},
	},
	created() {
		this.cpuCores = this.$store.state.hardwareInfo.cpu.num;
		this.totalMemory = this.$store.state.hardwareInfo.mem.total;
		this.updateCharts(this.$store.state.hardwareInfo.cpu, this.$store.state.hardwareInfo.mem);
		this.getDockerUsage();
		this.timer = setInterval(() => {
			if (this.showMore) {
				this.getDockerUsage();
			}
		}, 1000);
	},
	mounted() {
		this.$smoothReflow({
			el: ".widget",
			property: ["height"],
		});
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods: {
		/**
		 * @description: Convert temperature from Celsius to Fahrenheit
		 * @param {*}
		 * @return {fahrenheit} Number
		 */
		celsiusToFahrenheit(celsius) {
			let fahrenheit = (celsius * 9) / 5 + 32;
			return fahrenheit;
		},

		changeFormat() {
			this.temperatureFormat = this.temperatureFormat == "°C" ? "°F" : "°C";
			localStorage.setItem("temperatureFormat", this.temperatureFormat);
		},
		/**
		 * @description: Update cpu and memory usage
		 * @param {*}
		 * @return {*} void
		 */
		updateCharts(cpu, mem) {
			// CPU
			this.cpuSeries = cpu.percent;
			this.pushPower(cpu.power);
			this.orgTemperature = cpu.temperature == undefined ? 0 : cpu.temperature;
			if (this.powerList.length == 2 && cpu.model === "intel") {
				this.power =
					(
						(this.powerList[1].value - this.powerList[0].value) /
						1000000 /
						(this.powerList[1].timestamp - this.powerList[0].timestamp)
					).toFixed(1) + "W / ";
			} else {
				this.power = "";
			}
			// Memory
			this.ramSeries = mem.usedPercent;
		},
		/**
		 * @description: Get Docker apps cpu and memory usage
		 * @param {*}
		 * @return {*} void
		 */
		getDockerUsage() {
			this.$api.container.getHardwareUsage().then((res) => {
				let id = 0;
				this.containerCpuList = res.data.data.map((item) => {
					let usage = 0;
					if (item.previous != null) {
						// Look at here  https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats
						const cpu_delta =
							item.data.cpu_stats.cpu_usage.total_usage - item.previous.cpu_stats.cpu_usage.total_usage;
						const system_cpu_delta =
							item.data.cpu_stats.system_cpu_usage - item.previous.cpu_stats.system_cpu_usage + 1;
						usage = Math.floor((cpu_delta / system_cpu_delta) * 1000) / 10;
					}
					id++;
					return {
						id: id,
						usage: isNaN(usage) || usage < 0 ? 0 : usage,
						icon: item.icon,
						title: item.title,
					};
				});

				this.containerRamList = res.data.data.map((item) => {
					let id = 0;
					const getCacheValue = (item) => {
						if (has(item.data.memory_stats.stats, "inactive_file")) {
							return item.data.memory_stats.stats.inactive_file;
						} else if (has(item.data.memory_stats.stats, "cache")) {
							return item.data.memory_stats.stats.cache;
						} else if (has(item.data.memory_stats.stats, "total_inactive_file")) {
							return item.data.memory_stats.stats.total_inactive_file;
						} else {
							return 0;
						}
					};
					const used_memory = "stats" in item.data.memory_stats ? item.data.memory_stats.usage - getCacheValue(item) : NaN;
					id++;
					return {
						id: id,
						usage: isNaN(used_memory) ? 0 : used_memory,
						icon: item.icon,
						title: item.title,
					};
				});
				this.containerCpuList = slice(orderBy(this.containerCpuList, ["usage"], ["desc"]), 0, 8);
				this.containerRamList = slice(orderBy(this.containerRamList, ["usage"], ["desc"]), 0, 8);
			});
		},

		/**
		 * @description: Toggle more info
		 * @param {*}
		 * @return {*} void
		 */
		showMoreInfo() {
			this.showMore = !this.showMore;
			if (this.showMore) {
				this.$messageBus("widget_systemstatus", "open");
			} else {
				this.$messageBus("widget_systemstatus", "close");
			}
		},

		pushPower(power) {
			if (this.powerList.length >= 2) {
				this.powerList.shift();
			}
			this.powerList.push(power);
		},
	},
	sockets: {
		"casaos:system:utilization"(res) {
			let data = res.Properties;
			let cpu = JSON.parse(data.sys_cpu);
			let mem = JSON.parse(data.sys_mem);
			this.updateCharts(cpu, mem);
		},
	},
};
</script>

<style lang="scss">
.widget {
	&.cpu {
		.tabs {
			ul {
				border-bottom: 1px solid transparent;

				li {
					font-size: 0.875rem;

					&:first-child {
						a {
							margin-left: 0;
						}
					}

					a {
						color: #fff !important;
						border-bottom: transparent 2px solid !important;
						padding: 0.5rem 0 0rem 0;
						margin: 0 0.5rem;
					}

					&.is-active {
						a {
							font-weight: 700;
							border-bottom: #fff 2px solid !important;
						}
					}
				}
			}
		}

		.arrow-btn {
			transition: all 0.3s;

			&.open {
				transform: rotate(90deg);
			}
		}

		.more-info {
			border-top: 1px solid rgba(255, 255, 255, 0.1);
		}
	}
}
</style>
