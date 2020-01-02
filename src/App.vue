<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}

.main-content td button:nth-child(n + 2),
.main-content td a:nth-child(n + 2),
.main-content .ivu-col button:nth-child(n + 2),
.main-content .ivu-col a:nth-child(n + 2) {
  margin-left: 5px;
}
</style>
