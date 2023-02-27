<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/22 下午12:18
  * @FilePath: /CasaOS-UI/src/components/Apps/ComposeConfig.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  
  -->
<template>
	<b-tabs>
		<template v-for="(service, key) in configData.services">
			<b-tab-item :key="key" :label="key">
				<ValidationObserver ref="ob1">
					
					<ValidationProvider v-slot="{ errors, valid }" name="Image" rules="required">
						<b-field :label="$t('Docker Image')+' *'" :message="$t(errors)"
						         :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="service.image" :placeholder="$t('e.g.,hello-world:latest')"
							         :readonly="state == 'update'" @input="changeIcon"></b-input>
							<!-- <b-autocomplete :data="data" placeholder="e.g. hello-world:latest" field="image" :loading="isFetching" @typing="getAsyncData" @select="option => portSelected = option" v-model="service.image" :readonly="state == 'update'"></b-autocomplete> -->
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Name" rules="required">
						<b-field :label="$t('App name')+' *'" :message="errors"
						         :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<!--				<b-input v-model="service.label" :placeholder="$t('Your custom App Name')" maxlength="40"></b-input>-->
							<b-input v-model="service.name" :placeholder="$t('Your custom App Name')"
							         maxlength="40"></b-input>
						</b-field>
					</ValidationProvider>
					<b-field :label="$t('Icon URL')">
						<p class="control">
				<span class="button is-static container-icon">
					<b-image :key="appIcon" :src="appIcon"
					         :src-fallback="require('@/assets/img/app/default.svg')"
					         class="is-32x32" ratio="1by1"></b-image>
				</span>
						</p>
						<b-input v-model="configData.icon" :placeholder="$t('Your custom icon URL')"
						         expanded></b-input>
					</b-field>
					
					<b-field label="Web UI">
						<!-- <p class="control">
						  <span class="button is-static">{{baseUrl}}</span>
						</p> -->
						<b-select v-model="configData.protocol">
							<option value="http">http://</option>
							<option value="https">https://</option>
						</b-select>
						<b-input v-model="configData.host" :placeholder="baseUrl" expanded></b-input>
						<b-autocomplete v-model="configData.port_map" :data="bridgePorts" :open-on-focus="true"
						                :placeholder="$t('Port')" class="has-colon" field="host"
						                @select="option => (portSelected = option)"></b-autocomplete>
						<b-input v-model="configData.index" :placeholder="'/index.html '+ $t('[Optional]')"
						         expanded></b-input>
					</b-field>
					
					
					<template v-if="isCasa">
						
						<b-field :label="$t('Network')">
							<b-select v-model="service.network_model" expanded placeholder="Select">
								<optgroup v-for="net in networks" :key="net.driver" :label="net.driver">
									<option v-for="(option,index) in net.networks" :key="option.name+index"
									        :value="option.name">
										{{ option.name }}
									</option>
								</optgroup>
							</b-select>
						</b-field>
						
						<ports v-if="showPorts" v-model="service.ports" :showHostPost="showHostPort"></ports>
						<input-group v-model="service.volumes" :label="$t('Volumes')"
						             :message="$t('No volumes now, click “+” to add one.')"
						             type="volume"></input-group>
						<env-input-group v-model="service.envs" :label="$t('Environment Variables')"
						                 :message="$t('No environment variables now, click “+” to add one.')"></env-input-group>
						<input-group v-model="service.devices" :label="$t('Devices')"
						             :message="$t('No devices now, click “+” to add one.')"
						             type="device"></input-group>
						<commands-input v-model="service.cmd" :label="$t('Container Command')"
						                :message="$t('No commands now, click “+” to add one.')"></commands-input>
						
						<b-field :label="$t('Privileged')">
							<b-switch v-model="service.privileged"></b-switch>
						</b-field>
						
						<b-field :label="$t('Memory Limit')">
							<vue-slider v-model="service.memory" :max="totalMemory" :min="256"></vue-slider>
						</b-field>
						
						<b-field :label="$t('CPU Shares')">
							<b-select v-model="service.cpu_shares" :placeholder="$t('Select')" expanded>
								<option value="10">{{ $t('Low') }}</option>
								<option value="50">{{ $t('Medium') }}</option>
								<option value="90">{{ $t('High') }}</option>
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
								<b-input v-model="service.host_name" :placeholder="$t('Hostname of app container')"
								         value=""></b-input>
							</b-field>
						</ValidationProvider>
						
						<b-field :label="$t('App Description')">
							<b-input v-model="service.description"></b-input>
						</b-field>
					</template>
				
				</ValidationObserver>
			</b-tab-item>
		</template>
	</b-tabs>
</template>

<script>
import debounce from "lodash/debounce";
import axios from "axios";

import Ajv from "ajv";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import Ports from '../forms/Ports.vue'
import EnvInputGroup from '../forms/EnvInputGroup.vue';
import CommandsInput from '../forms/CommandsInput.vue';
import InputGroup from '../forms/InputGroup.vue';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import YAML from "yamljs";
import upperFirst from "lodash/upperFirst";
import lowerFirst from "lodash/lowerFirst";
import isNull from "lodash/isNull";
import find from "lodash/find";
import uniq from "lodash/uniq";

const main_app = {
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

export default {
	name: "ComposeConfig.vue",
	components: {
		ValidationObserver,
		ValidationProvider,
		Ports,
		InputGroup,
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
				host: "",
				protocol: "http",
				port_map: null,
				cpu_shares: 10,
				memory: this.totalMemory,
				restart: "always",
				label: "",
				position: true,
				index: "",
				icon: "",
				network_model: "",
				image: "",
				description: "",
				origin: "custom",
				ports: [],
				volumes: [],
				envs: [],
				devices: [],
				cap_add: [],
				cmd: [],
				privileged: false,
				host_name: "",
				container_name: "",
				appstore_id: 0,
				services: {
					"gitea": {
						"environment": [
							"USER_GID= \"1000\"",
							"USER_UID= \"1000\"",
							"GITEA__database__DB_TYPE=mysql",
							"GITEA__database__HOST=db:3306",
							"GITEA__database__NAME=gitea",
							"GITEA__database__USER=gitea",
							"GITEA__database__PASSWD=gitea"
						],
						"image": "gitea/gitea:1",
						"mem_reservation": "268435456",
						"network_mode": "bridge",
						"ports": [
							{
								"target": 3000,
								"published": "3000",
								"protocol": "tcp"
							},
							{
								"target": 22,
								"published": "222",
								"protocol": "tcp"
							}
						],
						"restart": "unless-stopped",
						"volumes": [
							{
								"type": "bind",
								"source": "/DATA/AppData/$AppID/data",
								"target": "/data"
							}
						],
						"depends_on": [
							"db"
						],
						"x-casaos": {
							"author": "CasaOS Team",
							"category": "Developer",
							"container": {
								"envs": [
									{
										"configurable": "advanced",
										"container": "USER_UID",
										"description": {
											"en_US": "The UID (Unix user ID) of the user that runs Gitea"
										}
									},
									{
										"configurable": "advanced",
										"container": "USER_GID",
										"description": {
											"en_US": "The GID (Unix group ID) of the user that runs Gitea"
										}
									}
								],
								"index": "/",
								"port_map": "3000",
								"ports": [
									{
										"configurable": "advanced",
										"container": "3000",
										"description": {
											"en_US": "WebUI Port"
										},
										"protocol": "tcp"
									},
									{
										"configurable": "advanced",
										"container": "22",
										"description": {
											"en_US": "SSH Port"
										},
										"protocol": "tcp"
									}
								],
								"shell": "sh",
								"volumes": [
									{
										"configurable": "advanced",
										"container": "/data",
										"description": {
											"en_US": "Gitea data directory."
										}
									}
								]
							},
							"description": {
								"en_US": "Gitea is a community managed lightweight code hosting solution written in Go."
							},
							"developer": "Gitea",
							"icon": "https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/icon.png",
							"screenshot_link": [
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-1.jpg",
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-2.jpg",
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-3.jpg",
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-4.jpg",
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-5.jpg",
								"https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/screenshot-6.jpg"
							],
							"tagline": {
								"en_US": "Git with a cup of tea"
							},
							"thumbnail": "https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Gitea/thumbnail.png",
							"tips": {
								"before_install": [
									{
										"content": null,
										"en_US": "When the App is installed, the first account registered will become the administrator account."
									}
								]
							},
							"title": {
								"en_US": "Gitea"
							}
						}
					},
					"db": {
						"image": "mysql:8",
						"restart": "always",
						"environment": [
							"MYSQL_ROOT_PASSWORD=gitea",
							"MYSQL_USER=gitea",
							"MYSQL_PASSWORD=gitea",
							"MYSQL_DATABASE=gitea"
						],
						"networks": [
							"gitea"
						],
						"volumes": [
							"./mysql:/var/lib/mysql"
						]
					}
				},
			},
			configDataX: {},
		}
	},
	props: {
		state: String,
		isCasa: {
			type: Boolean,
			required: true,
		},
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
			handler(val) {
				this.$emit('update-configData', val)
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
					this.parseComposeYaml(val)
				} else {
					let gg = find(this.networks, (o) => {
						return o.driver == "bridge"
					}) || []
					this.configData.network_model = gg.length > 0 ? gg[0].name : "bridge";
				}
			},
			deep: true
		},
	},
	computed: {
		main_app: {
			get() {
				if (this.configData['x-casaos']) {
					ajc.compile(main_app)(this.configData['x-casaos'])
				}
				return this.configData['x-casaos'];
			},
			set(val) {
				this.configData['x-casaos'] = val
			}
		},
		icon: {
			get() {
				return this.configData.services[this.main_app]['x-casaos']['icon'];
			},
			set(val) {
				this.configData.services[this.main_app]['x-casaos']['icon'] = val
			}
		},
		showPorts() {
			if (this.configData.network_model.toLowerCase().indexOf("macvlan") > -1 || this.configData.network_model.indexOf("host") > -1) {
				return false
			} else {
				return true
			}
		},
		showHostPort() {
			if (this.configData.network_model.indexOf("host") > -1) {
				return false
			} else {
				return true
			}
		},
		bridgePorts() {
			return this.configData.ports.filter(function (item) {
				return item.host != ""
			})
		},
		filteredBeidgePort() {
			return this.bridgePorts.filter(port => {
				return port.host.indexOf(this.configData.port_map) >= 0
			})
			
		},
	},
	created() {
		// Set Front-end base url
		this.baseUrl = `${document.domain}`;
	},
	
	methods: {
		// migration !!! start !!!
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
			this.configData.icon = this.getIconFromImage(image)
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
			this.capArray = data.filter((option) => {
				return option
					.toString()
					.indexOf(text.toUpperCase()) >= 0
			})
		},
		
		/**
		 * @description: Validate form async
		 * @param {Object} ref ref of component
		 * @return {Boolean}
		 */
		async checkStep(ref) {
			return await this.$refs.ob1.validate();
		},
		
		/**
		 * @description: Parse Import Docker Compose Commands
		 * @return {Boolean}
		 */
		parseComposeYaml() {
			try {
				const yaml = YAML.parse(this.dockerComposeCommands)
				if (yaml.version === undefined) {
					return false
				}
				for (const yamlKey in yaml.services) {
					this.configData[yamlKey] = this.parseCompseItem(yaml.services[yamlKey])
				}
				
				return true
			} catch (error) {
				console.log(error);
				return false
			}
		},
		
		parseCompseItem(parsedInput) {
			// const parsedInput = Object.values(yaml.services)[0]
			let configData = {};
			// Image
			configData.image = parsedInput.image
			// Label
			if (parsedInput.container_name != undefined) {
				configData.label = upperFirst(parsedInput.container_name)
			} else {
				const imageArray = parsedInput.image.split("/")
				const lastNode = [...imageArray].pop()
				configData.label = upperFirst(lastNode.split(":")[0])
			}
			// Envs
			if (parsedInput.environment) {
				let envArray = Array.isArray(parsedInput.environment) ? parsedInput.environment : Object.entries(parsedInput.environment)
				configData.envs = envArray.map(item => {
					let ii = typeof item === "object" ? Array.from(item) : item.split("=");
					return {
						host: ii[1].replace(/"/g, ""),
						container: ii[0]
					}
				})
			} else {
				configData.envs = []
			}
			
			
			//Ports
			configData.ports = this.makeArray(parsedInput.ports).map(item => {
				let pArray = item.split(":")
				let endArray = pArray[1].split("/")
				let protocol = (endArray[1]) ? endArray[1] : 'tcp';
				return {
					container: endArray[0],
					host: pArray[0],
					protocol: protocol
				}
			})
			
			//Volume
			configData.volumes = this.makeArray(parsedInput.volumes).map(item => {
				let ii = item.split(":");
				if (ii.length > 1) {
					return {
						container: ii[1],
						host: this.volumeAutoCheck(ii[1], ii[0], lowerFirst(configData.label))
					}
				} else {
					return {
						container: ii[0],
						host: this.volumeAutoCheck(ii[0], "", lowerFirst(configData.label))
					}
				}
			})
			
			// Devices
			configData.devices = this.makeArray(parsedInput.device).map(item => {
				let ii = item.split(":");
				return {
					container: ii[1],
					host: ii[0]
				}
			})
			
			//Network
			let pnetwork = (parsedInput.network_mode != undefined) ? parsedInput.network_mode : (parsedInput.network != undefined) ? parsedInput.network[0] : undefined
			if (pnetwork != undefined) {
				let network = (pnetwork == 'physical') ? 'macvlan' : pnetwork;
				let seletNetworks = this.networks.filter(item => {
					if (item.driver == network) {
						return true
					}
				})
				if (seletNetworks.length > 0) {
					configData.network_model = seletNetworks[0].networks[0].name;
				}
			}
			
			//hostname
			configData.host_name = parsedInput.hostname != undefined ? parsedInput.hostname : ""
			// privileged
			configData.privileged = parsedInput.privileged != undefined
			
			//cap-add
			if (parsedInput.cap_add != undefined) {
				configData.cap_add = parsedInput.cap_add
			}
			//Restart
			if (parsedInput.restart != undefined) {
				configData.restart = parsedInput.restart
			}
			
			return configData
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
		
		/**
		 * @description: Pre-processed data before setting
		 * @param {ConfigObject} data
		 * @return {ConfigObject} data
		 */
		preProcessData(data) {
			data.ports = isNull(data.ports) ? [] : data.ports
			data.volumes = isNull(data.volumes) ? [] : data.volumes
			data.envs = isNull(data.envs) ? [] : data.envs
			data.devices = isNull(data.devices) ? [] : data.devices
			data.cap_add = isNull(data.cap_add) ? [] : data.cap_add
			data.cmd = isNull(data.cmd) ? [] : data.cmd
			data.port_map = data.port_map === "" ? null : data.port_map
			data.cpu_shares = (data.cpu_shares === 0 || data.cpu_shares > 99) ? 90 : data.cpu_shares
			data.memory = data.memory === 0 ? this.totalMemory : data.memory
			data.restart = data.restart === "no" ? "unless-stopped" : data.restart
			data.network_model = data.network_model === "default" ? "bridge" : data.network_model
			data.icon = data.icon === "" ? this.getIconFromImage(data.image) : data.icon
			
			return data
		},
		
		/**
		 * @description: Process the datas before submit
		 * @param {*}
		 * @return {*} void
		 */
		processData() {
			
			this.initConfigData.cpu_shares = Number(this.initConfigData.cpu_shares)
			let model = this.initConfigData.network_model.split("-");
			this.initConfigData.network_model = model[0]
		},
		
		// migration !!! end !!!
		
		updateConfigDataCommands(val) {
			this.$emit('updateConfigDataCommands', YAML.stringify(val));
		},
	}
}
</script>

<style scoped>

</style>