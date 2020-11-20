import axios from "axios";
// import router from '../router'
const service = axios.create({
  // baseURL: 'http://home.brlhcn.com:8099/',// 请求根路径
  // timeout: 4000 // 请求超时时间
});

// 请求头添加token
service.interceptors.request.use(
  (config, type = "application/json;charset=UTF-8") => {
    config.headers = {
      "Content-Type": type,
      Accept: "application/json;charset=UTF-8",
    };
    return config;
  }
);
// response 拦截器
service.interceptors.response.use(
  (response) => {
    const code = response.status;
    if (code < 200 || code > 300) {
      return Promise.reject("error");
    } else {
      // if (response.data.data) {
      //   return response.data.data;
      // } else {
      return response.data;
      // }
    }
  },
  (error) => {
    let code = 0;
    try {
      code = error.response.status;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        // Message.error({
        //     title: '网络请求超时'
        // })
        return Promise.reject(error);
      }
    }
    if (code) {
      if (code === 498) {
        // 登录状态已过期
        // router.push({
        // 	path: "login"
        // });
      } else if (code === 500) {
        // 提示
      }
    } else {
      // 接口请求失败
    }
    return Promise.reject(error);
  }
);
export default service;
