import Vue from 'vue'
import weex from 'weex-vue-render'
import index from './src/index.vue'
import router from './src/router/index'
index.el = '#root'
index.router = router

weex.init(Vue)

export default new Vue(index)

