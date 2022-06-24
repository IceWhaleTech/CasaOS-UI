<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-22 22:20:20
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-24 17:56:45
 * @FilePath: /CasaOS-UI/src/components/wallpaper/WallpaperModal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Change Wallpaper')}}</h3>
      </div>

    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="preview-card">
        <div class="preview-image" :style="backgroundStyleObj">
          <b-image :src="require('@/assets/background/preview-widget.svg')" class="preview-widget"></b-image>
          <b-image :src="require('@/assets/background/blank.png')"></b-image>
        </div>
      </div>

      <div class="columns mt-5 mb-5 is-variable is-2">
        <div class="column" v-for="(item,index) in wallpaperItems" :key="'wallpaper'+index">
          <div class="image-list-item is-clickable" :class="{active:checkActive(item.path)}" @click="changeWallpaper(item.path)">
            <b-image :src="item.path"></b-image>
          </div>
        </div>

        <div class="column is-relative is-one-quarter">
          <div class="upload-button-container is-clickable" :class="{active:checkActiveFrom('Upload')}" @click="changeCustomWallpaper">
            <div class="upload-button is-flex is-align-items-center is-justify-content-center ">
              <b-icon pack="casa" icon="picture-upload" size="is-large"></b-icon>
            </div>
          </div>

        </div>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Cancel')" @click="$emit('close')" rounded />
        <b-button :label="$t('Apply')" type="is-primary" rounded expaned @click="saveChange" :loading="isLoading" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
const wallpaperConfig = "wallpaper"
export default {
  data() {
    return {
      isLoading: false,
      user_id: localStorage.getItem("user_id"),
      wallpaperItems: [
        {
          name: "Built-in wallpaper 1",
          path: require('@/assets/background/wallpaper01.jpg')
        },
        {
          name: "Built-in wallpaper 2",
          path: require('@/assets/background/wallpaper02.jpg')
        }
      ],
      backgroundStyleObj: {
        backgroundImage: `url(${this.$store.state.wallpaperObject.path})`
      },
      path: this.$store.state.wallpaperObject.path,
      from: this.$store.state.wallpaperObject.from
    }
  },
  components: {

  },
  mounted() {
    console.log(this.wallpaperItems);
  },
  methods: {
    saveChange() {
      let data = {
        path: this.path,
        from: this.from
      }
      this.isLoading = true
      this.$api.user.postCustomConfig(this.user_id, wallpaperConfig, data).then(res => {
        this.isLoading = false
        if (res.data.success === 200) {

          this.$emit("close")
          setTimeout(() => {
            this.$store.commit('changeWallpaper', {
              path: res.data.data.path,
              from: res.data.data.from
            })
          }, 300)

        } else {
          this.$buefy.toast.open({
            message: this.$t('Save failed, please try again!'),
            type: 'is-danger'
          })
        }

      })
    },
    changeWallpaper(path) {
      this.backgroundStyleObj.backgroundImage = `url(${path})`
      this.path = path
      this.from = "Built-in"
    },
    changeCustomWallpaper() {
      const uploadPath = require('@/assets/background/1.png')
      this.backgroundStyleObj.backgroundImage = `url(${uploadPath})`
      this.path = uploadPath
      this.from = "Upload"
    },
    checkActive(path) {
      return this.path == path
    },
    checkActiveFrom(from) {
      return this.from == from
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-card {
  margin-left: 2.625rem;
  margin-right: 2.625rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
  border: 6px solid transparent;
  border-radius: 16px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #fff, #fff),
    linear-gradient(
      108.27deg,
      rgba(57, 60, 64, 1) 1.44%,
      rgba(92, 96, 102, 1) 55.8%,
      rgba(34, 36, 38, 1) 110.95%
    );
  box-shadow: 0px 16px 24px rgba(115, 120, 128, 0.4);
  overflow: hidden;
  .preview-image {
    position: relative;
    overflow: hidden;

    .preview-widget {
      position: absolute;
      left: 8.3333%;
      top: 14.81%;
      width: 23.96%;
      z-index: 1;
    }
  }
}

.image-list-item,
.upload-button-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  transition: border-color 0.3s ease;

  &.active {
    border-color: $primary;
  }
  &:hover {
    border-color: $primary;
  }
  .image {
    border-radius: 4px;
    border: #fff 1px solid;
    overflow: hidden;
    background-size: cover;
  }
  .upload-button {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: #fff 1px solid;
    overflow: hidden;
    background-color: rgba(240, 242, 245, 1);
  }
}
.preview-image {
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  background-position: center center;
  transition: background-image 0.3s ease;
}
</style>