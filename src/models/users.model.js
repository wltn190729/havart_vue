/**
 * 사용자 관련 Model
 *
 * @author 장선근
 */

import vue from 'vue'
import store from '@/store'
import jwt from '@/plugins/jwt'

const exportObject =  {
    isLogin: () => {
        const accessToken = localStorage.getItem( 'accessToken' )
        return !!(accessToken && accessToken !== 'undefined')
    },
    GetUserList: async( params ) =>
    {
        return await jwt.axios
            .get('/admin/users', params)

    },
    GetUserListSearch: async( params ) =>
    {
        return await jwt.axios
            .get('/admin/users/search', {params})

    },
    UpdateUserInfo: async (formData) =>
    {
        return await jwt.axios
            .patch(`/admin/users/modify/${formData.searchData.search_value}`, formData)
    },
    getInfo: async() => {
        let info = {
            id: 0,
            nickname: '손님',
            loginEmail: '',
            userHp: '',
            thumb:'',
            agree_privacy: false,
            agree_marketing: false,
            regDt: '',
            updDt: '',
            favoriteTaste: []
        }
        // 사용처 확인 필요... (웨딩로그 코드...)
        // await jwt.axios
        //     .get('/v1/users/me')
        //     .then((res)=> {
        //         for(let key in res.data.result) {
        //             if(typeof info[key] !== 'undefined') {
        //                 info[key] = res.data.result[key]
        //             }
        //         }
        //     })

        return info
    },

    /**
     * 사용자 로그인 처리 요청
     */
    loginProcess: async (payload) => {
        console.log(payload)
        return await jwt
            .axios
            .post('admin/auth/login', {
                uid: payload.uid,
                password: payload.password
            })
            .then((res) => {
            //로그인 응답 내용 확인후 토큰과 id값들 저장하기
                console.log(res);
                // if(typeof res.data.accessToken !== 'undefined' && typeof res.data.userData !== 'undefined') {
                //     localStorage.setItem('uid', JSON.stringify(res.data.userData))
                //     localStorage.setItem('accessToken', res.data.accessToken)
                //     localStorage.setItem('refreshToken', res.data.refreshToken)

                //     store.commit('authorize/setLogin', true)
                //     store.commit('authorize/setUserInfo', res.data.userData)
                // }
                // else {
                //     vue.swal('Error', '사용자 로그인에 실패하였습니다','error')
                //     store.commit('authorize/setLogin', false)
                //     store.commit('authorize/setUserInfo', null)
                //     throw new Error('사용자 로그인에 실패')
                // }
            })
    },

    /**
     * 사용자 로그아웃 확인 박스
     */
    signOutProcess: () => {
        vue.swal({
            title: '로그아웃',
            text: '로그아웃 하시겠습니까?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소'
        }).then(result => {
            if(result.isConfirmed) {
                exportObject.signOut()
                location.reload()
            }
        })
    },

    /**
     * 사용자 로그아웃처리
     */
    signOut: () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        store.commit('authorize/setLogin', false)
        store.commit('authorize/setUserInfo', null)
        location.reload()
    },

    /**
     * 회원가입 처리 요청
     */
    registerProcess: async(payload) => {
        return await
            jwt.axios
                .post('auth/user/sign_up', {
                    uid : payload.uid,
                    nickname: payload.nickname,
                    password: payload.password,
                    email:payload.email,
                })
    },
}

export default exportObject