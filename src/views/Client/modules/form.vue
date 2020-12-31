<template>
  <el-dialog
    :title="isAdd ? '新增客户' : '修改客户'"
    :visible.sync="show.dialog"
    :before-close="beforeClose"
    width="50%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
      class="row-form"
    >
      <el-form-item label="客户名称" prop="clientName">
        <el-input
          size="small"
          placeholder="请输入客户名称"
          v-model="form.clientName"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="clientPhone">
        <el-input
          size="small"
          placeholder="请输入联系方式"
          v-model="form.clientPhone"
        />
      </el-form-item>
      <el-form-item label="联系地址" prop="clientAddress">
        <el-input
          size="small"
          placeholder="请输入联系地址"
          v-model="form.clientAddress"
        />
      </el-form-item>
      <el-form-item label="客户性别" prop="clientGender">
        <el-select
          size="small"
          v-model="form.clientGender"
          placeholder="请选择客户性别"
        >
          <el-option label="女" :value="false"></el-option>
          <el-option label="男" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户生日" prop="clientBirthday">
        <el-date-picker
          v-model="form.clientBirthday"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="small"
        />
      </el-form-item>
      <el-form-item label="客户邮箱" prop="clientEmail">
        <el-input
          size="small"
          placeholder="请输入客户邮箱"
          v-model="form.clientEmail"
        >
          <template slot="append">.com</template>
        </el-input>
      </el-form-item>
      <el-form-item label="客户简介" prop="clientDesc">
        <el-input
          type="textarea"
          size="small"
          placeholder="请输入客户简介"
          v-model="form.clientDesc"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { formRule } from "../utils/rule";
export default {
  data() {
    return {
      show: {
        dialog: false,
      },
      form: {
        clientId: "",
        clientName: "",
        clientPhone: "",
        clientAddress: "",
        clientGender: "",
        clientBirthday: "",
        clientEmail: "",
        clientDesc: "",
      },
      isAdd: true,
      rules: formRule,
    };
  },
  methods: {
    // 确定
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.addClient();
          } else {
            this.updateClient();
          }
        } else {
          return false;
        }
      });
    },

    // 新增
    addClient() {
      let formData = new FormData();
      for (var key in this.form) {
        if (key === "clientEmail") {
          this.form[key] += ".com";
        }
        formData.append(key, this.form[key]);
      }
      axios({
        method: "post",
        url: "/api/client/",
        headers: {
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
            this.show.dialog = false;
            this.$refs["form"].resetFields();
            this.$parent.queryClient();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 修改
    updateClient() {
      let formData = new FormData();
      for (var key in this.form) {
        if (key === "clientEmail" && this.form[key] != "") {
          this.form[key] += ".com";
        }
        formData.append(key, this.form[key]);
      }
      axios({
        method: "put",
        url: "/api/client/",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.show.dialog = false;
            this.form = {};
            this.$parent.queryClient();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 取消
    cancel() {
      this.show.dialog = false;
    },

    // 关闭前操作
    beforeClose(done) {
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs.form.clearValidate();
      done();
    },
  },
};
</script>
