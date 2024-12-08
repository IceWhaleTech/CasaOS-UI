<template>
	<div class="widget has-text-white clock is-relative">
		<div class="blur-background"></div>

		<div class="network widget-content">
			<!-- Header Start -->
			<div class="widget-header is-flex mr-0">
				<div class="widget-title is-flex-grow-1">
					{{ $t('Network Status') }}
				</div>
				<div class="is-flex-shrink-0">
					<b-dropdown v-if="initNetwork.length > 0" v-model="networkId" :mobile-modal="false" animation="fade1"
						aria-role="list" class="netowrk-dropdown" position="is-bottom-left">
						<template #trigger="{ active }">
							<b-button :icon-right="active ? 'up-outline' : 'down-outline'"
								:label="initNetwork[networkId].name" icon-pack="casa" type="is-primary" />
						</template>
						<b-dropdown-item v-for="(item, index) in initNetwork" :key="'net' + index" :value="index"
							aria-role="listitem">
							{{ item.name }}
						</b-dropdown-item>
					</b-dropdown>
				</div>
			</div>
			<!-- Header End -->
			<!-- Chart Start -->
			<div class="chart-container">
				<vue-apex-charts ref="chart" :options="chartOptions" :series="networks[networkId]" height="130"
					type="area" />
			</div>
			<!-- Chart End -->
			<!-- Status Start -->
			<div class="is-flex ">
				<div class=" is-flex-shrink-0 is-size-65 is-flex is-align-items-center has-text-grey-100">
					<div>
						<b-icon class="up" icon="up-arrow" pack="casa" size="is-small">
						</b-icon>
						{{ currentUpSpeed * 1024 | renderSize }}/s
						<b-icon class="down ml-2" icon="down-arrow" pack="casa" size="is-small">
						</b-icon>
						{{ currentDownSpeed * 1024 | renderSize }}/s
					</div>
				</div>
			</div>
			<!-- Status End -->
		</div>
	</div>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
import { mixin } from '@/mixins/mixin';

export default {
	mixins: [mixin],
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'network',
	icon: "network-outline",
	title: "Network Status",
	initShow: true,
	components: {
		VueApexCharts: () => import("vue-apexcharts")
	},
	data() {
		return {
			initNetwork: [],
			networkId: 0,
			networks: [],
			currentUpSpeed: 0,
			currentDownSpeed: 0,
			chartOptions: {
				chart: {
					offsetX: -5,
					offsetY: -10,
					zoom: {
						enabled: false,
					},
					toolbar: {
						show: false,
					},
					stacked: false,
					animations: {
						enabled: false,
					},
				},

				markers: {
					size: 0,
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: 'smooth',
					width: 1,
				},
				grid: {
					xaxis: {
						lines: {
							show: false,
						},
					},
					yaxis: {
						lines: {
							show: true
						}
					},
				},
				tooltip: {
					enabled: false,
				},
				xaxis: {
					type: 'numeric',
					range: 60,
					labels: {
						show: false,
					},
					tooltip: {
						enabled: false
					},
					axisBorder: {
						show: false,
					}
				},
				yaxis: {
					labels: {
						show: true,
						rotate: 0,
						rotateAlways: false,
						hideOverlappingLabels: true,
						showDuplicates: false,
						trim: false,
						minHeight: undefined,
						maxHeight: 120,
						style: {
							colors: '#ffffff',
							fontSize: '10px',
							fontWeight: 400,
							cssClass: 'apexcharts-xaxis-label',
						},
						offsetX: 0,
						offsetY: 0,
						format: undefined,
						formatter: undefined,
						datetimeUTC: true,
					},
				},
				legend: {
					show: false,
					position: 'top',
					horizontalAlign: 'left'
				}
			},
		}
	},
	created() {
		this.initNetwork = this.$store.state.hardwareInfo.net

		// select the network last time
		localStorage.getItem('networkId') && (this.networkId = localStorage.getItem('networkId'))

	},

	watch: {
		networkId(val, oldVal) {
			if (val !== oldVal) {
				localStorage.setItem('networkId', val)
			}
		}
	},

	methods: {
		buildDatas(data) {
			if (data.length == 0) {
				return
			}
			data.forEach((el, index) => {
				if (this.networks[index] === undefined) {
					this.networks[index] = [
						{
							name: 'Up',
							data: ["0"],
							cacheData: 0,
							cacheTime: 0
						},
						{
							name: 'Down',
							data: ["0"],
							cacheData: 0,
							cacheTime: 0
						}
					]
				}
				// Send Data
				if (this.networks[index][0].data.length >= 60) {
					this.networks[index][0].data.shift()
				}
				if (this.networks[index][0].cacheData > 0) {
					const timeGap = this.networks[index][0].cacheTime == 0 ? 2 : el.time - this.networks[index][0].cacheTime
					this.networks[index][0].data.push(this.covertToKB((el.bytesSent - this.networks[index][0].cacheData) / timeGap))
				}
				this.networks[index][0].cacheData = el.bytesSent;
				this.networks[index][0].cacheTime = el.time;

				// RecvData
				if (this.networks[index][1].data.length >= 60) {
					this.networks[index][1].data.shift()
				}
				if (this.networks[index][1].cacheData > 0) {
					const timeGap = this.networks[index][1].cacheTime == 0 ? 2 : el.time - this.networks[index][1].cacheTime
					this.networks[index][1].data.push(this.covertToKB((el.bytesRecv - this.networks[index][1].cacheData) / timeGap))
				}
				this.networks[index][1].cacheData = el.bytesRecv;
				this.networks[index][1].cacheTime = el.time;
			});
			this.networkId = this.networkId > this.networks.length - 1 ? 0 : this.networkId
			this.$refs.chart?.updateSeries(this.networks[this.networkId])
			if (this.networks) {
				const upSpeed = this.networks[this.networkId][0].data[this.networks[this.networkId][0].data.length - 1]
				const downSpeed = this.networks[this.networkId][1].data[this.networks[this.networkId][1].data.length - 1]
				this.currentUpSpeed = isNaN(upSpeed) ? 0 : upSpeed
				this.currentDownSpeed = isNaN(downSpeed) ? 0 : downSpeed
			}
		},
		covertToKB(bytes) {
			return (bytes / 1024).toFixed(0) > 0 ? (bytes / 1024).toFixed(0) : 0;
		}
	},
	sockets: {
		// sys_net(data) {
		// 	this.initNetwork = data.data
		// 	this.buildDatas(this.initNetwork)
		// },
		"casaos:system:utilization"(res) {
			let data = res.Properties
			this.initNetwork = JSON.parse(data.sys_net)
			this.buildDatas(this.initNetwork)
		}
	}
}
</script>

<style lang="scss" scoped>
.network {
	position: relative;
	z-index: 10;

	.up {
		color: rgb(0, 143, 251);
	}

	.down {
		color: rgb(0, 227, 150);
	}

	.chart-container {
		height: 130px;
		overflow: hidden;
		margin: 0 -0.875rem;
	}
}
</style>

<style lang="scss">
.up.is-small,
.down.is-small {
	.mdi {
		font-size: 1rem;
	}
}

.network {
	.netowrk-dropdown {
		.button {
			margin: 0;
			padding: 0;
			height: initial;
			background-color: transparent;
			font-weight: bold;
			font-size: 0.875rem;
			position: relative;
			z-index: 200;
			outline: none;
			border: 0;
			color: $grey-100;

			&:focus:not(:active) {
				box-shadow: 0 0 0 0 !important;
			}

			&:hover,
			&:active {
				outline: none;
				background-color: transparent;
			}

			span {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				max-width: 5rem;
			}

			.icon {
				font-size: 1.25rem !important;
				height: 1.5rem;
				line-height: 1.5rem;
				color: $grey-100;

				&:last-child:not(:first-child) {
					margin-right: 0;
				}
			}
		}

		.dropdown-menu {
			min-width: 5rem;

			.dropdown-content {
				max-width: 7rem;
				border-radius: 10px;
				padding: 4px !important;
				background: rgba(0, 0, 0, 0.8);
				backdrop-filter: blur(1rem);

				.dropdown-divider {
					margin: 4px;
				}

				.dropdown-item {
					padding: 0.25rem 0.5rem 0.25rem 0.5rem;
					border-radius: 5px;
					transition: all 0.25s;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #fff;
					font-size: 0.75rem;
					margin-bottom: 0.25rem;

					&:last-child {
						margin-bottom: 0;
					}

					&:hover {
						background: rgba(0, 0, 0, 0.2) !important;
					}

					&.is-active {
						background: rgba(0, 0, 0, 0.2) !important;
					}
				}
			}
		}
	}
}
</style>