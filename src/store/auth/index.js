import UserModel from '@/models/users.model'
export default {
    namespaced: true,
    state: () => ({
        isLogin: false,
        stores: [],
        userInfo: {
            id: 0,
            nickname: '',
            isAdmin: false
        }
    }),
    mutations: {
        setStores (state, payload) {
            state.stores = payload
        },
        setLogin (state) {
            state.isLogin = UserModel.isLogin()
        },
        setUserInfo (state, payload) {
            if(payload === null) {
                state.userInfo.id = 0
                state.userInfo.nickname = ''
                state.userInfo.isAdmin = false
            }
            else {
                for(let column in payload) {
                    if(typeof state.userInfo[column] !== 'undefined') {
                        state.userInfo[column] = payload[column]
                    }
                }
            }
        }
    },
    actions: {
        async GetMyInfo ({state}) {
            await UserModel
                .getInfo()
                .then(res => {
                    state.userInfo = res
                })
        }
    },
    getters: {
        stores (state) {
            return state.stores
        },
        isLogin (state) {
            return state.isLogin
        },
        userInfo (state) {
            return state.userInfo
        }
    }
}