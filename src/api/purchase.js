import request from "@/utils/request";

// 查询销售订单-无查询条件
export function getOrderList(page, count) {
    return request({
        url: `api/purchase/${page}/${count}/1`,
        method: "get",
    });
}

// 查询销售订单-查询条件
export function getOrderListOption(page, count, o) {
    return request({
        url: `api/order?page=${page}&size=${count}&orderNumber=${o.orderNumber}&orderStartDate=${o.date[0]}&orderEndDate=${o.date[1]}&orderOperatorUser=${o.operatorUser}`,
        method: "get",
    });
}

// 新增销售订单-前置查询
export function initOrder() {
    return request({
        url: `api/purchase/init`,
        method: "get",
    });
}

// 新增销售订单-新增
export function addOrder(data) {
    return request({
        url: `api/order`,
        data: data,
        method: "post",
    });
}

// 获取销售人员
export function getUser() {
    return request({
        url: `api/user/initSellUser`,
        method: "get",
    });
}

// 销售订单-作废
export function cancelOrder(id) {
    return request({
        url: `api/order/${id}`,
        method: "delete",
    });
}
