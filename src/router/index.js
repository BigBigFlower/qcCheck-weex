import Vue from 'vue'
import Router from 'vue-router'
import qcCheck from '../views/qcCheck.vue'
import qcItemDetail from '../views/qcItemDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/qcCheck',
    component: qcCheck,
    name: 'qcCheck'
  }, {
    path: '/qcItemDetail',
    component: qcItemDetail,
    name: 'qcItemDetail'
  }, {
    path: '/',
    redirect: '/qcCheck'
  }]
})
