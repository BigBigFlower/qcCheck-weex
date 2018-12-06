<template>
  <div class="wrapper">
    <router-view style="flex:1"></router-view>
  </div>
</template>

<script>
import router from './router/index.js'

export default {
  name: 'App',
  router,
  data () {
    return {
    }
  },
  created () {
    router.push('/qcCheck')
  }
}
</script>

<style scoped>
  .wrapper {
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 424px;
    height: 200px;
  }
  .greeting {
    text-align: center;
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }
  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  }
</style>
