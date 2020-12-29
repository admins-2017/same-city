<template>
  <el-dialog title="修改用户" :visible.sync="editDialog" width="50%">
    <el-form :model="updateUserFrom" class="row-form">
      <el-form-item label="用户名">
        <el-input
          autocomplete="off"
          :disabled="true"
          :placeholder="userDetailsShow.username"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input
          v-model="updateUserFrom.userDetailsAddr"
          autocomplete="off"
          :placeholder="userDetailsShow.userDetailsAddr"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input
          v-model="updateUserFrom.userDetailsMail"
          autocomplete="off"
          :placeholder="userDetailsShow.userDetailsMail"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="updateUserFrom.userDetailsSex"
          :placeholder="1 == userDetailsShow.userDetailsSex ? '男' : '女'"
          size="small"
        >
          <el-option
            label="男"
            value="1"
            :disabled="1 == userDetailsShow.userDetailsSex ? true : false"
          ></el-option>
          <el-option
            label="女"
            value="2"
            :disabled="2 == userDetailsShow.userDetailsSex ? true : false"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属商铺">
        <el-select
          v-model="updateUserFrom.shopId"
          :placeholder="userDetailsShow.shopName"
          size="small"
        >
          <el-option
            :label="shop.shopName"
            :value="shop.shopId"
            v-for="shop in allShop"
            :key="shop.shopId"
            :disabled="shop.shopId == userDetailsShow.shopId ? true : false"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配角色">
        <el-select
          v-model="updateUserFrom.roleId"
          :placeholder="userDetailsShow.roleName"
          size="small"
        >
          <el-option
            :label="role.roleName"
            :value="role.roleId"
            v-for="role in roles"
            :key="role.roleId"
            :disabled="role.roleId == userDetailsShow.roleId ? true : false"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editDialog = false">取 消</el-button>
      <el-button size="small" type="primary" @click="toUpdate">确 定</el-button>
      <el-button
        size="small"
        type="danger"
        @click="toDelete(userDetailsShow.userId)"
        >删 除
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUser, deleteUser } from "@/api/users";
import { getAllRole } from "@/api/role";
export default {
  data() {
    return {
      editDialog: false,
      updateUserFrom: {
        userDetailsSex: "",
        userDetailsAddr: "",
        userDetailsMail: "",
        shopId: "",
        roleId: "",
      },
      userDetailsShow: {
        username: "",
        userDetailsAddr: "",
        userDetailsMail: "",
        userDetailsSex: 0,
        shopName: "",
        roleName: "",
      },
      roles: [],
      allShop: [],
    };
  },
  created() {
    this.getAllRole();
  },
  methods: {
    // 查询所有角色
    getAllRole() {
      getAllRole({ page: 0, size: 100 })
        .then((resp) => {
          this.roles = resp.data.records;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    toUpdate() {
      this.updateUserFrom["userId"] = this.userDetailsShow.userId;
      // let formData = new FormData();
      // for (var key in this.updateUserFrom) {
      //   formData.append(key, this.updateUserFrom[key]);
      // }
      // formData.append("userId", this.userDetailsShow.userId);
      // axios({
      //   method: "put",
      //   url: "/api/user/",
      //   headers: {
      //     Authorization: this.userDetails.token,
      //     "Content-Type": "multipart/form-data",
      //   },
      //   data: formData,
      // })
      updateUser(this.updateUserFrom)
        .then((resp) => {
          if (resp.data.status == 200) {
            this.$message({
              message: resp.data.data,
              type: "success",
            });
            this.updateUserFrom = {
              username: "",
              userDetailsAddr: "",
              userDetailsMail: "",
              userDetailsSex: "",
              shopName: "",
              roleName: "",
            };
            this.dialogFormVisible2 = false;
            this.getUserList();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 删除用户
    toDelete(id) {
      deleteUser(id)
        .then((resp) => {
          if (resp.status == 200) {
            this.$message({
              message: resp.data,
              type: "success",
            });
            this.dialogFormVisible2 = false;
            this.getUserList();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>
