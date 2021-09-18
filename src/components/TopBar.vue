<template>
  <div class="navbar top-bar is-flex is-align-items-center">
    <div class="navbar-brand ml-3">
      <b-dropdown aria-role="list" class="navbar-item">
        <template #trigger>
          <p role="button">
            <b-icon pack="fas" icon="sliders-h" >
            </b-icon>
          </p>

        </template>

        <!-- <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
        <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item> -->
      </b-dropdown>

    </div>

    <div class="navbar-menu">
      <div class="navbar-end mr-3">
        <b-icon pack="far" icon="comment-alt" ></b-icon>
      </div>
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>