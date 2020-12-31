export const fromRule = {
  supplierName: [
    { required: true, message: "请输入供应商名称", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  supplierAddress: [
    { required: true, message: "请输入供应商地址", trigger: "blur" },
  ],
  supplierPerson: [
    {
      required: true,
      message: "请输入供应商负责人名称",
      trigger: "blur",
    },
    { min: 2, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  supplierTelephone: [
    { required: true, message: "请输入供应商联系方式", trigger: "blur" },
  ],
  supplierEmail: [
    { required: true, message: "请输入供应商邮箱地址", trigger: "blur" },
  ],
  supplierBusiness: [
    { required: true, message: "请输入供应商主营业务", trigger: "blur" },
  ],
  supplierCooperated: [
    {
      type: "array",
      required: true,
      message: "请选择是否合作",
      trigger: "change",
    },
  ],
  desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
};
