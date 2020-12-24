import request from "@/utils/request";

// 查询-无查询条件
export function getRecords(page, size) {
  return request({
    url: `api/record/${page}/${size}`,
    method: "get",
  });
}
