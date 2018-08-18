// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
// require('../../evalDOM')({
//   background: 'red',
//   animation: 'opacity 1s linear infinite;'
// }).then(skeletonHTML => {
//   console.log(skeletonHTML)
// }).catch(e => {
//   console.error(e)
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
