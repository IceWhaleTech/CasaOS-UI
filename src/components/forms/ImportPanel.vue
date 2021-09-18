<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">Import From Docker CLI</h3>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">

      <b-field label="Command Line" :type="{ 'is-danger': parseError}" :message="errors">
        <b-input maxlength="800" type="textarea" class="import-area" v-model="dockerCliCommands"></b-input>
      </b-field>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button label="Cancel" @click="$emit('close')" rounded />
        <b-button label="Sumbit" type="is-dark" @click="emitSubmit" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import parser from 'yargs-parser'
export default {
  data() {
    return {
      dockerCliCommands: "",
      parseError: false,
      errors: "",
    }
  },
  props: {
    initData: Object
  },
  methods: {
    emitSubmit() {
      if (this.parseCli()) {
        this.errors = ""
        this.$emit('update', this.initData)
        this.$emit('close')
      } else {
        this.errors = "Please fill correct command line"
        this.parseError = true;
      }

    },
    // Parse Import Docker Cli Commands
    // Return True/False
    parseCli() {
      const formattedInput = this.dockerCliCommands.replace(/\<[^\>]*\>/g, ' ').trim();
      const parsedInput = parser(formattedInput)
      const { _: command, ...params } = parsedInput;
      if (command[0] !== 'docker' || (command[1] !== 'run' && command[1] !== 'create')) {
        return false
      } else {
        //Envs
        this.initData.envs = this.makeArray(parsedInput.e).map(item => {
          let ii = item.split("=");
          return {
            container: ii[0],
            host: ii[1]
          }
        })
        //Ports
        this.initData.ports = this.makeArray(parsedInput.p).map(item => {
          let pArray = item.split(":")
          let endArray = pArray[1].split("/")
          let protocol = (endArray[1]) ? endArray[1] : 'tcp';
          return {
            container: endArray[0],
            host: pArray[0],
            protocol: protocol
          }
        })
        //Volume
        this.initData.volumes = this.makeArray(parsedInput.v).map(item => {
          let ii = item.split(":");
          return {
            container: ii[1],
            host: ii[0]
          }
        })
        // Devices
        this.initData.devices = this.makeArray(parsedInput.device).map(item => {
          let ii = item.split(":");
          return {
            container: ii[1],
            host: ii[0]
          }
        })
        //Image
        
        this.initData.image = [...command].pop()
        //Label
        if (parsedInput.name != undefined) {
          this.initData.label = parsedInput.name.replace(/^\S/, s => s.toUpperCase())
        }
        //Restart
        if (parsedInput.restart != undefined) {
          this.initData.restart = parsedInput.restart
        }
        return true
      }
    },
    makeArray(foo) {
      let newArray = (typeof (foo) == "string") ? [foo] : foo
      return (newArray == undefined) ? [] : newArray
    }
  },
}
</script>

<style>
</style>