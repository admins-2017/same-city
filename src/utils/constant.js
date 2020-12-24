// 查询条数
export const COUNT = 10;
// 支付方式
export const SETTLEMENT_METHOD = {
  1: "现金",
  2: "转账",
  3: "微信",
  4: "支付宝",
  5: "对公账户",
};
// 支付方式
export const SETTLEMENT_METHOD_LIST = [
  {
    key: 1,
    value: "现金",
  },
  {
    key: 2,
    value: "转账",
  },
  {
    key: 3,
    value: "微信",
  },
  {
    key: 4,
    value: "支付宝",
  },
  {
    key: 5,
    value: "对公账户",
  },
];
// 订单状态
export const ORDER_STATE = {
  1: "销售",
  2: "退货",
  3: "作废",
};
// 订单状态
export const ORDER_STATE_LIST = [
  {
    key: 1,
    value: "销售",
  },
  {
    key: 2,
    value: "退货",
  },
];
// 操作记录-请求方式
export const REQ_TYPE = {
  GET: "primary",
  POST: "success",
  PUT: "info",
  DELETE: "danger",
};
