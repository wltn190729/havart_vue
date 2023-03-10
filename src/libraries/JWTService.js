import vue from "vue";
import store from "@/store";
import $axios from "axios";

export default class JwtService {
  axios = null;

  // RefreshToken 용 변수
  isAlreadyFetchingAccessToken = false;
  subscribers = [];
//http://192.168.0.21:3000
  constructor() {
    this.axios = $axios.create({
      // baseURL : process.env.NODE_ENV === 'production' ? '': 'http://118.67.135.111:4000',
      baseURL:
        process.env.NODE_ENV === "pod" ? "http://api.havart.kr" : "http://192.168.0.21:4000/dev",
      timeout: 10000,
      withCredentials: true,
    });

    this.axios.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        store.commit("layout/setLoading", true);

        const accessToken = this.getToken();
        // console.log(accessToken);
        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      (response) => {
        store.commit("layout/setLoading", false);
        return response;
      },
      (error) => {
        store.commit("layout/setLoading", false);

        const { config } = error;
        const originalRequest = config;
// 
        // console.log(error);
        //관리자 계정 추가시 에러 코드 400 으로 중간 인터셉트

        if(error.response.data.message === 'User id already used!'){
          vue.swal("Error", '현재 사용중인 계정입니다.', "error");
        }


          if (error.response.status === 401) {
            if (!this.isAlreadyFetchingAccessToken) {
              this.isAlreadyFetchingAccessToken = true;
              this.refreshToken().then((r) => {
                this.isAlreadyFetchingAccessToken = false;

                // Update accessToken in localStorage
                this.setToken(r.data.accessToken);
                this.setRefreshToken(r.data.refreshTokenId);

                store.commit("authorize/setLogin");

                this.onAccessTokenFetched(r.data.accessToken);
              });
            } else {
              window.localStorage.removeItem("userInfo");
              window.localStorage.removeItem("accessToken");
              window.localStorage.removeItem("refreshToken");
              originalRequest.headers.Authorization = null;

              store.commit("authorize/setLogin");
            }

            const retryOriginalRequest = new Promise((resolve) => {
              this.addSubscriber((accessToken) => {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                resolve(this.axios(originalRequest));
              });
            });
            return retryOriginalRequest;
          } else {
            let message = "잘못된 요청입니다";

            if (
              typeof error.response.data !== "undefined" &&
              typeof error.response.data.error !== "undefined" &&
              error.response.data.error
            ) {
              message = error.response.data.error;
            } else {
              switch (error.response.status) {
                case 0:
                  message =
                    "REST API 서버에 접근할 수 없습니다\n서버 관리자에게 문의하세요";
                  break;
                case 400:
                  message = "잘못된 요청입니다.";
                  break;
                case 500:
                  message = "서버에서 처리중 오류가 발생하였습니다.";
                  break;
              }
            }

            vue.swal("Error", message, "error");

            return Promise.reject(error);
          }
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  setToken(value) {
    localStorage.setItem("accessToken", value);
  }

  setRefreshToken(value) {
    localStorage.setItem("refreshToken", value);
  }

  refreshToken() {
    return this.axios.post("admin/auth/refresh", {
      id: this.getRefreshToken(),
    });
  }
}
