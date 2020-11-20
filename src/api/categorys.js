import request from "@/utils/request";

// 商品分类-获取所有分类
export function getClassification() {
  return request({
    url: "/api/classification",
    method: "get",
  });
}

// 商品分类-查询分类
export function queryClassification(name) {
  return request({
    url: `api/classification/${name}`,
    method: "get",
  });
}
