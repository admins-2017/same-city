<template>
  <el-dialog
    :title="isAdd ? '新增角色' : '编辑角色'"
    :visible.sync="show.dialog"
    :before-close="beforeClose"
    width="400px"
  >
    <div class="small-dialog" v-loading="show.load">
      <el-input
        v-model="form.roleName"
        prefix-icon="el-icon-user-solid"
        placeholder="请输入角色名称"
      ></el-input>
      <el-input
        v-model="form.roleCode"
        prefix-icon="el-icon-info"
        placeholder="请输入角色编码(请勿输入汉字)"
      ></el-input>
      <el-input
        v-model="form.roleDescription"
        prefix-icon="el-icon-document"
        placeholder="请输入角色简介"
      ></el-input>
      <div class="div-title">权限列表</div>
      <el-tree
        :data="tree.data"
        show-checkbox
        node-key="menuId"
        ref="tree"
        :props="defaultProps"
        :default-checked-keys="tree.checked"
      ></el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      show: {
        dialog: false,
        load: false,
      },
      form: {
        roleName: "",
        roleDescription: "",
        roleCode: "",
      },
      // 权限树
      tree: {
        data: [],
        checked: [],
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      isAdd: true,
      roleId: "",
    };
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    // 获取权限树
    getMenuTree() {
      this.show.load = true;
      axios({
        method: "get",
        url: "/api/menu/all",
        headers: {
          //   Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.tree.data = res.data.data;
          } else {
            this.$message.error("获取权限列表失败 请重试！");
          }
          this.show.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.show.load = false;
        });
    },

    // 获取角色权限
    getMenuByRole(value) {
      axios({
        method: "get",
        url: "/api/menu/role/" + value,
        headers: {
          //   Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.data.status) {
            this.tree.checked = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.show.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.show.load = false;
        });
    },

    // 确定
    confirm() {
      if (this.isAdd) {
        this.insertNewRole(); // 新增
      } else {
        this.updateRoleDetails(); // 修改
      }
    },

    // 新增
    insertNewRole() {
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      formData.append("menuList", this.$refs.tree.getCheckedKeys());
      axios({
        method: "post",
        url: "/api/role/",
        headers: {
          //   Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.form = {
              roleName: "",
              roleCode: "",
              roleDescription: "",
            };
            this.show.dialog = false;
            this.$parent.queryAllRole();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 修改
    updateRoleDetails() {
      let formData = new FormData();
      formData.append("roleId", this.roleId);
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      if (this.$refs.tree.getCheckedKeys().length != 0) {
        formData.append("menuList", this.$refs.tree.getCheckedKeys());
      }
      axios({
        method: "put",
        url: "/api/role/",
        headers: {
          //   Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.form = {
              roleName: "",
              roleCode: "",
              roleDescription: "",
            };
            this.show.dialog = false;
            this.$refs.tree.setCheckedKeys([]);
            this.$parent.queryAllRole();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 取消
    cancel() {
      this.show.dialog = false;
      this.$refs.tree.setCheckedKeys([]);
    },

    // 关闭前回调
    beforeClose(done) {
      this.$refs.tree.setCheckedKeys([]);
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.div-title {
  font-weight: 900;
  padding: 10px 0;
  text-align: center;
  background: #f5f7fa;
  border-radius: 5px;
}
</style>
