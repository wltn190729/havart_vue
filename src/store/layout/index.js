export default {
    namespaced: true,
    state: () => ({
        isLoading: false,
        theme: 'BackOffice'
    }),
    mutations: {
        setLayout (state, payload) {
            state.theme = payload
        },
        setLoading (state, payload) {
            state.isLoading = payload
        }
    },
    actions: {

    },
    getters: {
        theme (state) {
            return state.theme
        },
        isLoading (state) {
            return state.isLoading
        }
    }
}