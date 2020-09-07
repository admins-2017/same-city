<template>
  <div id="shops">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入商铺名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" plain>查询</el-button>
          <el-button type="primary" plain>取消</el-button>
        </div>
        <el-button type="primary" plain @click="insertDialogFormVisible = true">新增商铺</el-button>
      </div>
      <div>
        <el-table :data="tableData" height="250" border style="width: 100%">
          <el-table-column prop="shopName" label="日期" width="180"></el-table-column>
          <el-table-column prop="shopAddress" label="姓名" width="180"></el-table-column>
          <el-table-column prop="insertTime" label="地址"></el-table-column>
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
      queryName: "",
      tableData: [],
      size: 10,
      page: 1,
      total: 0,
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
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
  }
}
</style>
