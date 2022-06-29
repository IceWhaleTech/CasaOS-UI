<template>
  <div class="tr-wrapper rdata">
    <div class="tr is-unselectable" :class="{'isCutting':getCardState(item)}">
      <div class="td">
        <div class="cover">
          <div :class="item | coverType">
            <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
          </div>
        </div>
        <p class="text">
          {{item.name}}
        </p>
      </div>
      <div class="td">{{item.size | renderSize}}</div>
      <div class="td " :class="{'action-td':!isDownloading}">
        <div class="is-flex is-flex-direction-column" v-if="isDownloading">
          <div class="is-flex">
            <div class="status-text has-text-left is-flex-grow-1">{{speed}}</div>
            <div>{{remaining}}</div>
          </div>

          <b-progress size="is-small" type="is-primary" :value="progress"></b-progress>
        </div>
        <div class="mr-2 is-flex is-justify-content-flex-end is-flex-grow-1">
          <b-tooltip :label="$t('D-Retry')" type="is-dark" v-if="isDownloading" append-to-body>
            <span data-role="icon" class="action-icon icon " @click="retry" v-if="this.item.state == '4'">
              <b-icon icon="replay" size="is-small"></b-icon>
            </span>
          </b-tooltip>
          <b-tooltip :label="isDownloading?$t('Cancel Download'):$t('Delete this record')" type="is-danger" append-to-body>
            <span data-role="icon" class="action-icon icon" @click="remove">
              <b-icon icon="close" size="is-small"></b-icon>
            </span>
          </b-tooltip>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import format from 'format-duration'
export default {
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: () => {
      },

    },
    isDownloading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      speed: "",
      progress: 0,
      remaining: ""
    }
  },
  watch: {
    // Watch if initData changes
    item: {
      handler(newval, oldval) {
        this.remaining = ""
        let remaining = newval.already > 0 ? Math.floor((newval.size / newval.block_size - newval.already) / (newval.already - oldval.already)) : 0
        this.progress = 0
        switch (this.item.state) {
          case 0:
            this.speed = this.$t('Waiting')
            break;
          case 1:
            // eslint-disable-next-line no-case-declarations
            let currentSpeed = Math.floor(newval.already * newval.block_size / newval.duration)
            this.speed = this.renderSize(currentSpeed) + "/s"
            this.progress = Math.floor((newval.already / newval.length) * 100)
            this.remaining = remaining == Infinity ? "Infinity" : format(1000 * remaining)
            break;
          case 2:
            this.speed = this.$t('Paused')
            break;
          case 3:
            this.speed = this.$t('Finishing')
            this.progress = 100
            this.remaining = ""
            break;
          case 4:
            this.speed = this.$t('Error')
            break;

          default:
            break;
        }
      },
      deep: true
    },
  },

  methods: {
    retry() {
      this.$api.person.reDownload(this.item.uuid)
    },
    remove() {
      if (this.isDownloading) {
        this.$api.person.deleteDownloadRecord(this.item.uuid).then(res => {
          let message = ""
          let type = ""
          if (res.data.success == 200) {
            message = this.$t('Download was cancelled')
            type = "is-success"
            this.$emit("deleteItem", this.item.uuid)
          } else {
            message = this.$t('Cancel download failed')
            type = "is-danger"
          }
          this.$buefy.toast.open({
            message: message,
            type: type
          })

        })
      } else {
        this.$api.person.deleteDownloadRecord(this.item.uuid).then(res => {
          let message = ""
          let type = ""
          if (res.data.success == 200) {
            message = this.$t('Record deleted')
            type = "is-success"
            this.$emit("deleteItem", this.item.uuid)
          } else {
            message = this.$t('Delete record failed')
            type = "is-danger"
          }
          this.$buefy.toast.open({
            message: message,
            type: type
          })

        })
      }

    }

  },
}
</script>

<style>
</style>