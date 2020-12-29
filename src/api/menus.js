/**
 * 文件名称：权限接口文件
 * 归属菜单：权限管理-权限列表
 */
import request from "@/utils/request";

// 查询
export function getMenus(params) {
  return request({
    url: `api/menu/${params.page}/${params.size}`,
    method: "get",
  });
}

// 新增
export function addMenu(data) {
  return request({
    url: "api/menu",
    method: "post",
    data,
  });
}
