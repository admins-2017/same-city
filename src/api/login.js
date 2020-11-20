import request from "@/utils/request";

// 登录-获取验证码
export function getCode() {
  return request({
    url: "/api/user/code",
    method: "get",
  });
}

// 登录
export function login(data) {
  return request(
    {
      url: `api/login/userLogin`,
      data: data,
      method: "post",
    },
    "multipart/form-data"
  );
}
