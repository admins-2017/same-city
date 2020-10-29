import {
    SETTLEMENT_METHOD,
    ORDER_STATE
} from "@/utils/constant";
// 支付方式
export function transMethod(method) {
    return SETTLEMENT_METHOD[method];
}
// 订单状态
export function transState(state) {
    return ORDER_STATE[state];
}