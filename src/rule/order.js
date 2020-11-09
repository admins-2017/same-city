// const validSubConAppAmt = (rule, value, callback) => {
//   if (!value) {
//     callback(new Error("本单实付不能为空"));
//     return;
//   }
//   // if (value > this.form.orderAmountAfterDiscount) {
//   //   callback(new Error("本单未付不能大于折后金额"));
//   //   return;
//   }
//   callback();
// }
export const formRule = {
  orderNumber: [{ required: true, message: "销售单号不正确", trigger: "blur" }],
  clientId: [{ required: true, message: "请选择客户", trigger: "blur" }],
  userId: [{ required: true, message: "请选择销售人员", trigger: "blur" }],
  orderDate: [{ required: true, message: "请选择下单时间", trigger: "blur" }],
  orderDiscountRate: [
    { required: true, message: "请输入折扣率", trigger: "blur" },
  ],
  orderAmountAfterDiscount: [
    { required: true, message: "请输入折后金额", trigger: "blur" },
  ],
  orderActualPayment: [
    {
      required: true,
      message: "请输入本单实付",
      trigger: "blur",
      // validator: validSubConAppAmt,
    },
  ],
  orderUnpaidAmount: [
    { required: true, message: "请输入本单未付", trigger: "blur" },
  ],
  orderSettlementMethod: [
    { required: true, message: "请选择支付方式", trigger: "blur" },
  ],
  orderSettlementAccount: [
    { required: true, message: "请选择结算账户", trigger: "blur" },
  ],
};

export const detailsRule = {
  shopId: [{ required: true, message: "请选择商铺", trigger: "blur" }],
  commodityName: [{ required: true, message: "请选择商品", trigger: "blur" }],
  orderDetailNumber: [
    { required: true, message: "请输入数量", trigger: "blur" },
  ],
  orderDetailPrice: [
    { required: true, message: "请输入价格", trigger: "blur" },
  ],
};
