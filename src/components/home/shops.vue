<template>
  <div id="shops">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入商铺名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" plain @click="findShopName">查询</el-button>
          <el-button type="primary" plain @click="cancelFind">取消</el-button>
        </div>
        <el-button type="primary" plain @click="insertDialogFormVisible = true">新增商铺</el-button>
      </div>
      <div>
        <el-table :data="tableData" height="600" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.children" style="width: 100%" ref="singleTable">
                <el-table-column prop="username" label="店员名" width="180"></el-table-column>
                <el-table-column prop="userDetailsTel" label="联系方式" width="180"></el-table-column>
                <el-table-column prop="userDetailsSex" label="性别"></el-table-column>
                <el-table-column prop="userDetailsMail" label="联系邮箱"></el-table-column>
                <el-table-column prop="userDetailsAddr" label="联系地址"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="商铺名称"></el-table-column>
          <el-table-column prop="shopAddress" label="商铺地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopStatus" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.shopStatus==1">营业</el-tag>
              <el-tag type="info" v-else-if="scope.row.shopStatus==2">休息</el-tag>
              <el-tag type="warning" v-else>暂停营业</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="shopIntroduction" label="商铺公告" show-overflow-tooltip></el-table-column>
          <el-table-column prop="shopTel" label="商铺电话" width="140" align="center"></el-table-column>
          <el-table-column prop="insertTime" label="创建时间" align="center" width="160"></el-table-column>
          <el-table-column prop="updateTime" label="最近一次修改时间" align="center" width="160"></el-table-column>
          <el-table-column label="操作" width="50" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="updateShop(scope.row)"
                icon="el-icon-edit"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div>
        <el-dialog title="新增商铺" :visible.sync="insertDialogFormVisible" :width="dialogWidht" center>
          <div class="insert-shop-from">
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
            <el-button @click="cancelInsertShop">取 消</el-button>
            <el-button type="primary" @click="insertShop">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog
          title="修改商铺信息"
          :visible.sync="updateDialogFormVisible"
          :width="dialogWidht"
          center
        >
          <div class="update-shop-from">
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
            <el-select v-model="updateFrom.shopStatus" clearable placeholder="修改商铺状态">
              <el-option label="营业" value="1" :disabled="1==shopDetails.shopStatus ? true:false"></el-option>
              <el-option label="休息" value="2" :disabled="2==shopDetails.shopStatus ? true:false"></el-option>
              <el-option label="暂停营业" value="3" :disabled="3==shopDetails.shopStatus ? true:false"></el-option>
            </el-select>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUpdateShop">取 消</el-button>
            <el-button type="primary" @click="updateShopDetails">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "shops",
  data() {
    return {
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
      dialogWidht: "30%",
      userDetails:{},
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getAllShop();
    },
    getAllShop() {
      axios({
        method: "get",
        url: "/api/shop/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    findShopName() {
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
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    cancelFind() {
      this.queryName = "";
      this.page = 1;
      this.getAllShop();
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
    this.getAllShop();
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
#shops {
  width: 100%;
  height: 100%;
  display: flex;
  > div {
    width: 98%;
    height: 98%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    > div:nth-of-type(1) {
      width: 94%;
      margin-top: 20px;
      padding: 0px 20px;
      display: flex;
      justify-content: space-between;

      > div:nth-of-type(1) {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    > div:nth-of-type(2) {
      width: 94%;
      margin-top: 20px;
    }
    > div:nth-of-type(3) {
      width: 94%;
      margin-top: 20px;
    }
    > div:nth-of-type(3) {
      width: 94%;
      margin-top: 20px;
    }
    > div:nth-of-type(4) {
      .el-dialog__body {
        display: flex;
        justify-content: center;
        .insert-shop-from {
          width: 60%;
          .el-input {
            width: 100%;
            margin-top: 20px;
            text-align: center;
          }
        }
      }
    }
    > div:nth-of-type(5) {
      .el-dialog__header{
        >.el-dialog__title{
          color: rgb(8, 141, 90);
        }
      }
      .el-dialog__body {
        display: flex;
        justify-content: center;
        .update-shop-from {
          width: 60%;
          .el-input {
            width: 100%;
            margin: 10px 0px;
            text-align: center;
          }
          .el-select{
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
