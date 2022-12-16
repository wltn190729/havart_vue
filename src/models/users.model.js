/**
 * 사용자 관련 Model
 *
 * @author 장선근
 */

import vue from "vue";
import store from "@/store";
import router from "@/router"
import jwt from "@/plugins/jwt";

const exportObject =  {
  isLogin: () => {
      const accessToken = localStorage.getItem( 'accessToken' )
      return !!(accessToken && accessToken !== 'undefined')
  },
  GetUserList: async( params ) =>
  {
      return await jwt.axios
          .get('/admin/users', {params})
  },
  GetAdminList: async( params ) =>
  {
      return await jwt.axios
          .get('/admin/admin_users', params)
  },

  GetUserListSearch: async( params ) =>
  {
      return await jwt.axios
          .get('/admin/users/search', {params})

  },
  GetAdminListSearch: async(params) => {

    return await jwt.axios.get(`/admin/admin_users/search`, {params})
  },
  UpdateUserInfo: async (formData) =>
  {
      return await jwt.axios
          .patch(`/admin/users/modify/${formData.searchData.search_value}`, formData)
  },
  /**관리자 권한 삭제 */
  DeleteAdmin: async (email, data) => {
    return await jwt.axios
            .patch(`/admin/admin_users/modify/${email}`,data);
  },

  /**
   * 사용자 로그인 처리 요청
   */
  loginProcess: async (payload) => {
    // console.log(payload);
    return await jwt.axios
      .post("admin/auth/login", payload)
      .then((res) => {
        //로그인 응답 내용 확인후 토큰과 id값들 저장하기
        console.log(res);
        if(typeof res.data.accessToken !== 'undefined') {
          
          const userInfo = {
            nickname: res.data.nickname,
            isAdmin: true,
          } 
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshTokenId)

            store.commit('authorize/setLogin', true)
            store.commit('authorize/setUserInfo', userInfo)
        }
        else {
            vue.swal('Error', '사용자 로그인에 실패하였습니다','error')
            store.commit('authorize/setLogin', false)
            store.commit('authorize/setUserInfo', null)
            
            throw new Error('사용자 로그인에 실패')
        }
      }).catch(() => {
        vue.swal('Error', '사용자 로그인에 실패하였습니다','error')
            store.commit('authorize/setLogin', false)
            store.commit('authorize/setUserInfo', null)
            throw new Error('사용자 로그인에 실패')
      
      })
  },

  /**
   * 사용자 로그아웃 확인 박스
   */
  signOutProcess: () => {
    vue
      .swal({
        title: "로그아웃",
        text: "로그아웃 하시겠습니까?",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "로그아웃",
        cancelButtonText: "취소",
      })
      .then((result) => {
        if (result.isConfirmed) {
          exportObject.signOut();
          location.reload();
        }
      });
  },

  /**
   * 사용자 로그아웃처리
   */
  signOut: () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    store.commit("authorize/setLogin", false);
    store.commit("authorize/setUserInfo", null);
    location.reload();
  },

  /**
   * 회원가입 처리 요청
   */
  registerProcess: async (payload) => {
    return await jwt.axios.post("admin/auth/sign_up", {
      nickname: payload.nickname,
      password: payload.password,
      email: payload.email,
      def_name: payload.def_name,
      artist_id : payload.artist_id
    });
  },

  /*
   * 권한 목록 가져오기
   */
  GetAuthDef: async () => {
    return await jwt.axios.get(`admin/auth/auth_access_list`);
  },
};

export default exportObject;
