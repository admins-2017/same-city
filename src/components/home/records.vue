<template>
  <div id="records">
    <div>
      <div>
        <el-input
          placeholder="根据用户名过滤"
          prefix-icon="el-icon-search"
          v-model="queryFrom.requestUser"
        ></el-input>
        <el-date-picker
          v-model="recordTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-select
          v-model="queryFrom.requestType"
          clearable
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div>
          <el-button type="primary" plain @click="getRecordByCondition"
            >查询</el-button
          >
          <el-button type="primary" plain @click="cancelCondition"
            >取消</el-button
          >
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          height="600"
          border
        >
          <el-table-column
            prop="recordId"
            label="操作ID"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="requestTime"
            label="操作日期"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.requestTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="requestUser"
            label="操作人员"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <i class="el-icon-user"></i>
              <span style="margin-left: 10px">{{ scope.row.requestUser }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestIp" label="请求详情" width="100">
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
          <el-table-column
            prop="requestType"
            label="请求方式"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.requestType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="操作描述"
          ></el-table-column>
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
      options: [
        {
          value: "get",
          label: "查询请求",
        },
        {
          value: "post",
          label: "添加请求",
        },
        {
          value: "put",
          label: "修改请求",
        },
        {
          value: "delete",
          label: "删除请求",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
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
    handleCurrentChange(val) {
      this.page = val;
      if (
        this.queryFrom.requestUser != "" ||
        this.queryFrom.requestType != "" ||
        this.queryFrom.startTime != "" ||
        // this.queryFrom.startTime != undefined ||
        this.queryFrom.endTime != ""
        // this.queryFrom.endTime != undefined
      ) {
        console.log("执行条件查询");
        console.log(this.page);
        this.getRecord();
      } else {
        console.log("执行分页查询");
        this.getRecordByPage();
      }
    },
    tableRowClassName({ row }) {
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
    cancelCondition() {
      (this.recordTime = ""),
        (this.queryFrom.requestType = ""),
        (this.queryFrom.requestUser = "");
      this.page = 1;
      this.getRecordByPage();
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

      .el-input {
        width: 20%;
        margin-right: 5px;
      }

      .el-date-editor {
        width: 30%;
        margin-right: 5px;
      }

      .el-select {
        width: 20%;

        .el-input {
          width: 100%;
        }
      }
    }

    > div:nth-of-type(2) {
      width: 94%;
      margin-top: 20px;

      .el-table {
        .get-row {
          background: rgb(179, 231, 192);
        }

        .post-row {
          background: rgb(185, 213, 226);
        }

        .put-row {
          background: rgb(209, 221, 180);
        }

        .delete-row {
          background: rgb(218, 177, 161);
        }
      }
    }

    > div:nth-of-type(3) {
      width: 94%;
      margin-top: 20px;
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
