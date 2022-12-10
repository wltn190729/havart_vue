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

  /**
   * 작품 등록
   */
  registerItem: async (formData) => {
    return await jwt.axios.post("/admin/items", formData);
  },
  /**
   * 작품 승인 여부 수정
   */
  fetchItem: async (data) => { 
    return await jwt.axios.patch("/admin/items/approval", data);
  },
  updateState: async (data) => {
    return await jwt.axios.patch("/admin/items/state", data);
  },
  /**
   * 작품 수정
   */
  updateItem: async (id , formData) => {
    return await jwt.axios.patch(`/admin/items/${id}`, formData);
  },

  /**
   * 작품 삭제
   */
  deleteItem: async (id) => {
    return await jwt.axios.delete(`/admin/items/${id}`);
  },

  approvalItem: async (payload) => {
    return await jwt.axios.patch(`/admin/items/approval`, payload);
  },

  /*
   * 작품 목록 가져오기
   */
  GetItemsList: async () => {
    return await jwt.axios.get(`admin/items`);
  },

 /*
 * 작품 목록 가져오기
 */
  GetItemsSearch: async (param) => {
    return await jwt.axios.get(`/admin/items/search`, {
      contentType: "application/json; charset=utf-8;",
      params: {
        search_key: param.search_key,
        search_value: param.search_value,
      },
    });
  },
 

  /**
   * 사이즈 목록 가져오기
   */
  GetSizeList: async () => {
    return await jwt.axios.get(`/admin/sizes`);
  },


  /**
   * 테마 목록 가져오기
   */
  GetThemeList: async () => {
    return await jwt.axios.get(`/admin/themes`);
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
