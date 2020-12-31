export const formRule = {
  clientName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
    {
      min: 1,
      max: 20,
      message: "长度在 1 到 20 个字符",
      trigger: "blur",
    },
  ],
  clientPhone: [
    { required: true, message: "请输入客户联系方式", trigger: "blur" },
  ],
  clientAddress: [
    {
      required: true,
      message: "请输入客户联系地址",
      trigger: "blur",
    },
  ],
  clientGender: [
    { required: true, message: "请选择客户性别", trigger: "blur" },
  ],
  clientBirthday: [
    { required: true, message: "请选择客户生日日期", trigger: "blur" },
  ],
  clientEmail: [{ required: true, message: "请输入客户邮箱", trigger: "blur" }],
  clientDesc: [
    {
      min: 1,
      max: 50,
      message: "长度在 1 到 50 个字符",
      trigger: "blur",
    },
  ],
};
