/**
 * 文件名称：商品接口文件
 * 归属菜单：商品管理-商品列表
 */
import request from "@/utils/request";

// // 查询
// export function getCommodity(params) {
//   return request({
//     url: `api/commodity/${params.page}/${params.size}`,
//     method: "get",
//   });
// }

// 查询
export function getCommodity(params) {
  return request({
    url: "api/commodity",
    method: "get",
    params,
  });
}
