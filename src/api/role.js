/**
 * 文件名称：角色管理接口文件
 * 归属菜单：角色管理
 */
import request from "@/utils/request";

// 查询所有角色
export function getAllRole(params) {
  return request({
    url: `/api/role/${params.page}/${params.size}`,
    method: "get",
  });
}

// 根据名称查询
export function getRoleByName(name, page, size) {
  return request({
    url: `/api/role/like/${name}/${page}/${size}`,
    method: "get",
  });
}

// 删除角色
export function delRole(id) {
  return request({
    url: `/api/role/${id}`,
    method: "delete",
  });
}
