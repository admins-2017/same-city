import request from "@/utils/request";

// 查询
export function getClient(params) {
  return request({
    url: "/api/client/query",
    method: "get",
    params,
  });
}

// 导出
export function exportClient(params) {
  return request({
    url: "/api/client/export",
    method: "get",
    params,
    responseType: "blob",
  });
}
