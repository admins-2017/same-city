import request from "@/utils/request";

// 查询销售订单-无查询条件
export function getOrderList(page, count) {
  return request({
    url: `api/order/1/${page}/${count}/`,
    method: "get",
  });
}

// 查询销售订单-查询条件
export function getOrderListOption(page, count) {
  return request({
    url: `api/order/1/${page}/${count}/`,
    method: "get",
  });
}

// 新增销售订单-前置查询
export function initOrder() {
  return request({
    url: `api/order/init`,
    method: "get",
  });
}

// 新增销售订单-前置查询
export function addOrder(data) {
  return request({
    url: `api/order`,
    data: data,
    method: "post",
  });
}
