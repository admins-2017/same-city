<template>
  <div id="records">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入权限名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" plain>查询</el-button>
          <el-button type="primary" plain>取消</el-button>
        </div>
        <el-button type="primary" plain>新增权限</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="600"
        >
          <el-table-column prop="recordId" label="操作ID" width="80"></el-table-column>
          <el-table-column prop="requestTime" label="操作日期" width="220" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.requestTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestUser" label="操作人员" width="180" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.requestUser }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestIp" label="请求详情" width="100">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>访问方法: {{ scope.row.requestMethod }}</p>
                <p>访问方式: {{ scope.row.requestType }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.requestIp }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="操作描述" width="180"></el-table-column>
          <el-table-column prop="requestUrl" label="访问路径"></el-table-column>
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
  name: "records",
  data() {
    return {
      queryName: "",
      page: 1,
      size: 10,
      total: 0,
      tableData: [],
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      // this.getRecordByPage();
    },
    tableRowClassName({ row }) {
      console.log(row);
      if (row.requestType === "GET") {
        return "get-row";
      } else if (row.requestType === "POST") {
        return "post-row";
      } else if (row.requestType === "PUT") {
        return "put-row";
      } else if (row.requestType === "DELETE") {
        return "delete-row";
      }
      return "";
    },
    getRecordByPage() {
      axios({
        method: "get",
        url: "/api/record/" + this.page + "/" + this.size,
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
    this.getRecordByPage();
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
#records {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
      .el-table {
        .get-row {
          background: rgb(117, 198, 245);
		}
		.post-row {
          background: rgb(10, 160, 48);
		}
		.put-row {
          background: rgb(154, 218, 7);
		}
		.delete-row {
          background: rgb(218, 70, 12);
        }
      }
    }
  }
}
</style>
