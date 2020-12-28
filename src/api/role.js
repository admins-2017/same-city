/**
 * 文件名称：角色管理接口文件
 * 归属菜单：角色管理
 */
import request from "@/utils/request";

// 查询所有角色
export function getAllRole() {
  return request({
    url: "/api/role",
    method: "get",
  });
}
