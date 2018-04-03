<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 40px;*/
  /*margin-top: 40px;*/
  font-size: 14px;
}
body {
  -webkit-text-size-adjust: 100% !important;
  -ms-text-size-adjust: 100% !important;
}
</style>
