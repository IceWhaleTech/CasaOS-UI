<template>
	<div class="mb-5">
		<div class="field is-flex is-align-items-center mb-2">
			<label class="label mb-0 is-flex-grow-1">{{ label }}</label>
			<b-button  icon-left="plus-outline" icon-pack="casa" rounded size="is-small" @click="addItem">{{ $t('Add') }}</b-button>
		</div>
		<div v-if="items.length == 0" class="is-flex is-align-items-center mb-5 info">
			<b-icon icon="warning-solid" size="is-small" pack="casa" class="mr-2 "></b-icon>
			<span>
				{{ message }}
			</span>
		</div>

		<div v-for="(item, index) in items" :key="'port' + index" class="port-item  mr-4">
			<b-icon class="is-clickable" icon="close-outline" pack="casa" size="is-small"
				@click.native="removeItem(index)"></b-icon>
			<template v-if="index < 1">
				<b-field grouped>
					<b-field :label="$t(name2)" expanded>
						<icon-input v-model="item.host" :placeholder="$t(name2)" :type="type" expanded></icon-input>
					</b-field>
					<b-field :label="$t(name1)" expanded>
						<b-input v-model="item.container" :placeholder="$t(name1)" expanded></b-input>
					</b-field>

				</b-field>
			</template>
			<template v-else>
				<b-field grouped>
					<b-field expanded>
						<icon-input v-model="item.host" :placeholder="$t(name2)" :type="type" expanded></icon-input>
					</b-field>
					<b-field expanded>
						<b-input v-model="item.container" :placeholder="$t(name1)" expanded></b-input>
					</b-field>

				</b-field>

			</template>
		</div>

	</div>
</template>

<script setup>
import { computed } from 'vue'
import IconInput from '../forms/IconInput.vue'


const props = defineProps({
	devices: Array,
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
})

const items = computed({
	get() {
		return props.devices
	},
	set(val) {
		emit('change', val)
	}
})

const addItem = () => {
	let itemObj = {
		container: "",
		host: ""
	}
	items.value.push(itemObj)
}

const removeItem = (index) => {
	items.value.splice(index, 1)
}
defineExpose({
	items,
	addItem,
	removeItem
})

</script>