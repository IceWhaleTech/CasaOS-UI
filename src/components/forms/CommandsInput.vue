<!--
 * @Author: JerryK
 * @Date: 2022-02-11 14:53:46
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-15 13:52:08
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/forms/CommandsInput.vue
-->
<template>
  <div class="mb-5">
    <div class="field is-flex is-align-items-center mb-2">
      <label class="label mb-0 flex1">{{label}}</label>
      <b-button icon-left="plus" size="is-small" rounded @click="addItem">{{$t('Add')}}</b-button>
    </div>
    <div class="is-flex is-align-items-center mb-5 info" v-if="vdata.length == 0">
      <b-icon icon="information" size="is-small" class="mr-2 "></b-icon>
      <span>
        {{message}}
      </span>
    </div>

    <div class="port-item" v-for="(item,index) in vdata" :key="'port'+index">
      <b-icon icon="close" size="is-small" class="is-clickable" @click.native="removeItem(index)"></b-icon>
      <b-field expanded>
        <b-input placeholder="Commands" v-model="vdata[index]" expanded @input="handleInput"></b-input>
      </b-field>
    </div>

  </div>
</template>

<script>

export default {
  name: 'commands-input',
  components: {
  },
  data() {
    return {
      isLoading: false,
      items: [],
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

  methods: {
    addItem() {
      this.vdata.push("")
    },

    removeItem(index) {
      this.vdata.splice(index, 1)
      this.filterArray()
    },
    handleInput() {
      this.filterArray()
    },
    filterArray() {
      this.$emit('change', this.vdata)
    },
  },
}
</script>

