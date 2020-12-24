<template>
  <div class="records">
    <pageHead :config="config" />
    <el-table :data="tableData">
      <el-table-column
        prop="recordId"
        label="操作ID"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="requestTime"
        label="操作日期"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.requestTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="requestUser" label="操作人员">
        <template slot-scope="scope">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px">{{ scope.row.requestUser }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="请求详情">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>访问方法: {{ scope.row.requestMethod }}</p>
            <p>访问路径: {{ scope.row.requestUrl }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.requestIp }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="requestType" label="请求方式">
        <template slot-scope="scope">
          <el-tag size="medium" :type="transType[scope.row.requestType]">{{
            scope.row.requestType
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="操作描述"
        align="right"
      ></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :config="config" @change="getRecordByPage" />
  </div>
</template>

<script>
import axios from "axios";
import { COUNT, REQ_TYPE } from "@/utils/constant"; // 查询条数
import { getRecords } from "@/api/records";
import pageHead from "./modules/header"; // 组件-头部搜索
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "records",
  components: {
    pagination,
    pageHead,
  },
  data() {
    return {
      config: {
        total: 0, // 总数
        page: 1, // 页数
        count: COUNT, // 条数
        requestUser: "",
        requestType: "",
        startTime: "",
        endTime: "",
      },
      transType: REQ_TYPE,
      queryName: "",
      page: 1,
      size: 10,
      total: 0,
      tableData: [],

      recordTime: "",
      queryFrom: {
        requestUser: "",
        requestType: "",
        startTime: "",
        endTime: "",
      },
    };
  },
  methods: {
    getRecordByPage() {
      getRecords(this.page, this.size)
        .then((res) => {
          this.total = res.data.total;
          this.tableData = res.data.records;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getRecordByCondition() {
      this.page = 1;
      this.getRecord();
    },
    getRecord() {
      if (this.recordTime[0] != undefined) {
        this.queryFrom.startTime = this.recordTime[0];
      }
      if (this.recordTime[1] != undefined) {
        this.queryFrom.endTime = this.recordTime[1];
      }
      let formData = new FormData();
      for (var key in this.queryFrom) {
        formData.append(key, this.queryFrom[key]);
      }
      formData.append("page", this.page);
      formData.append("size", this.size);
      axios({
        method: "post",
        url: "/api/record/",
        headers: {
          Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.total = res.data.data.total;
            this.tableData = res.data.data.records;
          } else {
            this.$message.error("查询失败 请重试！");
          }
          console.log(res);
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

<style lang="scss" scoped>
.records {
  overflow-y: hidden;

  // 去除el.table流体高度的滚动条
  ::-webkit-scrollbar {
    width: 1px;
    height: 1px;
  }
}
/deep/ {
  // .el-table {
  //   .get-row {
  //     td {
  //       background: rgb(179, 231, 192);
  //     }
  //   }

  //   .post-row {
  //     background: rgb(185, 213, 226);
  //   }

  //   .put-row {
  //     background: rgb(209, 221, 180);
  //   }

  //   .delete-row {
  //     background: rgb(218, 177, 161);
  //   }
  // }
}
</style>
