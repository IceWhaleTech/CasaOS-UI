<script>
export default {
  name: 'EnvInputGroup',
  model: {
    prop: 'vData',
    event: 'change',
  },
  props: {
    vData: Array,
    label: String,
    message: String,
    name1: {
      type: String,
      default: 'Key',
    },
    name2: {
      type: String,
      default: 'Value',
    },

  },
  data() {
    return {
      isLoading: false,
      min: 0,
    }
  },
  computed: {
    items: {
      get() {
        return this.vData
      },
      set(val) {
        this.$emit('change', val)
      },
    },
  },
  methods: {
    addItem() {
      const itemObj = {
        container: '',
        host: '',
      }
      this.items.push(itemObj)
    },

    removeItem(index) {
      this.items.splice(index, 1)
    },
  },
}
</script>

<template>
  <div class="mb-5">
    <div class="field is-flex is-align-items-center mb-2">
      <label class="label mb-0 is-flex-grow-1">{{ label }}</label>
      <b-button icon-left="plus-outline" icon-pack="casa" rounded size="is-small" @click="addItem">
        {{ $t('Add') }}
      </b-button>
    </div>
    <div v-if="items.length === 0" class="is-flex is-align-items-center mb-5 info">
      <b-icon icon="warning-solid" size="is-small" pack="casa" class="mr-2 " />
      <span>
        {{ message }}
      </span>
    </div>
    <div v-for="(item, index) in items" :key="`port${index}`" class="port-item  mr-4">
      <b-icon
        class="is-clickable" icon="close-outline" pack="casa" size="is-small"
        @click.native="removeItem(index)"
      />
      <template v-if="index < 1">
        <b-field grouped>
          <b-field :label="$t(name1)" expanded>
            <b-input v-model="item.container" :placeholder="$t(name1)" expanded />
          </b-field>
          <b-field :label="$t(name2)" expanded>
            <b-input v-model="item.host" :placeholder="$t(name2)" expanded />
          </b-field>
        </b-field>
      </template>
      <template v-else>
        <b-field grouped>
          <b-input v-model="item.container" :placeholder="$t(name1)" expanded />
          <b-input v-model="item.host" :placeholder="$t(name2)" expanded />
        </b-field>
      </template>
    </div>
  </div>
</template>
