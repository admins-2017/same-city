/**
 * 文件名称：操作记录接口文件
 * 归属菜单：系统管理-操作记录
 */
import request from "@/utils/request";

// 查询操作记录
export function getRecords(params) {
  return request({
    url: "api/record",
    method: "get",
    params,
  });
}
