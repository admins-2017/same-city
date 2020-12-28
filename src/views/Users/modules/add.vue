<template>
  <el-dialog title="新增用户" :visible.sync="addDialog" width="50%">
    <el-form :model="form" class="row-form">
      <el-form-item label="用户名">
        <el-input
          v-model="form.username"
          autocomplete="off"
          size="small"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="初始密码">
        <el-input
          :placeholder="'123456'"
          autocomplete="off"
          size="small"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input
          v-model="form.userDetailsTel"
          autocomplete="off"
          size="small"
          placeholder="请输入联系方式"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input
          v-model="form.userDetailsAddr"
          autocomplete="off"
          size="small"
          placeholder="请输入联系地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input
          v-model="form.userDetailsMail"
          autocomplete="off"
          size="small"
          placeholder="请输入联系邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="form.userDetailsSex"
          placeholder="请选择性别"
          size="small"
        >
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属商铺">
        <el-select
          v-model="form.shopId"
          placeholder="请选择所属商铺"
          size="small"
        >
          <el-option
            :label="shop.shopName"
            :value="shop.shopId"
            v-for="shop in allShop"
            :key="shop.shopId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配角色">
        <el-select
          v-model="form.roleId"
          placeholder="请选择分配角色"
          size="small"
        >
          <el-option
            :label="role.roleName"
            :value="role.roleId"
            v-for="role in roles"
            :key="role.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="insertUser">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addUser } from "@/api/users";
import { getAllRole } from "@/api/role";
export default {
  data() {
    return {
      addDialog: false,
      form: {
        username: "",
        userDetailsSex: "",
        userDetailsAddr: "",
        userDetailsMail: "",
        userDetailsTel: "",
        shopId: "",
        roleId: "",
      },
      allShop: [],
      roles: [],
    };
  },
  created() {
    this.getAllRole();
  },
  methods: {
    // 查询所有角色
    getAllRole() {
      getAllRole()
        .then((resp) => {
          this.roles = resp.data;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 新增用户
    insertUser() {
      // let formData = new FormData();
      // for (var key in this.form) {
      //   formData.append(key, this.form[key]);
      // }
      // axios({
      //   method: "post",
      //   url: "/api/user/",
      //   headers: {
      //     Authorization: this.userDetails.token,
      //     "Content-Type": "multipart/form-data",
      //   },
      //   data: formData,
      // })
      addUser(this.form)
        .then((resp) => {
          if (resp.status == 200) {
            this.$message({
              message: "新增用户成功",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.form.username = "";
            this.form.userDetailsSex = "";
            this.form.userDetailsAddr = "";
            this.form.userDetailsMail = "";
            this.form.userDetailsTel = "";
            this.form.shopId = "";
            this.form.roleId = "";
            this.getUserList();
          } else {
            this.$message.error("新增用户错误：" + resp.msg + ",请重试");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>
