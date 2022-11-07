import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

import BackOfficeRoutes from './BackOffice'

import UsersModel from '@/models/users.model'

const routes = [
    
    ...BackOfficeRoutes,
    {
        path: '*',
        name:'PageNotFound',
        component: () => import(/* webpackChunkName: "admin.dashboard" */ '@/views/Errors/PageError404.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    console.log(to);
    // 해당페이지의 테마를 meta속성에서 가져오고, 가져올 레이아웃을 정의한다.
    // const theme = (typeof to.meta !== 'undefined' && typeof to.meta.theme !== 'undefined' && to.meta.theme === 'BackOffice') ? 'BackOffice' : 'FrontEnd'
    store.commit('layout/setLayout', 'BackOffice')

    // 헤당페이지에 접근할때 로그인이 필요한지 여부를 meta 속성에서 가져온다.
    let requiredLogin = typeof to.meta !== 'undefined'
        && typeof to.meta.requiredLogin !== 'undefined'
        && to.meta.requiredLogin === true

    // 해당페이지에 관리자 페이지 접근권한이 필요한지 여부를 meta 속성에서 가져온다.
    const requiredAdmin = typeof to.meta !== 'undefined'
        && typeof to.meta.requiredAdmin !== 'undefined'
        && to.meta.requiredAdmin === true

    // 관리자 페이지 접근 권한이 필요한경우, 로그인 필요여부도 자동으로 true로 변환한다.
    if(requiredAdmin) {
        requiredLogin = true
    }

    if(requiredLogin) {
        if(UsersModel.isLogin()) {
            if(requiredAdmin) {
                if(store.getters["authorize/userInfo"].isAdmin === true) {
                    next()
                }
                else {
                    Vue.swal('Error', '해당페이지에 접근할 권한이 없습니다.', 'error')
                    next('/')
                }
            }
            else {
                next()
            }
        }
        else {
            next({path:'/sign-in', query:{redirectUri: to.fullPath}})
        }
    }
    else {
        next()
    }
})

export default router
