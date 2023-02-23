<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/22 下午12:18
  * @FilePath: /CasaOS-UI/src/components/Apps/ComposeConfig.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  
  -->
<template>
	<ValidationObserver ref="ob1">
		
		<ValidationProvider v-slot="{ errors, valid }" name="Image" rules="required">
			<b-field :label="$t('Docker Image')+' *'" :message="$t(errors)"
			         :type="{ 'is-danger': errors[0], 'is-success': valid }">
				<b-input v-model="configData.image" :placeholder="$t('e.g.,hello-world:latest')"
				         :readonly="state == 'update'" @input="changeIcon"></b-input>
				<!-- <b-autocomplete :data="data" placeholder="e.g. hello-world:latest" field="image" :loading="isFetching" @typing="getAsyncData" @select="option => portSelected = option" v-model="configData.image" :readonly="state == 'update'"></b-autocomplete> -->
			</b-field>
		</ValidationProvider>
		<ValidationProvider v-slot="{ errors, valid }" name="Name" rules="required">
			<b-field :label="$t('App name')+' *'" :message="errors"
			         :type="{ 'is-danger': errors[0], 'is-success': valid }">
				<b-input v-model="configData.label" :placeholder="$t('Your custom App Name')"
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
				<b-select v-model="configData.network_model" expanded placeholder="Select">
					<optgroup v-for="net in networks" :key="net.driver" :label="net.driver">
						<option v-for="(option,index) in net.networks" :key="option.name+index"
						        :value="option.name">
							{{ option.name }}
						</option>
					</optgroup>
				</b-select>
			</b-field>
			
			<ports v-if="showPorts" v-model="configData.ports" :showHostPost="showHostPort"></ports>
			<input-group v-model="configData.volumes" :label="$t('Volumes')"
			             :message="$t('No volumes now, click “+” to add one.')"
			             type="volume"></input-group>
			<env-input-group v-model="configData.envs" :label="$t('Environment Variables')"
			                 :message="$t('No environment variables now, click “+” to add one.')"></env-input-group>
			<input-group v-model="configData.devices" :label="$t('Devices')"
			             :message="$t('No devices now, click “+” to add one.')"
			             type="device"></input-group>
			<commands-input v-model="configData.cmd" :label="$t('Container Command')"
			                :message="$t('No commands now, click “+” to add one.')"></commands-input>
			
			<b-field :label="$t('Privileged')">
				<b-switch v-model="configData.privileged"></b-switch>
			</b-field>
			
			<b-field :label="$t('Memory Limit')">
				<vue-slider v-model="configData.memory" :max="totalMemory" :min="256"></vue-slider>
			</b-field>
			
			<b-field :label="$t('CPU Shares')">
				<b-select v-model="configData.cpu_shares" :placeholder="$t('Select')" expanded>
					<option value="10">{{ $t('Low') }}</option>
					<option value="50">{{ $t('Medium') }}</option>
					<option value="90">{{ $t('High') }}</option>
				</b-select>
			</b-field>
			
			<b-field :label="$t('Restart Policy')">
				<b-select v-model="configData.restart" :placeholder="$t('Select')" expanded>
					<option value="on-failure">on-failure</option>
					<option value="always">always</option>
					<option value="unless-stopped">unless-stopped</option>
				</b-select>
			</b-field>
			
			<b-field :label="$t('Container Capabilities (cap-add)')">
				<b-taginput ref="taginput" v-model="configData.cap_add" :allow-new="false"
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
					<b-input v-model="configData.host_name" :placeholder="$t('Hostname of app container')"
					         value=""></b-input>
				</b-field>
			</ValidationProvider>
			
			<b-field :label="$t('App Description')">
				<b-input v-model="configData.description"></b-input>
			</b-field>
		</template>
	
	</ValidationObserver>
</template>

<script>
import debounce from "lodash/debounce";
import axios from "axios";

import {ValidationObserver, ValidationProvider} from "vee-validate";
import Ports from '../forms/Ports.vue'
import EnvInputGroup from '../forms/EnvInputGroup.vue';
import CommandsInput from '../forms/CommandsInput.vue';
import InputGroup from '../forms/InputGroup.vue';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

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
			
			// configData: {
			// 	host: "",
			// 	protocol: "http",
			// 	port_map: null,
			// 	cpu_shares: 10,
			// 	memory: 300,
			// 	restart: "always",
			// 	label: "",
			// 	position: true,
			// 	index: "",
			// 	icon: "",
			// 	network_model: "",
			// 	image: "",
			// 	description: "",
			// 	origin: "custom",
			// 	ports: [],
			// 	volumes: [],
			// 	envs: [],
			// 	devices: [],
			// 	cap_add: [],
			// 	cmd: [],
			// 	privileged: false,
			// 	host_name: "",
			// 	container_name: "",
			// 	appstore_id: 0,
			// },
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
        configData: {
            type: Object,
            // required: true,
            default: {
                    host: "",
                    protocol: "http",
                    port_map: null,
                    cpu_shares: 10,
                    memory: 300,
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
                }
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
			},
			deep: true
		},
        // Watch if configData changes
        // configData: {
        //     handler(val) {
        //         console.log("configData changed", val)
        //         this.configData = this.configData
        //     },
        //     deep: true
        // },
	},
	computed: {
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
		
		// migration !!! end !!!
	}
}
</script>

<style scoped>

</style>