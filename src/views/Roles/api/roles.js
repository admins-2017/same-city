/**
 * 文件名称： 角色列表接口文件
 * 归属菜单： 权限管理-角色列表
 * */
import request from "@/utils/request";

// 根据名称查询角色
export function roleLike(params) {
  return request({
    url:
      "/api/role/like/" +
      params.queryName +
      "/" +
      params.page +
      "/" +
      params.size,
    method: "get",
  });
}
