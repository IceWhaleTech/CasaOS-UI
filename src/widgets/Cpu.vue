<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/12 下午5:21
  * @FilePath: /CasaOS-UI/src/widgets/Cpu.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="widget has-text-white cpu">
		<div class="blur-background"></div>
		<div class="widget-content  pb-1">
			<!-- Header Start -->
			<div class="widget-header is-flex">
				<div class="widget-title is-flex-grow-1">
					{{ $t('System Status') }}
				</div>
				<div class="widget-icon-button is-flex-shrink-0" @click="showMoreInfo">
					<b-icon :class="{'open':showMore}" class="arrow-btn" icon="right" pack="casa" size="is-20"></b-icon>
				</div>
			</div>
			<!-- Header End -->

			<div class="columns is-mobile mt-0 ">

				<div class="column is-half has-text-centered">
					<radial-bar :extendContent="power+temperature" :percent="parseInt(cpuSeries)" label="CPU"></radial-bar>
				</div>
				<div class="column is-half has-text-centered">
					<radial-bar :extendContent="renderSize(totalMemory)" :percent="parseInt(ramSeries)" label="RAM"></radial-bar>
				</div>
			</div>
			<div v-if="showMore">
				<div class="more-info pt-1 pb-1">
					<b-tabs v-model="activeTab">
						<b-tab-item label="CPU">
							<div v-for="(item,index) in containerCpuList" :key="item.title+index+'-cpu'">
								<div v-if="!isNaN(item.usage)" class="is-flex is-size-7 is-align-items-center mb-2">
									<div class="is-flex-grow-1 is-flex is-align-items-center">
										<b-image :lazy="false" :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')"
										         class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
										<span class="one-line">{{ item.title }}</span>
									</div>
									<div class=" is-flex-shrink-0">{{ item.usage }}%</div>
								</div>
							</div>
						</b-tab-item>

						<b-tab-item label="RAM">
							<div v-for="(item,index) in containerRamList" :key="item.title+index+'-rem'">
								<div v-if="!isNaN(item.usage) && renderSize(item.usage).split(' ')[0] != 0"
								     class="is-flex is-size-7 is-align-items-center mb-2">
									<div class="is-flex-grow-1 is-flex is-align-items-center">
										<b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')"
										         class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
										<span class="one-line">{{ item.title }}</span>
									</div>
									<div class=" is-flex-shrink-0">{{ item.usage | renderSize }}</div>
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
import smoothReflow from 'vue-smooth-reflow'
import orderBy from 'lodash/orderBy';
import has from 'lodash/has';
import slice from 'lodash/slice';
import {mixin} from '../mixins/mixin';
import RadialBar from '@/components/widgets/RadialBar.vue';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'cpu',
	icon: "cog",
	title: "System Status",
	initShow: true,
	mixins: [smoothReflow, mixin],
	components: {
		RadialBar
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
			temperature: "0°C",
			power: '0W / ',
			powerList: [],
		}
	},
	created() {
		this.cpuCores = this.$store.state.hardwareInfo.cpu.num
		this.totalMemory = this.$store.state.hardwareInfo.mem.total
		this.updateCharts(this.$store.state.hardwareInfo)
		this.getDockerUsage()
		this.timer = setInterval(() => {
			if (this.showMore) {
				this.getDockerUsage()
			}
		}, 1000)
	},
	mounted() {
		this.$smoothReflow({
			el: '.widget',
			property: ['height'],
		})
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods: {
		/**
		 * @description: Update cpu and memory usage
		 * @param {*}
		 * @return {*} void
		 */
		updateCharts(hardwareInfo) {
			this.cpuSeries = hardwareInfo.cpu.percent
			this.ramSeries = hardwareInfo.mem.usedPercent
			this.pushPower(hardwareInfo.cpu.power)
			this.temperature = hardwareInfo.cpu.temperature == undefined ? "0°C" : hardwareInfo.cpu.temperature + "°C"
			if (this.showMore) {
				this.getDockerUsage()
			}
		},
		/**
		 * @description: Get Docker apps cpu and memory usage
		 * @param {*}
		 * @return {*} void
		 */
		getDockerUsage() {
			this.$api.container.getHardwareUsage().then(res => {
				let id = 0
				this.containerCpuList = res.data.data.map(item => {
					let usage = 0;
					if (item.previous == null) {
						usage = 0;
					} else {

						// Look at here  https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats

						const cpu_delta = item.data.cpu_stats.cpu_usage.total_usage - item.previous.cpu_stats.cpu_usage.total_usage
						const system_cpu_delta = item.data.cpu_stats.system_cpu_usage - item.previous.cpu_stats.system_cpu_usage + 1
						// const number_cpus = item.data.cpu_stats.online_cpus
						usage = Math.floor((cpu_delta / system_cpu_delta) * 1000) / 10
					}
					id++
					return {
						id: id,
						usage: isNaN(usage) || (usage < 0) ? 0 : usage,
						icon: item.icon,
						title: item.title
					};
				})

				this.containerRamList = res.data.data.map(item => {
					let cache = 0
					let id = 0
					if (has(item.data.memory_stats.stats, 'inactive_file')) {
						cache = item.data.memory_stats.stats.inactive_file
					} else {
						if (has(item.data.memory_stats.stats, 'cache')) {
							cache = item.data.memory_stats.stats.cache
						} else if (has(item.data.memory_stats.stats, 'total_inactive_file')) {
							cache = item.data.memory_stats.stats.total_inactive_file
						}
					}
					const used_memory = ("stats" in item.data.memory_stats) ? (item.data.memory_stats.usage - cache) : NaN
					id++
					return {
						id: id,
						usage: isNaN(used_memory) ? 0 : used_memory,
						icon: item.icon,
						title: item.title
					};
				})
				this.containerCpuList = slice(orderBy(this.containerCpuList, ['usage'], ['desc']), 0, 8)
				this.containerRamList = slice(orderBy(this.containerRamList, ['usage'], ['desc']), 0, 8)
			})
		},

		/**
		 * @description: Toggle more info
		 * @param {*}
		 * @return {*} void
		 */
		showMoreInfo() {
			this.showMore = !this.showMore;
		},

		pushPower(power) {
			if (this.powerList.length >= 2) {
				this.powerList.shift()
			}
			this.powerList.push(power)
		}
	},
	sockets: {
		sys_hardware_status(data) {
			// CPU
			this.cpuCores = data.sys_cpu.num
			this.cpuSeries = data.sys_cpu.percent
			this.pushPower(data.sys_cpu.power)
			this.temperature = data.sys_cpu.temperature == undefined ? "0°C" : data.sys_cpu.temperature + "°C"
			if (this.powerList.length == 2 && data.sys_cpu.model === 'intel') {
				this.power = ((this.powerList[1].value - this.powerList[0].value) / 1000000 / (this.powerList[1].timestamp - this.powerList[0].timestamp)).toFixed(1) + "W / "
			} else {
				this.power = ''
			}

			// Memory
			this.totalMemory = data.sys_mem.total
			this.ramSeries = data.sys_mem.usedPercent
		}
	}
}
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
