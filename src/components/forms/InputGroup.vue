<template>
  <div class="mb-5">
    <div class="field is-flex is-align-items-center mb-2">
      <label class="label mb-0 flex1">{{label}}</label>
      <b-button icon-left="plus" type="is-dark" size="is-small" rounded @click="addItem">Add</b-button>
    </div>
    <div class="is-flex is-align-items-center mb-5 info" v-if="vdata.length == 0">
      <b-icon icon="information" size="is-small" class="mr-2 "></b-icon>
      <span>
        {{message}}
      </span>
    </div>

    <div class="port-item" v-for="(item,index) in vdata" :key="'port'+index">
      <b-icon icon="close" size="is-small" class="is-clickable" @click.native="removeItem(index)"></b-icon>
      <template v-if="index < 1">
        <b-field grouped>
          <b-field :label="name2" expanded>
            <!-- <b-input :placeholder="name2" v-model="item.host" expanded @input="handleInput" icon-right="image-filter-center-focus-strong" icon-right-clickable @icon-right-click="selectFile"></b-input> -->
            <icon-input :placeholder="name2" v-model="item.host" expanded @input="handleInput"></icon-input>

          </b-field>
          <b-field :label="name1" expanded>
            <b-input :placeholder="name1" v-model="item.container" expanded @input="handleInput"></b-input>
          </b-field>

        </b-field>
      </template>
      <template v-else>
        <b-field grouped>
          <b-field expanded>
            <!-- <b-input :placeholder="name2" v-model="item.host" expanded @input="handleInput" icon-right="image-filter-center-focus-strong" icon-right-clickable @icon-right-click="selectFile"></b-input> -->
            <icon-input :placeholder="name2" v-model="item.host" expanded @input="handleInput"></icon-input>
          </b-field>
          <b-field expanded>
            <b-input :placeholder="name1" v-model="item.container" expanded @input="handleInput"></b-input>
          </b-field>

        </b-field>

      </template>
    </div>

  </div>
</template>

<script>
import IconInput from '../forms/IconInput.vue'
export default {
  name: 'input-group',
  components: {
    IconInput,
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
    //this.items = this.vdata;
  },
  watch: {

  },
  mounted() {
    //this.addItem()
  },
  methods: {
    addItem() {
      let itemObj = {
        container: "",
        host: ""
      }
      this.vdata.push(itemObj)
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
    selectFile(e) {

      console.log(e.target.parents);
    }
  },
}
</script>

