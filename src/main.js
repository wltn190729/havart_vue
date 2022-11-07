import Vue from 'vue'
import './plugins/jwt'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// SweetAlert
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
const options = {
  confirmButtonColor: '#f95959',
  cancelButtonColor: '#2c3e50',
};
Vue.use(VueSweetalert2, options)

// Date 형식을 Formatting 하는 스크립트
import '@/plugins/dateFormat'

// Mixins 불러오기
import mixins from "./mixins";
Vue.mixin(mixins)

// 관리자용 CSS 불러오기
import "@/scss/admin/admin.scss"

// 새로고침등을 했을때 로그인이 되어있는지 여부를 다시 체크
import userModel from '@/models/users.model'
if(userModel.isLogin())
{
  store.commit('authorize/setLogin', true)
  store.commit('authorize/setUserInfo', JSON.parse( window.localStorage.getItem('userInfo')))
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
