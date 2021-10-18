<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">Import</h3>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <b-tabs v-model="activeTab">
        <b-tab-item label="Docker CLI">
          <b-field :type="{ 'is-danger': parseError}" :message="errors">
            <b-input maxlength="800" type="textarea" class="import-area" v-model="dockerCliCommands"></b-input>
          </b-field>
        </b-tab-item>
        <b-tab-item label="App File">
          <b-field :type="{ 'is-danger': parseError}" :message="errors">
            <b-upload v-model="dropFiles" drag-drop expanded accept="application/json" @input="onSelect">
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"></b-icon>
                  </p>
                  <p>{{dropText}}</p>
                </div>
              </section>
            </b-upload>
          </b-field>
        </b-tab-item>

      </b-tabs>

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
const _ = require('lodash')
export default {
  data() {
    return {
      activeTab: 0,
      file: {},
      dropFiles: {},
      dockerCliCommands: "",
      parseError: false,
      appFileLoaded: false,
      errors: "",
      dropText: "Drop your app file here or click to upload",
      updateData: this.initData
    }
  },
  props: {
    initData: Object,
    netWorks: Array,
    oriNetWorks: Array,
    deviceMemory: Number
  },
  created() {
    //console.log(this.oriNetWorks);
  },
  methods: {

    /**
     * @description: Emit Event to tell parent Update
     * @param {*}
     * @return {*} void
     */
    emitSubmit() {
      if (this.activeTab == 0) {
        if (this.parseCli()) {
          this.errors = ""
          this.$emit('update', this.updateData)
          this.$emit('close')
        } else {
          this.errors = "Please fill correct command line"
          this.parseError = true;
        }
      } else if (this.activeTab == 1) {
        if (this.appFileLoaded) {
          this.errors = ""
          this.$emit('update', this.updateData)
          this.$emit('close')
        } else {
          this.errors = "Please import a valid App file"
          this.parseError = true;
        }
      }
    },

    volumeAutoCheck(containerPath, hostPath, appName) {
      let finalHostPath = hostPath
      const rootDir = "/DATA"
      const checkArray = [
        {
          keywords: ["config"],
          value: `/AppData/${appName}${containerPath}/`
        },
        {
          keywords: ["tvshows", "TV", "tv"],
          value: `/Media/TV Shows/`
        },
        {
          keywords: ["movies", "Movie", "movie"],
          value: `/Media/Movies/`
        },
        {
          keywords: ["Music", "music"],
          value: `/Media/Music/`
        },
        {
          keywords: ["download"],
          value: `/Downloads/`
        },
        {
          keywords: ["pictures", "photo"],
          value: `/Gallery/`
        }
      ]

      checkArray.forEach(item => {
        if (item.keywords.some(keywordsItem => {
          return containerPath.includes(keywordsItem)
        })) {
          finalHostPath = rootDir + item.value
          return
        }
      })

      return finalHostPath
    },

    /**
     * @description: Parse Import Docker Cli Commands
     * @return {Boolean} 
     */
    parseCli() {
      const formattedInput = this.dockerCliCommands.replace(/<[^>]*>/g, 'Custom_data').replace(/[\r\n]/g, "").replace(/\\/g, "\\ ").trim();
      const parsedInput = parser(formattedInput)
      console.log(parsedInput);
      const { _: command } = parsedInput;
      if (command[0] !== 'docker' || (command[1] !== 'run' && command[1] !== 'create')) {
        return false
      } else {

        //Image
        this.updateData.image = [...command].pop()
        //Label
        if (parsedInput.name != undefined) {
          this.updateData.label = _.upperFirst(parsedInput.name)
        } else {
          const imageArray = this.updateData.image.split("/")
          const lastNode = [...imageArray].pop()
          this.updateData.label = _.upperFirst(lastNode.split(":")[0])
        }

        //Envs
        this.updateData.envs = this.makeArray(parsedInput.e).map(item => {
          let ii = item.split("=");
          return {
            host: ii[1].replace(/"/g, ""),
            container: ii[0]
          }
        })
        //Ports
        this.updateData.ports = this.makeArray(parsedInput.p).map(item => {
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
        this.updateData.volumes = this.makeArray(parsedInput.v).map(item => {
          let ii = item.split(":");
          if (ii.length > 1) {
            // console.log(this.volumeAutoCheck(ii[1],ii[0], _.lowerFirst(this.updateData.label)));
            return {
              container: ii[1],
              host: this.volumeAutoCheck(ii[1], ii[0], _.lowerFirst(this.updateData.label))
            }
          } else {
            return {
              container: ii[0],
              host: this.volumeAutoCheck(ii[0], "", _.lowerFirst(this.updateData.label))
            }
          }

        })
        // Devices
        this.updateData.devices = this.makeArray(parsedInput.device).map(item => {
          let ii = item.split(":");
          return {
            container: ii[1],
            host: ii[0]
          }
        })

        //Network
        if (parsedInput.network != undefined) {
          let network = (parsedInput.network == 'physical') ? 'macvlan' : parsedInput.network;
          let seletNetworks = this.netWorks.filter(item => {
            if (item.driver == network) {
              return true
            }
          })
          if (seletNetworks.length > 0) {
            this.updateData.network_model = seletNetworks[0].networks[0].id;
          }
        }



        //Restart
        if (parsedInput.restart != undefined) {
          this.updateData.restart = parsedInput.restart
        }
        return true
      }
    },

    /**
     * @description: Make String to Array
     * @param {*}
     * @return {Array}
     */
    makeArray(foo) {
      const newArray = (typeof (foo) == "string") ? [foo] : foo
      return (newArray == undefined) ? [] : newArray
    },

    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    onSelect(val) {
      const _this = this
      const reader = new FileReader();
      if (typeof FileReader === "undefined") {
        this.$buefy.toast.open({
          duration: 3000,
          message: `Your browser does not support file reading.`,
          type: 'is-danger'
        })
        return;
      }
      reader.readAsText(val)
      reader.onload = function () {
        try {
          _this.updateData = JSON.parse(this.result);
          if (_this.updateData.version === undefined) {
            _this.$buefy.toast.open({
              duration: 3000,
              message: `This is not a valid App file.`,
              type: 'is-danger'
            })
            _this.appFileLoaded = false
            return false
          } else {
            delete _this.updateData.versison
            _this.updateData.network_model = _this.getNetworkModel(_this.updateData.network_model)
            _this.updateData.memory = _this.deviceMemory
            _this.dropText = `${val.name} has been selected`
            _this.appFileLoaded = true
            return true
          }

        } catch (e) {
          _this.$buefy.toast.open({
            duration: 3000,
            message: `This is not a valid json file.`,
            type: 'is-danger'
          })
          _this.appFileLoaded = false
          return false
        }
      }
    },

    getNetworkModel(netName) {
      const network = this.oriNetWorks.filter(net => {
        return net.name == netName
      })
      return (network.length > 0) ? network[0].id : this.oriNetWorks[0].id

    },
  },
}
</script>

<style>
</style>