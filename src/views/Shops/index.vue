<template>
  <div class="shops">
    <div class="head">
      <el-input
        placeholder="请输入商铺名"
        prefix-icon="el-icon-search"
        size="small"
        v-model="queryName"
      ></el-input>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="findShopName"
        >查 询
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="insertDialogFormVisible = true"
        >新 增</el-button
      >
    </div>
    <el-table :data="tableData" v-loading="load" size="small">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" ref="singleTable" border>
            <el-table-column
              prop="username"
              label="店员名"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="userDetailsTel"
              label="联系方式"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="userDetailsSex"
              label="性别"
            ></el-table-column>
            <el-table-column
              prop="userDetailsMail"
              label="联系邮箱"
            ></el-table-column>
            <el-table-column
              prop="userDetailsAddr"
              label="联系地址"
            ></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="商铺名称"></el-table-column>
      <el-table-column
        prop="shopAddress"
        label="商铺地址"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="shopStatus" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.shopStatus == 1">营业</el-tag>
          <el-tag type="info" v-else-if="scope.row.shopStatus == 2"
            >休息</el-tag
          >
          <el-tag type="warning" v-else>暂停营业</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopIntroduction"
        label="商铺公告"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="shopTel"
        label="商铺电话"
        width="140"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="insertTime"
        label="创建时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="最近一次修改时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateShop(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :config="config" @change="getAllShop" />
    <el-dialog
      title="新增商铺"
      :visible.sync="insertDialogFormVisible"
      width="400px"
    >
      <div class="small-dialog">
        <el-input
          v-model="insertForm.shopName"
          prefix-icon="el-icon-s-shop"
          placeholder="请输入商铺名称"
        ></el-input>
        <el-input
          v-model="insertForm.shopAddress"
          prefix-icon="el-icon-location-information"
          placeholder="请输入商铺地址"
        ></el-input>
        <el-input
          v-model="insertForm.shopIntroduction"
          prefix-icon="el-icon-warning-outline"
          placeholder="请输入商铺公告"
        ></el-input>
        <el-input
          v-model="insertForm.shopTel"
          prefix-icon="el-icon-phone"
          placeholder="请输入商铺电话"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelInsertShop">取 消</el-button>
        <el-button size="small" type="primary" @click="insertShop">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改商铺信息"
      :visible.sync="updateDialogFormVisible"
      width="400px"
    >
      <div class="small-dialog">
        <el-input
          v-model="updateFrom.shopName"
          prefix-icon="el-icon-s-shop"
          :placeholder="shopDetails.shopName"
        ></el-input>
        <el-input
          v-model="updateFrom.shopAddress"
          prefix-icon="el-icon-location-information"
          :placeholder="shopDetails.shopAddress"
        ></el-input>
        <el-input
          v-model="updateFrom.shopIntroduction"
          prefix-icon="el-icon-warning-outline"
          :placeholder="shopDetails.shopIntroduction"
        ></el-input>
        <el-input
          v-model="updateFrom.shopTel"
          prefix-icon="el-icon-phone"
          :placeholder="shopDetails.shopTel"
        ></el-input>
        <el-select
          v-model="updateFrom.shopStatus"
          clearable
          placeholder="修改商铺状态"
        >
          <el-option
            label="营业"
            value="1"
            :disabled="1 == shopDetails.shopStatus ? true : false"
          ></el-option>
          <el-option
            label="休息"
            value="2"
            :disabled="2 == shopDetails.shopStatus ? true : false"
          ></el-option>
          <el-option
            label="暂停营业"
            value="3"
            :disabled="3 == shopDetails.shopStatus ? true : false"
          ></el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdateShop">取 消</el-button>
        <el-button type="primary" @click="updateShopDetails">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShopList } from "./api/shops"; // 接口-查询店铺
import pagination from "@/components/pagination"; // 组件-分页
import axios from "axios";
export default {
  name: "shops",
  components: {
    pagination,
  },
  data() {
    return {
      config: {
        total: 0, // 总数
        page: 1, // 页数
        count: 10, // 条数
      },
      insertDialogFormVisible: false,
      updateDialogFormVisible: false,
      queryName: "",
      tableData: [],
      size: 10,
      page: 1,
      total: 0,
      insertForm: {
        shopName: "",
        shopAddress: "",
        shopIntroduction: "",
        shopTel: "",
      },
      updateFrom: {
        shopName: "",
        shopAddress: "",
        shopIntroduction: "",
        shopTel: "",
        shopStatus: "",
      },
      shopDetails: {},
      userDetails: {},
      load: false,
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getAllShop(1);
    },

    // 查询店铺
    getAllShop(page, count = this.config.count) {
      getShopList(page, count)
        .then((resp) => {
          console.log(resp);
          this.tableData = resp.data.records;
          this.config.total = resp.data.total;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    findShopName() {
      this.load = true;
      axios({
        method: "get",
        url: "/api/shop/" + this.page + "/" + this.size + "/" + this.queryName,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;
          this.load = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },
    updateShop(val) {
      this.updateDialogFormVisible = true;
      console.log(val);
      if (val.shopStatus == 1) {
        this.shopDetails = val;
      }
      if (val.shopStatus == 2) {
        this.shopDetails = val;
      }
      if (val.shopStatus == 3) {
        this.shopDetails = val;
      }
    },
    insertShop() {
      let formData = new FormData();
      for (var key in this.insertForm) {
        formData.append(key, this.insertForm[key]);
      }
      axios({
        method: "post",
        url: "/api/shop/",
        headers: {
          Authorization: this.userDetails.token,
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
            this.insertForm = {
              shopName: "",
              shopAddress: "",
              shopIntroduction: "",
              shopTel: "",
            };
            this.insertDialogFormVisible = false;
            this.getAllShop();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    cancelInsertShop() {
      this.insertForm = {
        shopName: "",
        shopAddress: "",
        shopIntroduction: "",
        shopTel: "",
      };
      this.insertDialogFormVisible = false;
    },
    updateShopDetails() {
      let formData = new FormData();
      for (var key in this.updateFrom) {
        formData.append(key, this.updateFrom[key]);
      }
      formData.append("shopId", this.shopDetails.shopId);
      axios({
        method: "put",
        url: "/api/shop/",
        headers: {
          Authorization: this.userDetails.token,
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
            this.updateFrom = {
              shopName: "",
              shopAddress: "",
              shopIntroduction: "",
              shopTel: "",
              shopStatus: "",
            };
            this.updateDialogFormVisible = false;
            this.getAllShop();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    cancelUpdateShop() {
      this.updateFrom = {
        shopName: "",
        shopAddress: "",
        shopIntroduction: "",
        shopTel: "",
        shopStatus: "",
      };
      this.updateDialogFormVisible = false;
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.findShopName();
  },
};
</script>
