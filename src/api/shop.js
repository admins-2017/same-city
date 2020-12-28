import request from "@/utils/request";

// 查询所有商铺
export function getAllShop() {
  return request({
    url: "api/shop",
    method: "get",
  });
}

// 根据名称查询商铺
export function getShop(name) {
  return request({
    url: `/api/shop/${name}/`,
    method: "get",
  });
}
