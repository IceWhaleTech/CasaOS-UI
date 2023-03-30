<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/16 下午4:15
  * @FilePath: /CasaOS-UI/src/components/forms/Ports.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ $t('Ports') }}</label>
			<b-button icon-left="plus" rounded size="is-small" @click="addItem">{{ $t('Add') }}</b-button>
		</div>
		<div v-if="items.length == 0" class="is-flex is-align-items-center mb-5 info">
			<b-icon class="mr-2 " icon="information" size="is-small"></b-icon>
			<span>
		        {{ $t('No ports now, click “+” to add one.') }}
			</span>
		
		</div>
		<div v-for="(item,index) in items" :key="'port'+index+item.protocol" class="port-item">
			<b-icon class="is-clickable" icon="close" size="is-small" @click.native="removeItem(index)"></b-icon>
			<template v-if="index < 1">
				<b-field grouped>
					<b-field v-if="showHostPost" :label="$t('Host')" expanded>
						<b-input v-model.number="item.published" :placeholder="$t('Host')" expanded
						         type="number"></b-input>
					</b-field>
					<b-field :label="$t('Container')" expanded>
						<b-input v-model.number="item.target" :placeholder="$t('Container')" expanded
						         type="number"></b-input>
					</b-field>
					
					<b-field :label="$t('Protocol')" expanded>
						<b-select v-model="item.protocol" :placeholder="$t('Protocol')" expanded>
							<option value="tcp">TCP</option>
							<option value="udp">UDP</option>
							<option value="both">TCP + UDP</option>
						</b-select>
					</b-field>
				</b-field>
			</template>
			<template v-else>
				<b-field grouped>
					<b-input v-if="showHostPost" v-model.number="item.published" :placeholder="$t('Host')" expanded
					         type="number"></b-input>
					<b-input v-model.number="item.target" :placeholder="$t('Container')" expanded
					         type="number"></b-input>
					
					<b-select v-model="item.protocol" :placeholder="$t('Protocol')" expanded>
						<option value="tcp">TCP</option>
						<option value="udp">UDP</option>
						<option value="both">TCP + UDP</option>
					</b-select>
				</b-field>
			
			</template>
		</div>
	
	</div>
</template>

<script>

export default {
	name: 'ports-form',
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
		showHostPost: Boolean
	},
	computed: {
		items: {
			get() {
				return this.vData;
			},
			set(val) {
				this.$emit('change', val);
			}
		}
	},
	methods: {
		addItem() {
			let itemObj = {
				target: "",
				published: "",
				protocol: "tcp"
			}
			this.items.push(itemObj)
		},
		
		removeItem(index) {
			this.items.splice(index, 1)
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