<template>
  <el-dialog
    title="构建查询条件"
    :visible.sync="dialog"
    :before-close="beforeClose"
    width="50%"
  >
    <el-form :model="form" label-position="top" class="row-form">
      <el-form-item label="商品名称">
        <el-input
          size="small"
          v-model="form.commodityName"
          autocomplete="off"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品编号">
        <el-input
          size="small"
          v-model="form.commodityNumber"
          autocomplete="off"
          placeholder="请输入商品编号"
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
      <el-form-item label="商品状态:">
        <el-select
          size="small"
          placeholder="请选择商品状态"
          v-model="form.commodityStatus"
          clearable
        >
          <el-option
            v-for="item in statusArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加人员:">
        <el-select
          size="small"
          placeholder="请选择添加人员"
          v-model="form.insertUser"
          clearable
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改人员:">
        <el-select
          size="small"
          placeholder="请选择修改人员"
          v-model="form.updateUser"
          clearable
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间:">
        <el-date-picker
          v-model="insertTimeArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日 HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间:">
        <el-date-picker
          v-model="updateTimeArr"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        >
        </el-date-picker>
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
import { getAllUser } from "@/api/users";
import { UNIT, STATUS } from "../utils/constant";
export default {
  data() {
    return {
      form: {
        commodityName: "",
        commodityNumber: "",
        commodityUnit: "",
        commodityStatus: "",
        insertStartTime: "",
        insertEndTime: "",
        insertUser: "",
        updateStartTime: "",
        updateEndTime: "",
        updateUser: "",
      },
      unitArr: UNIT, // 商品单位
      statusArr: STATUS, // 商品状态
      insertTimeArr: [], // 添加时间
      updateTimeArr: [], // 修改时间
      userList: [], // 用户列表
      dialog: false,
    };
  },
  mounted() {
    // 查询用户
    this.queryUser();
  },
  methods: {
    // 确定
    confirm() {
      this.$parent.params.page = 1;
      if (this.insertTimeArr.length > 0) {
        this.form.insertStartTime = this.insertTimeArr[0];
        this.form.insertEndTime = this.insertTimeArr[1];
      }
      if (this.updateTimeArr.length > 0) {
        this.form.updateStartTime = this.updateTimeArr[0];
        this.form.updateEndTime = this.updateTimeArr[1];
      }

      this.$parent.queryCommodity(this.form);
      this.dialog = false;
    },

    // 查询用户
    queryUser() {
      let obj = {
        page: 1,
        size: 10000,
      };
      getAllUser(obj)
        .then((res) => {
          this.userList = res.data.records;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 取消
    cancel() {
      Object.assign(this.$data.form, this.$options.data().form);
      this.insertTimeArr = [];
      this.updateTimeArr = [];
      this.dialog = false;
    },

    // 关闭前操作
    beforeClose(done) {
      Object.assign(this.$data.form, this.$options.data().form);
      done();
    },
  },
};
</script>
