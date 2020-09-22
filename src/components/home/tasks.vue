<template>
  <div id="tasks">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入任务名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" @click="findTaskByQueryName" plain>查询</el-button>
          <el-button type="primary" @click="changeFindTask" plain>取消</el-button>
        </div>
        <el-button type="primary" plain @click="insertDialogFormVisible = true">新增任务</el-button>
      </div>
      <div>
        <el-table :data="tableData" height="600" border style="width: 100%">
          <el-table-column prop="id" label="id" align="center" width="50"></el-table-column>
          <el-table-column prop="jobName" label="任务名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="jobIntroduction" label="任务介绍" show-overflow-tooltip></el-table-column>
          <el-table-column prop="beanName" label="bean名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="methodName" label="方法名" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="methodArgType" label="方法参数类型" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="methodParams" label="方法参数" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column
            prop="cronExpression"
            label="cron表达式"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column prop="status" label="状态标记" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==1">启用中</el-tag>
              <el-tag type="info" v-else>已暂停</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deleteFlag" label="删除标记" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="!scope.row.deleteFlag">使用</el-tag>
              <el-tag type="info" v-else>删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="80" align="center"></el-table-column>
          <el-table-column
            prop="createdTime"
            label="创建时间"
            align="center"
            show-overflow-tooltip
            width="80"
          ></el-table-column>
          <el-table-column
            prop="updatedTime"
            label="最近一次修改时间"
            align="center"
            show-overflow-tooltip
            width="80"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openDrawer(scope.row)">修改</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status==1&&!scope.row.deleteFlag"
                @click="suspendJob(scope.row)"
              >停用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status==2&&!scope.row.deleteFlag"
                @click="enableJob(scope.row)"
              >启用</el-button>
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
      <div>
        <el-dialog title="新增任务" :visible.sync="insertDialogFormVisible" :width="dialogWidht" center>
          <div class="insert-task-from">
            <el-input v-model="jobForm.jobName" prefix-icon="el-icon-s-shop" placeholder="请输入任务名称"></el-input>
            <el-input
              v-model="jobForm.jobIntroduction"
              prefix-icon="el-icon-location-information"
              placeholder="请输入任务介绍"
            ></el-input>
            <el-popover v-model="cronPopover" placement="right">
              <el-input
                slot="reference"
                @click="cronPopover=true"
                v-model="jobForm.cronExpression"
                placeholder="请输入定时策略"
              ></el-input>
              <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
            </el-popover>
            <el-select v-model="value" placeholder="请选择执行方法" clearable>
              <el-option
                v-for="item in jobDetails"
                :key="item.id"
                :label="item.methodIntroduction"
                :value="item.id"
              >
                <span style="float: left">{{ item.methodName }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                >{{ item.methodIntroduction }}</span>
              </el-option>
            </el-select>
            <el-input
              v-model="textarea"
              prefix-icon="el-icon-phone"
              placeholder="请输入方法参数"
              v-if="value!=''&&jobDetails[(value-1)].methodArgType=='java.lang.String'"
            ></el-input>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              :rows="5"
              v-model="textarea"
              v-else-if="value!=''&&jobDetails[(value-1)].methodArgType!='java.lang.String'&&jobDetails[(value-1)].methodArgType!=null"
            ></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelInsertTask">取 消</el-button>
            <el-button type="primary" @click="insertJob">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-drawer :visible.sync="drawer" :with-header="false">
          <div class="job-drawer">
            <div>
              <span>修改任务详情</span>
            </div>
            <div>
              <el-form
                label-width="100px"
                class="demo-ruleForm"
                :model="updateJobForm"
                ref="updateJobForm"
              >
                <el-form-item label="任务名称" prop="jobName">
                  <el-input
                    v-model="updateJobForm.jobName"
                    :placeholder="updateJobDetail.jobName"
                    :disabled="defaultSwitch?false:true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="任务介绍" prop="jobIntroduction">
                  <el-input
                    v-model="updateJobForm.jobIntroduction"
                    :placeholder="updateJobDetail.jobIntroduction"
                    :disabled="defaultSwitch?false:true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="任务方法" prop="methodName">
                  <el-select
                    v-model="updateJobMethod"
                    :placeholder="updateJobDetail.methodName"
                    clearable
                    :disabled="defaultSwitch?false:true"
                    visible-change="changeSelect"
                  >
                    <el-option
                      v-for="(item,index) in jobDetails"
                      :key="item.id"
                      :label="item.methodIntroduction"
                      :value="index"
                      :disabled="item.id==updateJobDetail.detailId"
                    >
                      <span style="float: left">{{ item.methodName }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.methodIntroduction }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="cron" prop="cronExpression">
                  <el-popover
                    v-model="updateCronPopover"
                    placement="right"
                    :disabled="defaultSwitch?false:true"
                  >
                    <el-input
                      slot="reference"
                      @click="updateCronPopover=true"
                      v-model="updateJobForm.cronExpression"
                      placeholder="请输入定时策略"
                    ></el-input>
                    <cron @change="changeUpdateCron" @close="updateCronPopover=false" i18n="cn"></cron>
                  </el-popover>
                </el-form-item>
                <el-form-item label="任务参数" prop="methodParams">
                  <el-input
                    v-model="updateJobArgType"
                    disabled
                    v-if="updateJobDetail.methodArgType == null"
                  ></el-input>
                  <el-input
                    type="textarea"
                    v-model="updateJobForm.methodParams"
                    :rows="5"
                    :placeholder="updateJobDetail.methodParams"
                    :disabled="defaultSwitch?false:true"
                    v-else
                  ></el-input>
                </el-form-item>
                <el-form-item label="修改任务">
                  <el-switch v-model="defaultSwitch"></el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateJobFrom">立即修改</el-button>
                  <el-button @click="resetForm('updateJobForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { cron } from "vue-cron";
export default {
  name: "tasks",
  components: {
    cron,
  },
  data() {
    return {
      cronPopover: false,
      updateCronPopover: false,
      tableData: [],
      insertDialogFormVisible: false,
      updateDialogFormVisible: false,
      dialogWidht: "30%",
      defaultSwitch: false,
      size: 10,
      page: 1,
      total: 0,
      userDetails: {},
      queryName: "",
      updateJob: {
        id: 0,
        jobName: "",
        jobIntroduction: "",
        cronExpression: "",
        methodParams: "",
        status: 1,
        deleteFlag: 0,
        detailId: 0,
      },
      jobForm: {
        jobName: "",
        jobIntroduction: "",
        cronExpression: "",
      },
      updateJobForm: {
        jobName: "",
        jobIntroduction: "",
        cronExpression: "",
        methodParams: "",
      },
      jobDetails: [],
      value: "",
      textarea: "",
      drawer: false,
      updateJobDetail: {},
      updateJobMethod: "",
      updateJobArgType: "无参数方法",
    };
  },
  methods: {
    changeCron(val) {
      this.jobForm.cronExpression = val;
    },
    changeUpdateCron(val) {
      console.log(val);
      this.updateJobForm.cronExpression = val;
    },
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
    getAllJobDetails() {
      axios({
        method: "get",
        url: "/api/scheduleDetail/",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.jobDetails = res.data.data;
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
        url: "/api/job/status/",
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
        url: "/api/job/status/",
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
        url: "/api/job/status/",
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
        url: "/api/job/status/",
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
    findTaskByQueryName() {
      (this.page = 1),
        axios({
          method: "get",
          url: "/api/job/" + this.page + "/" + this.size + "/" + this.queryName,
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
    changeFindTask() {
      (this.queryName = ""), this.getAllJob();
    },
    cancelInsertTask() {
      this.insertDialogFormVisible = false;
      this.value = "";
      this.textarea = "";
      this.jobForm.cronExpression = "";
      this.jobForm.jobName = "";
      this.jobForm.jobIntroduction = "";
    },
    insertJob() {
      console.log(this.jobForm);
      console.log(this.value);
      let formData = new FormData();
      for (var key in this.jobForm) {
        formData.append(key, this.jobForm[key]);
      }
      formData.append("detailId", this.value);
      formData.append("methodParams", this.textarea);
      axios({
        method: "post",
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
            this.insertDialogFormVisible = false;
            this.value = "";
            this.textarea = "";
            this.jobForm.cronExpression = "";
            this.jobForm.jobName = "";
            this.jobForm.jobIntroduction = "";
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
    openDrawer(val) {
      this.drawer = true;
      this.updateJobDetail = val;
    },
    resetForm(formName) {
      console.log(formName);
      this.$refs[formName].resetFields();
    },
    updateJobFrom() {
      let formData = new FormData();
      for (var key in this.updateJobForm) {
        formData.append(key, this.updateJobForm[key]);
      }
      formData.append("id", this.updateJobDetail.id);
      if (this.jobDetails[this.updateJobMethod] != undefined) {
        formData.append("detailId", this.jobDetails[this.updateJobMethod].id);
      }
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
            this.drawer = false;
            this.defaultSwitch = false;
            this.updateJobForm.jobName = "";
            this.updateJobForm.cronExpression = "";
            this.updateJobForm.detailId = "";
            this.updateJobForm.jobIntroduction = "";
            this.updateJobForm.methodParams = "";
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
    changeSelect(val) {
      console.log(val);
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllJob();
    this.getAllJobDetails();
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

    > div:nth-of-type(4) {
      .el-dialog__body {
        display: flex;
        justify-content: center;

        .insert-task-from {
          width: 80%;

          > .el-input {
            width: 100%;
            margin-top: 20px;
            text-align: center;
          }

          .el-select {
            width: 100%;
            margin-top: 20px;
          }

          .el-textarea {
            margin-top: 20px;
          }
          > span {
            > .el-input {
              width: 100%;
              margin-top: 20px;
              text-align: center;
            }
          }
        }
      }
    }

    > div:nth-of-type(5) {
      .el-drawer {
        height: 100%;
        width: 40%;

        .el-drawer__body {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;

          > .job-drawer {
            width: 80%;

            > div:nth-of-type(1) {
              margin: 20px 0px;
              width: 100%;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              font-size: 20px;
              color: rgba(31, 30, 29, 0.6);
              display: flex;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
