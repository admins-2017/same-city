import request from "@/utils/request";

// 查询店铺-无查询条件
export function getShopList(page, count) {
  return request({
    url: `api/shop/1/${page}/${count}`,
    method: "get",
  });
}
