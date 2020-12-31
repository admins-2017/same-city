<template>
  <el-dialog
    :title="isAdd ? '新增商品' : '修改商品'"
    :visible.sync="show.dialog"
    :before-close="beforeClose"
    size="50%"
  >
    <el-form ref="form" :model="form" label-position="top" class="row-form">
      <el-form-item label="商品图:">
        <el-upload
          class="avatar-uploader"
          action="/api/upload/uploadImg"
          :show-file-list="false"
          :on-success="addHandleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="updateHeader"
        >
          <img
            v-if="form.commodityPicture"
            :src="form.commodityPicture"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品名称:">
        <el-input
          size="small"
          placeholder="请输入商品名称"
          v-model="form.commodityName"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品编号:">
        <el-input
          size="small"
          placeholder="请输入商品编号"
          v-model="form.commodityNumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品单位:">
        <el-select
          size="small"
          placeholder="请选择商品单位"
          v-model="form.commodityUnit"
          clearable
        >
          <el-option
            v-for="item in unitArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类:">
        <el-select
          size="small"
          placeholder="请选择商品分类"
          v-model="form.classificationId"
          clearable
        >
          <el-option
            v-for="item in classificationArr"
            :key="item.classificationId"
            :label="item.classificationName"
            :value="item.classificationId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="建议售价:">
        <el-input
          size="small"
          placeholder="请输入建议售价"
          v-model="form.commoditySellingPrice"
        >
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品简介:">
        <el-input
          type="textarea"
          placeholder="请输入商品简介"
          v-model="form.commodityDescription"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="show.dialog = false">
        取 消
      </el-button>
      <el-button
        size="small"
        type="primary"
        :loading="show.load"
        @click="confirm"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { getClassification } from "@/api/categorys";
import { UNIT } from "../utils/constant";
export default {
  data() {
    return {
      form: {
        commodityId: "",
        commodityName: "",
        commodityNumber: "",
        commoditySellingPrice: "",
        commodityUnit: "",
        commodityDescription: "",
        commodityPicture: "",
        classificationId: "",
      },
      unitArr: UNIT, // 商品单位
      classificationArr: [], // 商品分类
      show: {
        dialog: false,
        load: false,
      },
      updateHeader: {
        Authorization: "",
      },
      isAdd: true,
    };
  },
  mounted() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.updateHeader.Authorization = this.userDetails.token;
    // 查询商品分类
    this.getAllClassificationNode();
  },
  methods: {
    // 查询商品分类
    getAllClassificationNode() {
      getClassification()
        .then((res) => {
          this.classificationArr = res.data;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 确定
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.show.load = true;
          if (this.isAdd) {
            this.insertCommodity();
          } else {
            this.updateCommodity();
          }
        } else {
          return false;
        }
      });
    },

    // 新增
    insertCommodity() {
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      axios({
        method: "post",
        url: "/api/commodity/",
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
            Object.keys(this.form).forEach((key) => (this.form[key] = ""));
            this.$parent.queryCommodity();
          } else {
            this.$message.error("删除失败 请重试！");
          }
          this.show.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 修改
    updateCommodity() {
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      axios({
        method: "put",
        url: "/api/commodity/",
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
            Object.keys(this.form).forEach((key) => (this.form[key] = ""));
            this.$parent.queryCommodity();
          } else {
            this.$message.error("删除失败 请重试！");
          }
          this.show.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    addHandleAvatarSuccess(res) {
      this.form.commodityPicture = res.data;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
