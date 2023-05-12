<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/2/16 下午4:25
  * @FilePath: /CasaOS-UI/src/components/forms/InputGroup.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ label }}</label>
			<b-button icon-left="plus" rounded size="is-small" @click="addItem">{{ $t('Add') }}</b-button>
		</div>
		<div v-if="items.length == 0" class="is-flex is-align-items-center mb-5 info">
			<b-icon class="mr-2 " icon="information" size="is-small"></b-icon>
			<span>
                {{ message }}
            </span>
		</div>

		<div v-for="(item, index) in items" :key="'port' + index" class="port-item">
			<b-icon class="is-clickable" icon="close" size="is-small" @click.native="removeItem(index)"></b-icon>
			<template v-if="index < 1">
				<b-field grouped>
					<b-field :label="$t(name2)" expanded>
						<icon-input v-model="item.source" :placeholder="$t(name2)" :type="type" expanded
						></icon-input>

					</b-field>
					<b-field :label="$t(name1)" expanded>
						<b-input v-model="item.target" :placeholder="$t(name1)" expanded></b-input>
					</b-field>

				</b-field>
			</template>
			<template v-else>
				<b-field grouped>
					<b-field expanded>
						<icon-input v-model="item.source" :placeholder="$t(name2)" :type="type" expanded
						></icon-input>
					</b-field>
					<b-field expanded>
						<b-input v-model="item.target" :placeholder="$t(name1)" expanded></b-input>
					</b-field>

				</b-field>

			</template>
		</div>

	</div>
</template>

<script>
import IconInput from '../forms/IconInput.vue'

export default {
	name: 'volumes-input-group',
	components: {
		IconInput,
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
		label: String,
		message: String,
		type: String,
		name1: {
			type: String,
			default: "Container"
		},
		name2: {
			type: String,
			default: "Host"
		},

	},
	created() {
	},
	computed: {
		items: {
			get() {
				return this.vData
			},
			set(val) {
				this.$emit('change', val)
			}
		}
	},
	methods: {
		addItem() {
			let itemObj = {
				type: "bind",
				target: "/",
				source: "/"
			}
			this.items.push(itemObj)
		},

		removeItem(index) {
			this.items.splice(index, 1)
		},
	},
}
</script>

