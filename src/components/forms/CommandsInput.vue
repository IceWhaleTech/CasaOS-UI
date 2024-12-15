<script>
export default {
  name: 'CommandsInput',
  components: {},
  model: {
    prop: 'vdata',
    event: 'change',
  },
  props: {
    vdata: Array,
    label: String,
    message: String,
  },
  data() {
    return {
      isLoading: false,
      items: this.vdata,
      min: 0,
    }
  },
  watch: {
    vdata(val) {
      this.items = val
    },
  },

  methods: {
    addItem() {
      this.items.push('')
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

<template>
  <div class="mb-5">
    <div class="field is-flex is-align-items-center mb-2">
      <label class="label mb-0 is-flex-grow-1">{{ label }}</label>
      <b-button icon-left="plus-outline" icon-pack="casa" size="is-small" rounded @click="addItem">
        {{ $t('Add') }}
      </b-button>
    </div>
    <div v-if="items.length === 0" class="is-flex is-align-items-center mb-5 info ">
      <b-icon icon="warning-solid" size="is-small" pack="casa" class="mr-2 " />
      <span>
        {{ message }}
      </span>
    </div>

    <div v-for="(item, index) in items" :key="`port${index}`" class="port-item  mr-4">
      <b-icon
        icon="close-outline" pack="casa" size="is-small" class="is-clickable"
        @click.native="removeItem(index)"
      />
      <b-field expanded>
        <b-input v-model="items[index]" placeholder="Commands" expanded @input="handleInput" />
      </b-field>
    </div>
  </div>
</template>
