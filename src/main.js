import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/axios.js'
import './assets/css/index.less'
import './assets/css/element-ui.less'
import VueCron from 'vue-cron'

Vue.config.productionTip = false

Vue.use(VueCron);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
