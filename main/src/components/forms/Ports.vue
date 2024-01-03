<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ $t('Ports') }}</label>
			<b-button  icon-left="plus-outline" icon-pack="casa" rounded size="is-small" @click="addItem">{{ $t('Add') }}</b-button>
		</div>
		<div v-if="items.length == 0" class="is-flex is-align-items-center mb-5 info">
			<b-icon icon="warning-solid" size="is-small" pack="casa" class="mr-2 "></b-icon>
			<span>
				{{ $t('No ports now, click “+” to add one.') }}
			</span>

		</div>
		<div v-for="(item, index) in items" :key="'port' + index + item.protocol" class="port-item mr-4">
			<b-icon class="is-clickable" icon="close-outline" pack="casa" size="is-small" @click.native="removeItem(index)"></b-icon>
			<ValidationObserver ref="ob" v-slot="{ invalid }" slim>
				<template>
					<b-field grouped >
						<validation-provider v-if="showHostPost" v-slot="{ errors, valid }"
							:rules="'yaml_port|not_in_ports:' + invalidPortsInUse(item.published, item.protocol)" slim>
							<!-- Only show title when the first item. -->
							<b-field :label="index < 1 ? $t('Host') : ''"
								:type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
								<b-input :placeholder="$t('Host')"
									:value="item.host_ip ? `${item.host_ip}:${item.published}` : item.published" expanded
									@blur="(event, val) => assignPortsItem(event.target._value, item)"></b-input>
							</b-field>
						</validation-provider>

						<validation-provider v-slot="{ errors, valid }" rules="yaml_port" slim>
							<!-- Only show title when the first item. -->
							<b-field :label="index < 1 ? $t('Container') : ''"
								:type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
								<b-input v-model.number="item.target" :placeholder="$t('Container')" expanded></b-input>
							</b-field>
						</validation-provider>

						<!-- Only show title when the first item. -->
						<b-field :label="index < 1 ? $t('Protocol') : ''" expanded>
							<b-select v-model="item.protocol" :placeholder="$t('Protocol')" expanded>
								<option value="tcp">TCP</option>
								<option value="udp">UDP</option>
								<option value="">TCP + UDP</option>
							</b-select>
						</b-field>
					</b-field>

				</template>
			</ValidationObserver>
		</div>
	</div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
	name: 'ports-form',
	components: {
		ValidationProvider,
		ValidationObserver
	},
	data() {
		return {
			isLoading: false,
			min: 0
		}
	},
	model: {
		prop: 'vData',
		event: 'change'
	},
	props: {
		vData: Array,
		showHostPost: Boolean,
		ports_in_use: {
			default: () => {
				return { tcp: [], udp: [] }
			},
			type: Object
		},
	},
	computed: {
		items: {
			get() {
				this.vData.forEach(item => {
					if (!item?.protocol) {
						console.log(item, "item");
						this.$set(item, 'protocol', "");
					}
				})
				return this.vData;
			},
			set(val) {
				this.validateField(val);
			}
		},
	},
	methods: {
		addItem() {
			let itemObj = {
				target: "",
				published: "",
				host_ip: "",
				protocol: "tcp"
			}
			this.items.push(itemObj)
		},

		removeItem(index) {
			this.items.splice(index, 1)
		},

		validateField(val) {
			this.$refs.ob.checkStep().then(valid => {
				if (valid) {
					this.$emit('change', val);
				}
			});
		},
		assignPortsItem(val, item) {
			const reg = /((^(\d{1,3}\.){3}\d{1,3}):)?(\d{1,5}$)/;
			const partList = val.match(reg);
			console.log(partList?.[2], partList?.[4], val, "------")
			item.host_ip = partList?.[2] || '';
			item.published = partList?.[4] || val;
		},

		/*
		* type : tcp/udp
		* */
		invalidPortsInUse(port, type) {
			// The host's port input is String Type.
			// port = port - 0;
			if (type === 'both') {
				return (this.ports_in_use?.["udp"] || []).includes(port) || (this.ports_in_use?.["tcp"] || []).includes(port)
			}
			if (type) {
				return (this.ports_in_use?.[type] || this.ports_in_use?.[type.toUpperCase()] || []).includes(port + "")
			}
			return false;
		},

		invalidPortsInUseRule(type) {
			if (type === 'both') {
				return (this.ports_in_use?.["udp"] || []).concat((this.ports_in_use?.["tcp"] || [])).join(',')
			}
			if (type) {
				return (this.ports_in_use?.[type] || []).join(',')
			}
		},
	},
}
</script>

<style lang="scss">
.info {
	font-size: 0.875rem;
	color: #5a5a5a;
}

.port-item {
	position: relative;

	.icon {
		position: absolute;
		right: -1.25rem;
		bottom: 0.825rem;
	}

	&:not(:last-child) {
		margin-bottom: 0.5rem;
	}

	.field.is-expanded {
		.label {
			text-align: center;
			font-weight: normal;
		}
	}
}
</style>