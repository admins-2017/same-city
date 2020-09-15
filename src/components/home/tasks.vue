<template>
  <div id="tasks">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入商铺名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" plain>查询</el-button>
          <el-button type="primary" plain>取消</el-button>
        </div>
        <el-button type="primary" plain>新增商铺</el-button>
      </div>
      <div>
        <el-table :data="tableData" height="600" border style="width: 100%">
          <el-table-column prop="id" label="id" align="center" width="50"></el-table-column>
          <el-table-column prop="jobName" label="任务名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="beanName" label="bean名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="methodName" label="方法名" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column
            prop="cronExpression"
            label="cron表达式"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column prop="status" label="状态标记" width="100" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
              <el-tag type="info" v-else>暂停</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deleteFlag" label="删除标记" width="100" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="!scope.row.deleteFlag">使用</el-tag>
              <el-tag type="info" v-else>删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="140" align="center"></el-table-column>
          <el-table-column prop="createdTime" label="创建时间" align="center" width="160"></el-table-column>
          <el-table-column prop="updatedTime" label="最近一次修改时间" align="center" width="160"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small">修改</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status==1&&!scope.row.deleteFlag"
                @click="suspendJob(scope.row)"
              >停用</el-button>
              <el-button type="text" size="small" v-if="scope.row.status==2&&!scope.row.deleteFlag" @click="enableJob(scope.row)">启用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="!scope.row.deleteFlag"
                @click="deleteJob(scope.row)"
              >删除</el-button>
              <el-button type="text" size="small" v-else @click="restoreJob(scope.row)">恢复</el-button>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "tasks",
  data() {
    return {
      tableData: [],
      size: 10,
      page: 1,
      total: 0,
      userDetails: {},
      queryName: "",
      updateJob: {
        id: 0,
        jobName: "",
        cronExpression: "",
        beanName: "",
        methodName: "",
        status: 1,
        deleteFlag: 0,
      },
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getAllJob();
    },
    getAllJob() {
      axios({
        method: "get",
        url: "/api/job/" + this.page + "/" + this.size,
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
    // 启用任务
    enableJob(val) {
      console.log(val);
      let formData = new FormData();
      formData.append("id", val.id);
      formData.append("status", 1);
      axios({
        method: "put",
        url: "/api/job/",
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
            this.getAllJob();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    // 停用任务
    suspendJob(val) {
      console.log(val);
      let formData = new FormData();
      formData.append("id", val.id);
      formData.append("status", 2);
      axios({
        method: "put",
        url: "/api/job/",
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
            this.getAllJob();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    // 恢复删除任务
    restoreJob(val) {
      console.log(val);
      let formData = new FormData();
      formData.append("id", val.id);
      formData.append("deleteFlag", 0);
      axios({
        method: "put",
        url: "/api/job/",
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
            this.getAllJob();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    // 删除任务
    deleteJob(val) {
      console.log(val);
      let formData = new FormData();
      formData.append("id", val.id);
      formData.append("deleteFlag", 1);
      axios({
        method: "put",
        url: "/api/job/",
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
            this.getAllJob();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllJob();
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
#tasks {
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
  }
}
</style>