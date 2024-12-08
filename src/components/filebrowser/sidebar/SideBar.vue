<template>
  <div class="nav-bar is-flex is-flex-direction-column">
    <div class="is-flex-grow-1 is-flex-shrink-1 nav-bar-top scrollbars-light">
      <!-- Files Start -->
      <div class="files-section">
        <!--  storage settings requirement document -->
        <div class="is-flex is-align-items-center pt-3">
          <div class="is-flex-grow-1">
            <h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">
              {{ $t("Files") }}
            </h3>
          </div>
          <div
            v-show="hasMergerFunction"
            class="is-flex-shrink-0 mr-5"
            @click="showStorageSettingsModal"
          >
            <b-icon custom-size="mdi-18px" icon="cog-outline"></b-icon>
          </div>
        </div>
        <div class="list-container scrollbars-light pt-0 is-flex-grow-1">
          <tree-list
            ref="navBar"
            :autoLoad="true"
            :isActive="pageType == `file`"
            :path="rootPath"
          ></tree-list>
        </div>
      </div>
      <!-- Files End -->

      <!-- Mounted Start -->
      <div class="mounted-section">
        <div class="is-flex is-align-items-center">
          <div class="is-flex-grow-1">
            <h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">
              {{ $t("Location") }}
            </h3>
          </div>
          <div class="is-flex-shrink-0 mr-5">
            <mount-action-button></mount-action-button>
          </div>
        </div>

        <div class="list-container pt-0 is-flex-grow-1">
          <mount-list
            ref="mountedList"
            :autoLoad="true"
            :hasMergerFunction="hasMergerFunction"
            :isActive="pageType == `file`"
            :path="rootPath"
          ></mount-list>
        </div>
      </div>
      <!-- Mounted End -->
    </div>

    <!-- Bottom Action Start -->
    <div class="bottom-area">
      <drop-entry-button
        :active="pageType == `drop`"
        :title="$t('FilesDrop')"
        @open="showDropPage"
      ></drop-entry-button>
      <share-entry-button
        :active="pageType == `share`"
        @open="showSharedList"
      ></share-entry-button>
    </div>
    <!-- Bottom Action End -->
  </div>
</template>

<script>
export default {
  name: "side-bar",
};
</script>

