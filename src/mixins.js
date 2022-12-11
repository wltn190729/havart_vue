import { mapGetters } from 'vuex';
import usersModel from '@/models/users.model';

export default {
  computed: {
    ...mapGetters({
      layoutLoading: 'layout/layoutLoading',
      isLogin: 'authorize/isLogin',

      loginUser: 'authorize/userInfo',
    }),
  },
  methods: {
    signOut() {
      usersModel.signOutProcess();
    },
  },
};
