<template>
  <div class="not-found">
    <h1>Page not found</h1>
    <pv-button class="pv-button-link" label="Return home" icon="pi pi-arrow-left" @click="goHome" />
  </div>
</template>

<script>
export default {
  name: "not-found.component",
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },
  },
}
</script>

<style scoped>

</style>