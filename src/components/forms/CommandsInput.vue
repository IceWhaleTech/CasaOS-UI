<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ label }}</label>
			<b-button icon-left="plus-outline" icon-pack="casa" size="is-small" rounded @click="addItem">{{ $t('Add')
			}}</b-button>
		</div>
		<div class="is-flex is-align-items-center mb-5 info " v-if="items.length == 0">
			<b-icon icon="warning-solid" size="is-small" pack="casa" class="mr-2 "></b-icon>
			<span>
				{{ message }}
			</span>
		</div>

		<div class="port-item  mr-4" v-for="(item, index) in items" :key="'port' + index">
			<b-icon icon="close-outline" pack="casa" size="is-small" class="is-clickable"
				@click.native="removeItem(index)"></b-icon>
			<b-field expanded>
				<b-input placeholder="Commands" v-model="items[index]" expanded @input="handleInput"></b-input>
			</b-field>
		</div>

	</div>
</template>

<script>

export default {
	name: 'commands-input',
	components: {},
	data() {
		return {
			isLoading: false,
			items: this.vdata,
			min: 0
		}
	},
	model: {
		prop: 'vdata',
		event: 'change'
	},
	props: {
		vdata: Array,
		label: String,
		message: String,
	},
	watch: {
		vdata(val) {
			this.items = val
		}
	},

	methods: {
		addItem() {
			this.items.push("")
		},

		removeItem(index) {
			this.items.splice(index, 1)
			this.filterArray()
		},
		handleInput() {
			this.filterArray()
		},
		filterArray() {
			this.$emit('change', this.items)
		},
	},
}
</script>

