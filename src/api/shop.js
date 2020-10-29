import request from "@/utils/request";

// 查询销售订单-无查询条件
export function getCommodityList(id) {
  return request({
    url: `api/inventory/${id}/`,
    method: "get",
  });
}
