export default {
  namespaced: true,
  state: () => ({
    layoutLoading: false,
    theme: 'BackOffice',
  }),
  mutations: {
    setLayout(state, payload) {
      state.theme = payload;
    },
    setLoading(state, payload) {
      
      state.layoutLoading = payload;
    },
  },
  actions: {},
  getters: {
    theme(state) {
      return state.theme;
    },
    layoutLoading(state) {
      // console.log(state);
      return state.layoutLoading;
    },
  },
};
