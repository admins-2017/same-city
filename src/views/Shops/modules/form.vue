<template>
  <el-dialog
    :title="isAdd ? '新增商铺' : '修改商铺'"
    :visible.sync="show.dialog"
    :before-close="beforeClose"
    width="50%"
  >
    <el-form :model="form" :rules="rules.form" ref="form" class="row-form">
      <el-form-item label="商铺名称" prop="shopName">
        <el-input
          v-model="form.shopName"
          placeholder="请输入商铺名称"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="商铺地址" prop="shopAddress">
        <el-input
          v-model="form.shopAddress"
          placeholder="请输入商铺地址"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="商铺公告" prop="shopIntroduction">
        <el-input
          v-model="form.shopIntroduction"
          placeholder="请输入商铺公告"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="商铺电话" prop="shopTel">
        <el-input
          v-model="form.shopTel"
          placeholder="请输入商铺电话"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="商铺状态" prop="shopStatus" v-if="!isAdd">
        <el-select v-model="form.shopStatus" size="small" clearable>
          <el-option
            v-for="(s, i) in shopStatusArr"
            :key="i"
            :label="s.label"
            :value="s.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">
        确 定
      </el-button>
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
        shopId: "",
        shopName: "",
        shopAddress: "",
        shopIntroduction: "",
        shopTel: "",
        shopStatus: "",
      },
      shopStatusArr: [
        {
          label: "营业",
          value: 1,
        },
        {
          label: "休息",
          value: 2,
        },
        {
          label: "暂停营业",
          value: 3,
        },
      ],
      isAdd: true,
      rules: {
        form: formRule,
      },
    };
  },
  methods: {
    // 确定
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.insertShop();
          } else {
            this.updateShop();
          }
        } else {
          return false;
        }
      });
    },

    // 新增
    insertShop() {
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      axios({
        method: "post",
        url: "/api/shop/",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message.success({
              message: res.data.data,
              type: "success",
            });
            this.show.dialog = false;
            this.$parent.queryShop();
          } else {
            this.$message.error("新增失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 修改
    updateShop() {
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      axios({
        method: "put",
        url: "/api/shop/",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message.success({
              message: res.data.data,
            });
            this.show.dialog = false;
            this.$parent.queryShop();
          } else {
            this.$message.error("修改失败 请重试！");
          }
        })
        .catch(() => {
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
