<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/22 下午12:18
  * @FilePath: /CasaOS-UI/src/components/Apps/ComposeConfig.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  
  -->
<!--
	warning:
	当用户自定义数据时，主应用名字为'main_app'.
	当用户 文件导入、CLI导入、yaml 导入、安装应用商店时，按照应有数据展示.
-->
<template>
	<b-tabs class="has-text-full-03">
		<template v-for="(service, key) in configData.services">
			<b-tab-item :key="key" :label="key">
				<ValidationObserver :ref="key+'valida'">
					<ValidationProvider v-slot="{ errors, valid }" name="Image" rules="required">
						<b-field :label="$t('Docker Image')+' *'" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="service.image" :placeholder="$t('e.g.,hello-world:latest')"
									 :readonly="state == 'update'" @input="changeIcon"></b-input>
						</b-field>
					</ValidationProvider>

					<b-field v-if="key === main_name" :label="$t('Icon URL')">
						<p class="control">
								<span class="button is-static container-icon">
									<b-image :key="appIcon" :src="appIcon"
											 :src-fallback="require('@/assets/img/app/default.svg')"
											 class="is-32x32" ratio="1by1"></b-image>
								</span>
						</p>
						<b-input v-model="configData['x-casaos'].icon" :placeholder="$t('Your custom icon URL')"
								 expanded></b-input>
					</b-field>

					<b-field v-if="key === main_name" label="Web UI">
						<b-select v-model="service['x-casaos'].scheme">
							<option value="http">http://</option>
							<option value="https">https://</option>
						</b-select>
						<b-input v-model="service['x-casaos'].hostname" :placeholder="baseUrl"
								 expanded></b-input>
						<b-autocomplete
							v-model="service['x-casaos'].port_map"
							:data="bridgePorts(service)"
							:open-on-focus="true"
							:placeholder="$t('Port')" class="has-colon" field="hostname"
							@select="option => (portSelected = option)"></b-autocomplete>
						<b-input v-model="service['x-casaos'].index"
								 :placeholder="'/index.html '+ $t('[Optional]')"
								 expanded></b-input>
					</b-field>


					<b-field :label="$t('Network')">
						<b-select v-model="service.network_mode" expanded placeholder="Select">
							<optgroup v-for="net in networks" :key="net.driver" :label="net.driver">
								<option v-for="(option,index) in net.networks" :key="option.name+index"
										:value="option.name">
									{{ option.name }}
								</option>
							</optgroup>
						</b-select>
					</b-field>

					<ports v-if='showPorts(service)' v-model="service.ports"
						   :showHostPost='showHostPort(service)'></ports>

					<volumes-input-group
						v-model="service.volumes" :label="$t('Volumes')"
						:message="$t('No volumes now, click “+” to add one.')" type="volume">
					</volumes-input-group>
					<env-input-group
						v-model="service.environment" :label="$t('Environment Variables')"
						:message="$t('No environment variables now, click “+” to add one.')">

					</env-input-group>
					<input-group
						v-model="service.devices" :label="$t('Devices')"
						:message="$t('No devices now, click “+” to add one.')"
						type="device">
					</input-group>
					<commands-input
						v-model="service.command" :label="$t('Container Command')"
						:message="$t('No commands now, click “+” to add one.')">
					</commands-input>

					<b-field :label="$t('Privileged')">
						<b-switch v-model="service.privileged"></b-switch>
					</b-field>

					<b-field :label="$t('Memory Limit')">
						<vue-slider :max="totalMemory"
									:min="256" :value="service.deploy.resources.reservations.memory | duplexDisplay"
									@change="v=>service.deploy.resources.reservations.memory = v"></vue-slider>
					</b-field>

					<b-field :label="$t('CPU Shares')">
						<b-select v-model="service.cpu_shares" :placeholder="$t('Select')" expanded>
							<option :value="10">{{ $t('Low') }}</option>
							<option :value="50">{{ $t('Medium') }}</option>
							<option :value="90">{{ $t('High') }}</option>
						</b-select>
					</b-field>

					<b-field :label="$t('Restart Policy')">
						<b-select v-model="service.restart" :placeholder="$t('Select')" expanded>
							<option value="on-failure">on-failure</option>
							<option value="always">always</option>
							<option value="unless-stopped">unless-stopped</option>
						</b-select>
					</b-field>

					<b-field :label="$t('Container Capabilities (cap-add)')">
						<b-taginput ref="taginput" v-model="service.cap_add" :allow-new="false"
									:data="capArray"
									:open-on-focus="false"
									autocomplete @typing="getFilteredTags">
							<template slot-scope="props">
								{{ props.option }}
							</template>
							<template #empty>
								There are no items
							</template>
							<template #portSelected="props">
								<b-tag v-for="(tag, index) in props.tags" :key="index" :tabstop="false" closable
									   @close="$refs.taginput.removeTag(index, $event)">
									{{ tag }}
								</b-tag>
							</template>
						</b-taginput>
					</b-field>

					<ValidationProvider v-slot="{ errors, valid }" name="Name" rules="rfc1123">
						<b-field :label="$t('Container Hostname')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="service.container_name" :placeholder="$t('Hostname of app container')"
									 value=""></b-input>
						</b-field>
					</ValidationProvider>

				</ValidationObserver>
			</b-tab-item>
		</template>
	</b-tabs>
</template>

<script>
import debounce from "lodash/debounce";
import axios    from "axios";

import Ajv                                      from "ajv";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";
import Ports                                    from '../forms/Ports.vue'
import EnvInputGroup                            from '../forms/EnvInputGroup.vue';
import CommandsInput                            from '../forms/CommandsInput.vue';
import InputGroup                               from '../forms/InputGroup.vue';
import VolumesInputGroup                        from "@/components/forms/VolumesInputGroup.vue";
import VueSlider                                from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import YAML                                     from "yaml";
import lowerFirst                               from "lodash/lowerFirst";
import isNil                                    from "lodash/isNil";
import find                                     from "lodash/find";
import {isNumber, isString}                     from "lodash/lang";
import cloneDeep                                from "lodash/cloneDeep";
import merge                                    from "lodash/merge";

const main_app_schema = {
	type: "object",
	properties: {
		"icon": {
			type: "string",
			default: "",
		},
		"container": {
			"index": {
				type: "string",
				default: "",
			},
			"port_map": {
				type: "string",
				default: "",
			},
		}
	}
}

const ajv = new Ajv({allErrors: true, useDefaults: true});
let main_name_x = "333";
// let xCasaOS;

const data = [
	"AUDIT_CONTROL",
	"AUDIT_READ",
	"BLOCK_SUSPEND",
	"BPF",
	"CHECKPOINT_RESTORE",
	"DAC_READ_SEARCH",
	"IPC_LOCK",
	"IPC_OWNER",
	"LEASE",
	"LINUX_IMMUTABLE",
	"MAC_ADMIN",
	"MAC_OVERRIDE",
	"NET_ADMIN",
	"NET_BROADCAST",
	"PERFMON",
	"SYS_ADMIN",
	"SYS_BOOT",
	"SYS_MODULE",
	"SYS_NICE",
	"SYS_PACCT",
	"SYS_PTRACE",
	"SYS_RAWIO",
	"SYS_RESOURCE",
	"SYS_TIME",
	"SYS_TTY_CONFIG",
	"SYSLOG",
	"WAKE_ALARM"
]

export default {
	// xCasaOS: {},
	name: "ComposeConfig.vue",
	components: {
		ValidationObserver,
		ValidationProvider,
		Ports,
		InputGroup,
		VolumesInputGroup,
		EnvInputGroup,
		CommandsInput,
		VueSlider,
	},
	data() {
		return {
			appIcon: "",
			baseUrl: "",
			portSelected: null,

			configData: {
				name: 'default_name',
				services: {
					"main_app": {
						"image": "",
						"mem_reservation": "268435456",
						"network_mode": "bridge",
						"restart": "unless-stopped",
						"volumes": [],
						"depends_on": [],
						ports: [],
						environment: [],
						devices: [],
						command: [],
						deploy: {
							resources: {
								limits: {
									// memory: "256M"
								},
								reservations: {
									memory: "256M"
								}
							}
						},
						"x-casaos": {
							hostname: '',
							scheme: 'https',
							"index": "/",
							"port_map": "3000",
							name: '',
							container_name: '',
							appstore_id: '',
							"envs": [],
							"ports": [],
							"shell": "sh",
							"volumes": []
						}
					},
				},
				"x-casaos": {
					main: 'main_app',
					"author": "",
					"category": "Developer",
					"description": {
						"en_us": ""
					},
					"developer": "",
					"icon": "",
					"screenshot_link": [],
					"tagline": {
						"en_us": ""
					},
					"thumbnail": "",
					"tips": {
						"before_install": [
							{
								"content": null,
								"en_us": ""
							}
						]
					},
					"title": {
						"en_us": ""
					},
				},
			},
		}
	},
	props: {
		state: String,
		totalMemory: {
			type: Number,
			required: true,
		},
		networks: {
			type: Array,
			required: true,
		},
		capArray: {
			type: Array,
			required: true,
		},
		dockerComposeCommands: {
			type: String,
			// required: true,
		},
	},
	watch: {
		// Watch if Icon url has changed
		"configData.icon": function (val) {
			this.updateIconUrl(val)
		},
		// Watch if configData changes
		configData: {
			handler(val, newVal) {
				console.log("watch::configData", val, newVal)
				// this.$emit('update-configData', val)
				if (this.state == 'install') {
					localStorage.setItem("app_data", JSON.stringify(val))
				}
				this.updateConfigDataCommands(val);
			},
			deep: true
		},
		dockerComposeCommands: {
			handler(val) {
				if (val != null) {
					console.log("watch::dockerComposeCommands", val)
					this.parseComposeYaml(val)
				} else {
					let gg = find(this.networks, (o) => {
						return o.driver == "bridge"
					}) || []
					this.configData.network_mode = gg.length > 0 ? gg[0].name : "bridge";
				}
			},
			immediate: true,
		},
	},
	computed: {
		main_name() {
			// 逐渐固定 x-casaos 数据格式。
			let name = this.configData["x-casaos"] && this.configData['x-casaos']['main'] || Object.keys(this.configData.services)[0]
			if (name === '') {
				name = 'main_app'
			}
			this.$emit('updateMainName', name)
			return name;
		},
	},
	created() {
		// Set Front-end base url
		this.baseUrl = `${document.domain}`;
		// this.$set(this.configData.services, [this.main_name], this.configData.services['main_app'])
		// this.$delete(this.configData.services, 'main_app')
		// this.preProcessConfigData(this.configData);

		if (this.dockerComposeCommands) {
			this.parseComposeYaml(this.dockerComposeCommands.trim());
		}
	},

	methods: {
		// ****** migration !!! start !!!
		/**
		 * @description: Get remote synchronization information
		 * @param {*} function
		 * @return {*} void
		 */
		getAsyncData: debounce(function (name) {
			if (!name.length) {
				this.data = []
				return
			}
			this.isFetching = true
			axios.get(`https://hub.docker.com/api/content/v1/products/search?source=community&q=${name}&page=1&page_size=4`)
				.then(({data}) => {
					this.data = []
					data.summaries.forEach((item) => this.data.push(item.name))
				})
				.catch((error) => {
					this.data = []
					throw error
				})
				.finally(() => {
					this.isFetching = false
				})
		}, 500),

		/**
		 * @description: Change App icon when image changed
		 * @param {String} image
		 * @return {*} void
		 */
		changeIcon(image) {
			this.main_app.icon = this.getIconFromImage(image)
		},

		/**
		 * @description:
		 * @param {*} function
		 * @return {*}
		 */
		updateIconUrl: debounce(function (string) {
			this.appIcon = string
		}, 300),

		/**
		 * @description: Get App icon form image
		 * @param {*} image
		 * @return {*}
		 */
		getIconFromImage(image) {
			if (image == "") {
				return ""
			} else {
				let appIcon = image.split(":")[0].split("/").pop();
				return `https://icon.casaos.io/main/all/${appIcon}.png`;
			}
		},

		/**
		 * @description:
		 * @param {*} text
		 * @return {*}
		 */
		getFilteredTags(text) {
			return data.filter((option) => {
				return option
					.toString()
					.indexOf(text.toUpperCase()) >= 0
			})
		},

		async checkStepItem(ref) {
			let isValid = await ref.validate()
			return isValid
		},

		/**
		 * @description: Validate form async
		 * @param {Object} ref ref of component
		 * @return {Boolean}
		 */
		async checkStep() {
			const promises = [];
			for (const servicesKey in this.configData.services) {
				// console.log('this', this);
				// console.log('this.configData', this.configData);
				// console.log('servicesKey', servicesKey);
				// console.log('this.$refs[servicesKey]', this.$refs[servicesKey + 'valida']);

				promises.push(this.$refs[servicesKey + 'valida'][0].validate());
			}
			return await Promise.all(promises);
			// console.log('this.$refs.main_app', this.$refs.main_app);
			// return await this.$refs.main_app.validate();
		},

		/**
		 * @description: Parse Import Docker Compose Commands
		 * @return {Boolean}
		 */
		parseComposeYaml(val) {
			try {
				const yaml = YAML.parse(val)
				console.log('检测传入的 yaml 文件', yaml);
				console.log('检测传入的 yaml 文件的 services', yaml.services);
				console.log('检测传入的 yaml 文件的 main_app name', yaml['x-casaos']['main']);

				// if (yaml.version === undefined) {
				// 	return false
				// }

				// 其他配置
				this.volumes = yaml.volumes || {}

				// 导入数据不一定含有 x-casaos，但一定含有 services
				// yaml['x-casaos'] 数据类型是 object
				// 确定： yaml ：： service[0 ] 此为最原始数据源
				// update configData :: x-casaos[main_app] ~ 解析 yaml 的 main_app
				this.configData['x-casaos']['main'] = yaml['x-casaos'] && yaml['x-casaos']['main'] || Object.keys(yaml.services)[0];
				console.log('检测 x-casaos :: main_app 是否正确', this.configData['x-casaos']['main']);
				console.log('检测 main_name 是否正确', this.main_name);

				// ### start  ### everyone support x-casaos in all services.
				// 导入数据main-app 中不一定含有 x-casaos，
				// let yaml_main_app = yaml.services[this.main_name]['x-casaos'] || {};
				// this.main_app = Object.assign(this.main_app, main_app)
				// this.main_app.icon = yaml_main_app.icon || '';
				// let container = yaml_main_app.container || {};
				// this.main_app.container.hostname = container.hostname || '';
				// this.main_app.container.protocol = container.protocol || 'https';
				// this.main_app.container.index = container.index || '';
				// this.main_app.container.port_map = container.port_map || '';
				// this.main_app.container.host_name = container.host_name || '';
				// this.main_app.container.container_name = container.container_name || '';
				// this.main_app.container.appstore_id = container.appstore_id || '';
				// console.log('检测主应用中的 x-casaos 完成本地赋值', this.main_app);
				// 将主应用的x-casaos 暂存到 xCasaOS中，等返回数据时，添加上。
				// yaml.services[this.main_name]['x-casaos'] && (this.xCasaOS = yaml.services[this.main_name]['x-casaos']);
				// ### end

				// set main app name
				this.configData.name = yaml.name
				// 解析 services，并将其赋值到 configData.services中。
				for (const yamlKey in yaml.services) {
					this.$set(this.configData.services, yamlKey, this.parseCompseItem(yaml.services[yamlKey]))
				}
				// 删除掉原默认主应用。
				this.$delete(this.configData.services, 'main_app')

				// 补全必要数据。
				this.preProcessConfigData(this.configData)

				// set top level x-casaos data
				this.configData['x-casaos'] = merge(this.configData['x-casaos'], yaml['x-casaos'] || {})

				// return true
			} catch (error) {
				console.log(error);
				// return false
			}
		},

		/*
		* formate for render
		* */
		parseCompseItem(composeServicesItemInput) {
			// const parsedInput = Object.values(yaml.services)[0]
			let composeServicesItem = {};
			// Image
			composeServicesItem.image = composeServicesItemInput.image
			// Label
			// if (parsedInput.container_name != undefined) {
			// 	configData.label = upperFirst(parsedInput.container_name)
			// } else {
			// 	const imageArray = parsedInput.image.split("/")
			// 	const lastNode = [...imageArray].pop()
			// 	configData.label = upperFirst(lastNode.split(":")[0])
			// }
			// Envs
			if (composeServicesItemInput.environment) {
				let envArray = Array.isArray(composeServicesItemInput.environment) ? composeServicesItemInput.environment : Object.entries(composeServicesItemInput.environment)
				composeServicesItem.environment = envArray.map(item => {
					let ii = typeof item === "object" ? Array.from(item) : item.split("=");
					return {
						host: ii[1].replace(/"/g, ""),
						container: ii[0]
					}
				})
			} else {
				composeServicesItem.environment = []
			}


			//Ports
			// 建议 - 仅处理数组格式！！！
			// 已支持对象格式。
			/*
			- "3000"
			- "3000-3005"
			- "8000:8000"
			- "9090-9091:8080-8081"
			- "49100:22"
			- "127.0.0.1:8001:8001"
			- "127.0.0.1:5000-5010:5000-5010"
			- "127.0.0.1:5000-5010:5000-5010/udp"
			- "6060:6060/udp"
			*/
			// ["3000-3005", "8000:8000", "9090-9091:8080-8081", "49100:22", "127.0.0.1:8001:8001", "127.0.0.1:5000-5010:5000-5010","6060:6060/udp"]
			composeServicesItem.ports = this.makeArray(composeServicesItemInput.ports).map(item => {
				if (isString(item)) {
					// let pArray = item.split(":")
					// let endArray = pArray[1].split("/")
					// let protocol = (endArray[1]) ? endArray[1] : 'tcp';
					// return {
					// 	target: endArray[0],
					// 	published: pArray[0],
					// 	protocol: protocol
					// }

					/*const parts = item.split(':');
					const pArray = parts[0].split('-');
					const endArray = parts.length > 2 ? parts.slice(1, 3) : [pArray[0]];
					const protocol = parts.length > 2 ? parts[2].split('/')[1] : 'tcp';

					const published = parts.length > 1 ? parts.slice(0, 2).join(':') : pArray[0];*/

					// 修正：
					const regex = /(^([\d\.]+):)?(\d+(-\d+)?)(:(\d+(-\d+)?))?(\/(.*)$)?/;
					const match = item.match(regex);
					const host_ip = match[2];
					const target = match[3];
					const published = match[6];
					const protocol = match[9];

					return {
						host_ip,
						target,
						published,
						protocol,
					};
				} else {
					return item
				}

			})

			//Volume
			// - 仅支持bind 模式!!!
			// https://yeasy.gitbook.io/docker_practice/compose/compose_file#volumes
			composeServicesItem.volumes = this.makeArray(composeServicesItemInput.volumes).map(item => {
				if (isString(item)) {
					// 1\ replace variable in string for example: ${VOLUME_PATH}:/data
					// this.volumes 可能为空。
					Object.keys(
						(this.volumes || {})
					).map((key) => {
						item = item.replace(key, this.volumes[key]);
					})
					// 2\ split string
					let ii = item.split(":");
					if (ii.length > 1) {
						return {
							type: 'bind',
							target: ii[1],
							source: this.volumeAutoCheck(ii[1], ii[0], lowerFirst(composeServicesItem.label))
						}
					} else {
						return {
							type: 'bind',
							target: ii[0],
							source: this.volumeAutoCheck(ii[0], "", lowerFirst(composeServicesItem.label)),
						}
					}
				} else if (item) {
					// 1\ replace value in object for example: {type: 'bind', source: '${VOLUME_PATH}', target: '/data'}
					Object.keys(
						(this.volumes || {})
					).map((key) => {
						item.source = item.source && item.source.replace(key, (this.volumes[key] || ""));
						item.target = item.target && item.target.replace(key, (this.volumes[key] || ""));
					})

					// q: what's source and target?
					// a: https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes
					return item;
				}

			})

			// Devices
			composeServicesItem.devices = this.makeArray(composeServicesItemInput.device).map(item => {
				let ii = item.split(":");
				return {
					container: ii[1],
					host: ii[0]
				}
			})

			//Network
			let pnetwork = (composeServicesItemInput.network_mode != undefined) ? composeServicesItemInput.network_mode : (composeServicesItemInput.network != undefined) ? composeServicesItemInput.network[0] : undefined
			if (pnetwork != undefined) {
				let network = (pnetwork == 'physical') ? 'macvlan' : pnetwork;
				let seletNetworks = this.networks.filter(item => {
					if (item.driver == network) {
						return true
					}
				})
				if (seletNetworks.length > 0) {
					composeServicesItem.network_mode = seletNetworks[0].networks[0].name;
				} else {
					composeServicesItem.network_mode = composeServicesItemInput.network_mode;
				}
			} else {
				composeServicesItem.network_mode = 'bridge';
			}

			//hostname
			// configData.host_name = parsedInput.hostname != undefined ? parsedInput.hostname : ""
			// privileged
			composeServicesItem.privileged = composeServicesItemInput.privileged != undefined

			//cap-add
			if (composeServicesItemInput.cap_add != undefined) {
				composeServicesItem.cap_add = composeServicesItemInput.cap_add
			}
			//Restart
			if (composeServicesItemInput.restart != undefined) {
				composeServicesItem.restart = composeServicesItemInput.restart
			}

			// command
			if (composeServicesItemInput.command != undefined) {
				composeServicesItem.command = composeServicesItemInput.command;
			} else {
				composeServicesItem.command = [];
			}

			if (composeServicesItemInput.cpu_shares === 0 || composeServicesItemInput.cpu_shares > 99 || isNil(composeServicesItemInput.cpu_shares)) {
				this.$set(composeServicesItem, "cpu_shares", 90)
			} else {
				this.$set(composeServicesItem, "cpu_shares", composeServicesItemInput.cpu_shares)
			}

			// 赋 默认值
			composeServicesItem.deploy = {
				resources: {
					reservations: {
						memory: this.totalMemory
					},
				}
			}

			// process Item x-casaos
			// 判断是否存在 x-casaos
			composeServicesItemInput['x-casaos'] = composeServicesItemInput['x-casaos'] || {};
			// configData['x-casaos'] = Object.assign({
			// 	// ...this.configData['x-casaos'],
			// 	container: {
			// 		hostname: '',
			// 		scheme: 'http',
			// 		index: '',
			// 		port_map: '',
			// 		host_name: '',
			// 		container_name: '',
			// 		appstore_id: '',
			// 	},
			// 	icon: '',
			// }, parsedInput['x-casaos'] || {});
			composeServicesItem['x-casaos'] = merge({
				// ...this.configData['x-casaos'],
				hostname: '',
				scheme: 'http',
				index: '',
				port_map: '',
				host_name: '',
				container_name: '',
				appstore_id: '',
			}, composeServicesItemInput['x-casaos'] || {});

			return composeServicesItem
		},

		volumeAutoCheck(containerPath, hostPath, appName) {
			let finalHostPath = hostPath
			const rootDir = "/DATA"
			const checkArray = [
				{
					keywords: ["config"],
					value: `/AppData/${appName}${containerPath}`
				},
				{
					keywords: ["tvshows", "TV", "tv"],
					value: `/Media/TV Shows`
				},
				{
					keywords: ["movies", "Movie", "movie"],
					value: `/Media/Movies`
				},
				{
					keywords: ["Music", "music"],
					value: `/Media/Music`
				},
				{
					keywords: ["download"],
					value: `/Downloads`
				},
				{
					keywords: ["pictures", "photo"],
					value: `/Gallery`
				},
				{
					keywords: ["media"],
					value: `/Media`
				}

			]

			checkArray.forEach(item => {
				if (item.keywords.some(keywordsItem => {
					return containerPath.includes(keywordsItem)
				})) {
					finalHostPath = rootDir + item.value

				}
			})

			return finalHostPath
		},

		makeArray(foo) {
			const newArray = (typeof (foo) == "string") ? [foo] : foo
			return (newArray == undefined) ? [] : newArray
		},

		// 给 configData 添加默认值
		preProcessConfigData(data) {
			// let data = this.configData
			// data.port_map = data.port_map === "" ? null : data.port_map
			// data.icon = data.icon === "" ? this.getIconFromImage(data.image) : data.icon
			isNil(data.volumes) ? this.volumes = data.volumes : data.volumes;
			for (const appKey in data.services) {
				// data.services[app] = this.preProcessConfigDataItem(data.services[app])
				// this.$set(data.services, app, this.preProcessConfigDataItem(data.services[app]))
				this.preProcessConfigDataItem(data.services[appKey])
			}
		},

		/**
		 * @description: Pre-processed data before setting
		 * @param {ConfigObject} data
		 * @return {ConfigObject} data
		 */
		// TODO 合并到 yaml
		preProcessConfigDataItem(app) {
			// let app = this.configData.services[app]
			isNil(app.environment) && this.$set(app, "environment", [])
			// app.ports = isNil(app.ports) ? [] : app.ports
			isNil(app.ports) && this.$set(app, "ports", [])
			isNil(app.volumes) && this.$set(app, "volumes", [])
			isNil(app.devices) && this.$set(app, "devices", [])
			// network
			app.network_mode = app.network_mode === "default" ? "bridge" : app.network_mode
			// privileged
			isNil(app.cap_add) && this.$set(app, "cap_add", [])
			// cap_add
			// restart
			app.restart = app.restart === "no" ? "unless-stopped" : app.restart
			// isNil(app.command) && this.$set(app, "command", [])
			// if (app.cpu_shares === 0 || app.cpu_shares > 99 || isNil(app.cpu_shares)) {
			// 	this.$set(app, "cpu_shares", 90)
			// } else {
			// 	this.$set(app, "cpu_shares", app.cpu_shares)
			// }
			// app.memory = app.memory === 0 ? this.totalMemory : (app.memory / 1048576).toFixed(0)
			// isNil(app.memory) && this.$set(app, "memory", this.totalMemory)
			// 赋 默认值
			// app.deploy = {
			// 	resources: {
			// 		reservations: {
			// 			memory: this.totalMemory
			// 		},
			// 	}
			// }


			return app
		},

		/**
		 * @description: Process the datas before submit
		 * @param {*}
		 * @return {*} void
		 */
		/*processData() {
			this.initConfigData.cpu_shares = Number(this.initConfigData.cpu_shares)
			let model = this.initConfigData.network_mode.split("-");
			this.initConfigData.network_mode = model[0]
		},*/

		// ****** migration !!! end !!!

		/*
		* follow this.configData
		* var : this.configData
		* */
		updateConfigDataCommands(val) {
			// configData tans to docker-compose.yml
			let ConfigData = cloneDeep(val)
			for (const servicesKey in val.services) {
				// 数据源
				let service = val.services[servicesKey]
				// 输出结果
				let outputService = ConfigData.services[servicesKey]
				// outputService.memory = service.memory + 'm';
				outputService.deploy.resources.reservations.memory = service.deploy.resources.reservations.memory + 'm';
				outputService.devices = service.devices.map(device => {
					return `${device.host}:${device.container}`
				})
				outputService.environment = service.environment.map(env => {
					return `${env.host}=${env.container}`
				})
				// outputService.volumes = service.volumes.map(volume => {
				// 	return `${volume.source}:${volume.target}`
				// })
				// TODO: port
				/* outputService.ports = service.ports.map(port => {
					 return `${port.published}:${port.target}`
				 })*/
			}
			console.log("updateConfigDataCommands :: ConfigData", ConfigData)
			// ConfigData.services[this.main_name]['x-casaos'] = Object.assign(this.xCasaOS, this.main_app)
			this.$emit('updateDockerComposeCommands', YAML.stringify(ConfigData));
		},

		showPorts(service) {
			if (!service.network_mode) {
				return false
			}
			// 存在
			if (service.network_mode.toLowerCase().indexOf("macvlan") > -1 || service.network_mode.indexOf("host") > -1) {
				return false
			} else {
				return true
			}
		},
		showHostPort(service) {
			if (!service.network_mode) {
				return true
			}
			// 存在
			if (service.network_mode.indexOf("host") > -1) {
				return false
			} else {
				return true
			}
		},
		bridgePorts(service) {
			/* TODO 当services.ports输入数据为
				 - "3000"
				 - "3000-3005"
				 - "127.0.0.1:8001"
				 - "127.0.0.1:5000-5010"
			 */

			let published, result = [];

			service.ports.map(function (item) {
				const TEMPORARY_PORT_INFORMATION = item.published.split(":");
				if (TEMPORARY_PORT_INFORMATION.length > 1) {
					published = TEMPORARY_PORT_INFORMATION[1];
				} else {
					published = TEMPORARY_PORT_INFORMATION[0];
				}
				published = published.split("-");

				if (published.length > 1) {
					let start = published[0];
					let end = published[1];
					for (let i = start; i <= end; i++) {
						result.push(i);
					}
				} else {
					result.push(published[0])
				}
			})
			return result
		},
		// unused
		filteredBeidgePort(service) {
			return this.bridgePorts(service).filter(port => {
				return port.host.indexOf(service.port_map) >= 0
			})
		},
	},
	filters: {
		duplexDisplay(val) {
			return isNumber(val) && val || val.replace(/[Mm]/, '')
		},
	}
}
</script>

<style scoped>

</style>