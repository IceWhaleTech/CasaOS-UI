<script>
import events from '@/events/events'
import ShareListView from './ShareListView.vue'

export default {

  components: {
    ShareListView,
    SidebarMenuButton: () => import('../components/SidebarMenuButton.vue'),
  },
  data() {
    return {
      list: [],
      isLoading: true,
    }
  },

  mounted() {
    this.getSharedList()
  },

  methods: {
    async getSharedList() {
      this.isLoading = true
      try {
        const list = await this.$api.samba.getShares()
        this.isLoading = false
        this.list = list.data.data.map((item) => {
          const name = item.path.split('/').pop()
          return {
            id: item.id,
            date: '',
            isSelected: false,
            is_dir: true,
            name,
            path: item.path,
            size: 0,
            write: false,
          }
        })
      }
      catch {
        this.isLoading = false
        this.list = []
      }
    },

    selectShare() {
      this.$EventBus.$emit(events.SELECT_SHARE)
    },
  },
}
</script>

<template>
  <div class="content is-flex-grow-1">
    <!-- Header Start -->
    <header class="modal-card-head">
      <!-- SideBar Button Start -->
      <SidebarMenuButton />
      <!-- SideBar Button End -->
      <div
        id="bread-container"
        class="is-flex-grow-1 is-flex breadcrumb-container"
      >
        <h3 class="title is-header mb-0">
          {{ $t("Shared Folders") }}
        </h3>
      </div>
      <b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
    </header>
    <!-- Header End -->

    <ShareListView :is-loading="isLoading" :list-data="list">
      <div>
        <div class="buttons is-justify-content-center">
          <b-image
            :src="require('@/assets/img/share/share-empty.svg')"
            class="is-160x160"
          />
        </div>
        {{
          $t(
            "Follow the guide to start sharing your files on the local network.",
          )
        }}
        <div class="buttons is-justify-content-center pt-3">
          <b-button rounded type="is-primary" @click="selectShare">
            {{
              $t("Start")
            }}
          </b-button>
        </div>
      </div>
    </ShareListView>
    <b-loading v-model="isLoading" :is-full-page="false" />
  </div>
</template>
