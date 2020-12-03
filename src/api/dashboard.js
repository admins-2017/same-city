import request from "@/utils/request";

// 首页数据
export function getIndex() {
  return request({
    url: "/api/index",
    method: "get",
  });
}
