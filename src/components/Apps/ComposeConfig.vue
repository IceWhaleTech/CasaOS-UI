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
import YAML from "yamljs";
import upperFirst from "lodash/upperFirst";
import lowerFirst from "lodash/lowerFirst";
import isNull from "lodash/isNull";
import find from "lodash/find";

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
			},
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
        // configData: {
        //     type: Object,
        //     // required: true,
        //     default: {
        //             host: "",
        //             protocol: "http",
        //             port_map: null,
        //             cpu_shares: 10,
        //             memory: 300,
        //             restart: "always",
        //             label: "",
        //             position: true,
        //             index: "",
        //             icon: "",
        //             network_model: "",
        //             image: "",
        //             description: "",
        //             origin: "custom",
        //             ports: [],
        //             volumes: [],
        //             envs: [],
        //             devices: [],
        //             cap_add: [],
        //             cmd: [],
        //             privileged: false,
        //             host_name: "",
        //             container_name: "",
        //             appstore_id: 0,
        //         }
        // },
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
			},
			deep: true
		},
        dockerComposeCommands: {
            handler(val) {
                if(val != null) {
                    this.parseComposeYaml(val)
                }else {
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
                const parsedInput = Object.values(yaml.services)[0]
                // Image
                this.configData.image = parsedInput.image
                // Label
                if (parsedInput.container_name != undefined) {
                    this.configData.label = upperFirst(parsedInput.container_name)
                } else {
                    const imageArray = parsedInput.image.split("/")
                    const lastNode = [...imageArray].pop()
                    this.configData.label = upperFirst(lastNode.split(":")[0])
                }
                // Envs
                if (parsedInput.environment) {
                    let envArray = Array.isArray(parsedInput.environment) ? parsedInput.environment : Object.entries(parsedInput.environment)
                    this.configData.envs = envArray.map(item => {
                        let ii = typeof item === "object" ? Array.from(item) : item.split("=");
                        return {
                            host: ii[1].replace(/"/g, ""),
                            container: ii[0]
                        }
                    })
                } else {
                    this.configData.envs = []
                }


                //Ports
                this.configData.ports = this.makeArray(parsedInput.ports).map(item => {
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
                this.configData.volumes = this.makeArray(parsedInput.volumes).map(item => {
                    let ii = item.split(":");
                    if (ii.length > 1) {
                        return {
                            container: ii[1],
                            host: this.volumeAutoCheck(ii[1], ii[0], lowerFirst(this.configData.label))
                        }
                    } else {
                        return {
                            container: ii[0],
                            host: this.volumeAutoCheck(ii[0], "", lowerFirst(this.configData.label))
                        }
                    }
                })

                // Devices
                this.configData.devices = this.makeArray(parsedInput.device).map(item => {
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
                    let seletNetworks = this.netWorks.filter(item => {
                        if (item.driver == network) {
                            return true
                        }
                    })
                    if (seletNetworks.length > 0) {
                        this.configData.network_model = seletNetworks[0].networks[0].name;
                    }
                }

                //hostname
                this.configData.host_name = parsedInput.hostname != undefined ? parsedInput.hostname : ""
                // privileged
                this.configData.privileged = parsedInput.privileged != undefined

                //cap-add
                if (parsedInput.cap_add != undefined) {
                    this.configData.cap_add = parsedInput.cap_add
                }
                //Restart
                if (parsedInput.restart != undefined) {
                    this.configData.restart = parsedInput.restart
                }

                return true
            } catch (error) {
                console.log(error);
                return false
            }
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
		
		// migration !!! end !!!
	}
}
</script>

<style scoped>

</style>