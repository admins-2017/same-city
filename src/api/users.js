/**
 * 文件名称：用户管理接口文件
 * 归属菜单：用户管理
 */
import request from "@/utils/request";

// 查询所有用户
export function getAllUser(params) {
  return request({
    url: `/api/user/all/${params.page}/${params.size}/`,
    method: "get",
  });
}

// 根据店铺查询用户
export function getShopUser(shopId, params) {
  return request({
    url: `/api/user/shop/${shopId}/${params.page}/${params.size}/`,
    method: "get",
  });
}

// 根据名称查询用户
export function getUserByName(name, page, size) {
  return request({
    url: `/api/user/${name}/${page}/${size}/`,
    method: "get",
  });
}

// 停用用户
export function stopUser(id) {
  return request({
    url: `/api/user/stop/${id}`,
    method: "put",
  });
}

// 启用用户
export function startUser(id) {
  return request({
    url: `/api/user/start/${id}`,
    method: "put",
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "api/user/",
    method: "put",
    data,
  });
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: "api/user/",
    method: "delete",
    data,
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "api/user/",
    method: "post",
    data,
  });
}
