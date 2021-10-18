<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{title}}</h3>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <b-field label="Name" :type="errorType" :message="message">
        <b-input v-model="name" maxlength="255"  expanded></b-input>
      </b-field>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button label="Cancel" type="is-grey" @click="$emit('close')" rounded />
        <b-button label="Submit" type="is-dark" @click="create()" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End-->
  </div>
</template>

<script>
export default {

  props: {
    initPath: String,
    isDir: Boolean,
  },
  data() {
    return {
      name: "",
      message: "",
      errorType: ""
    }
  },

  computed: {
    title() {
      return this.isDir ? "Create Folder" : "Create File";
    }
  },
  methods: {
    create() {
      let path = "";
      if (this.isDir) {
        path = `${this.initPath}${this.name}/`
        this.$api.file.mkdir(path).then(res => {
          if (res.data.success == 200) {
            this.successCallBack();
          } else {
            this.errorCallBack(res.data.message);
          }
        })
      } else {
        path = `${this.initPath}${this.name}`
        this.$api.file.create(path).then(res => {
          if (res.data.success == 200) {
            this.successCallBack();
          } else {
            this.errorType = "is-danger"
            this.errorCallBack(res.data.message);
          }
        })
      }
    },
    successCallBack() {
      this.message = ""
      this.errorType = ""
      this.$emit('close');
      this.$emit("reloadPath")
    },
    errorCallBack(message) {
      this.errorType = "is-danger"
      this.message = message
    },
    btKeyUp(e){
        console.log(e);
    }
  },
}
</script>
