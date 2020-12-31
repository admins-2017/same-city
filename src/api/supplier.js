import request from "@/utils/request";

// 查询
export function getSupplier(params) {
  return request({
    url: "/api/supplier/query",
    method: "get",
    params,
  });
}

// 导出
export function exportSupplier(params) {
  return request({
    url: "/api/supplier/export",
    method: "get",
    params,
    responseType: "blob",
  });
}
