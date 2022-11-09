/**
 * 사용자 관련 Model
 *
 * @author 장선근
 */

import vue from "vue";
import store from "@/store";
import jwt from "@/plugins/jwt";

const exportObject = {
  isLogin: () => {
    const accessToken = localStorage.getItem("accessToken");
    return !!(accessToken && accessToken !== "undefined");
  },
  GetUserList: async (params) => {
    console.log(params);
    // return await jwt.axios
    //     .get('/v1/users', params)
  },

  /**
   * 회원가입 처리 요청
   */
  registerProcess: async (payload) => {
    return await jwt.axios.post("admin/auth/sign_up", {
      uid: payload.uid,
      nickname: payload.nickname,
      password: payload.password,
      email: payload.email,
    });
  },

  /*
   * 작품 목록 가져오기
   */
  GetItemsList: async () => {
    return await jwt.axios.get(`admin/items`);
  },

  /*
   * 작품 검색
   */
  SearchItemsList: async (search_key, search_value) => {
    console.log(search_key, "search_key", search_value, "search_value");
    const test = {
      search_key,
      search_value,
    };
    return await jwt.axios.get(`admin/items/search`, {
      contentType: "application/json; charset=utf-8;",
      params: {
        search_key: search_key,
        search_value: search_value,
      },
    });
  },
};

export default exportObject;
