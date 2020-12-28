<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style lang="less">
html,
body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
}
#app {
  height: 100%;
  router-view {
    height: 100%;
  }
}
</style>
