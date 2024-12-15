<script>
import IconInput from './IconInput.vue'

export default {
  name: 'VolumesInputGroup',
  components: {
    IconInput,
  },
  model: {
    prop: 'vData',
    event: 'change',
  },
  props: {
    vData: Array,
    label: String,
    message: String,
    type: String,
    name1: {
      type: String,
      default: 'Container',
    },
    name2: {
      type: String,
      default: 'Host',
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
  created() {
  },
  methods: {
    addItem() {
      const itemObj = {
        type: 'bind',
        target: '/',
        source: '/',
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
          <b-field :label="$t(name2)" expanded>
            <IconInput v-model="item.source" :placeholder="$t(name2)" :type="type" expanded />
          </b-field>
          <b-field :label="$t(name1)" expanded>
            <b-input v-model="item.target" :placeholder="$t(name1)" expanded />
          </b-field>
        </b-field>
      </template>
      <template v-else>
        <b-field grouped>
          <b-field expanded>
            <IconInput v-model="item.source" :placeholder="$t(name2)" :type="type" expanded />
          </b-field>
          <b-field expanded>
            <b-input v-model="item.target" :placeholder="$t(name1)" expanded />
          </b-field>
        </b-field>
      </template>
    </div>
  </div>
</template>
