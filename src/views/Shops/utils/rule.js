export const formRule = {
  shopName: [{ required: true, message: "请输入商铺名称", trigger: "blur" }],
  shopAddress: [{ required: true, message: "请选择商铺地址", trigger: "blur" }],
  shopIntroduction: [
    { required: true, message: "请选择商铺公告", trigger: "blur" },
  ],
  shopTel: [{ required: true, message: "请输入商铺电话", trigger: "blur" }],
};
