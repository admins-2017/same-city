<template>
  <div id="clients">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <span>客户详情</span>
          </div>
          <div>
            <div>
              <el-input
                placeholder="请输入客户名称"
                prefix-icon="el-icon-search"
                v-model="queryName"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入客户电话号"
                prefix-icon="el-icon-search"
                v-model="queryTel"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入供客户邮箱号"
                prefix-icon="el-icon-search"
                v-model="queryMail"
                size="small"
              >
              </el-input>
              <el-select
                size="small"
                v-model="queryStatus"
                clearable
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in sexs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <el-button size="small" @click="findClient" icon="el-icon-search"
                >搜索</el-button
              >
              <el-button
                size="small"
                icon="el-icon-circle-close"
                @click="changeQuery"
                >取消</el-button
              >
              <el-button
                size="small"
                icon="el-icon-circle-plus-outline"
                @click="addClientVisible = true"
                >新增</el-button
              >
            </div>
          </div>
        </div>
        <div>
          <el-table :data="clientData" height="80%" stripe>
            <el-table-column
              fixed
              prop="clientId"
              show-overflow-tooltip
              label="ID"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="clientName"
              show-overflow-tooltip
              label="名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="clientAddress"
              show-overflow-tooltip
              label="联系地址"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="clientPhone" align="center" label="联系方式">
            </el-table-column>
            <el-table-column
              prop="clientEmail"
              label="联系邮箱"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="clientBirthday"
              align="center"
              label="客户生日"
            >
            </el-table-column>
            <el-table-column
              prop="clientDesc"
              show-overflow-tooltip
              label="提供简介"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="clientGender"
              label="客户性别"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.clientGender">男</el-tag>
                <el-tag type="warning" v-else>女</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="clientStatus"
              align="center"
              label="客户状态"
            >
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.clientStatus"
                  >正常</el-tag
                >
                <el-tag type="info" v-else>删除</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.clientStatus"
                  @click="updateClientStatus(scope.row.clientId, 0)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click="updateClientStatus(scope.row.clientId, 1)"
                  size="small"
                  v-else
                  >恢复</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="size"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <el-dialog
        title="新增客户"
        :visible.sync="addClientVisible"
        width="40%"
        :before-close="handleAddClose"
        center
      >
        <el-form
          :model="addClientForm"
          :rules="rules"
          ref="addClientForm"
          label-width="150px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="客户名称" prop="clientName">
            <el-input v-model="addClientForm.clientName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="clientPhone">
            <el-input v-model="addClientForm.clientPhone"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="clientAddress">
            <el-input v-model="addClientForm.clientAddress"></el-input>
          </el-form-item>
          <el-form-item label="客户性别" prop="clientGender">
            <el-select
              v-model="addClientForm.clientGender"
              placeholder="请选择"
            >
              <el-option label="女" value="false"></el-option>
              <el-option label="男" value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户生日" prop="clientBirthday">
            <el-date-picker
              v-model="addClientForm.clientBirthday"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户邮箱" prop="clientEmail">
            <el-input v-model="addClientForm.clientEmail">
              <template slot="append">.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="客户简介" prop="clientDesc">
            <el-input
              type="textarea"
              v-model="addClientForm.clientDesc"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addClientForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('addClientForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="修改供应商"
        :visible.sync="updateClientVisible"
        width="40%"
        :before-close="handleUpdateClose"
        center
      >
        <el-form
          :model="updateForm"
          label-width="150px"
          class="demo-ruleForm"
          label-position="left"
          ref="updateForm"
        >
          <el-form-item label="客户名称" prop="clientName">
            <el-input
              v-model="updateForm.clientName"
              :placeholder="updateClientForm.clientName"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="clientPhone">
            <el-input
              v-model="updateForm.clientPhone"
              :placeholder="updateClientForm.clientPhone"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="clientAddress">
            <el-input
              v-model="updateForm.clientAddress"
              :placeholder="updateClientForm.clientAddress"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户性别" prop="clientGender">
            <el-select
              v-model="updateForm.clientGender"
              :placeholder="updateClientForm.clientGender ? '男' : '女'"
            >
              <el-option
                label="女"
                :disabled="updateClientForm.clientGender === false"
                value="false"
              ></el-option>
              <el-option
                label="男"
                :disabled="updateClientForm.clientGender === true"
                value="true"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户生日" prop="clientBirthday">
            <el-date-picker
              v-model="updateForm.clientBirthday"
              type="date"
              :placeholder="updateClientForm.clientBirthday"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户邮箱" prop="clientEmail">
            <el-input
              v-model="updateForm.clientEmail"
              :placeholder="updateClientForm.clientEmail"
            >
              <template slot="append">.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="客户简介" prop="clientDesc">
            <el-input
              type="textarea"
              v-model="updateForm.clientDesc"
              :placeholder="updateClientForm.clientDesc"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdateForm()"
              >立即创建</el-button
            >
            <el-button @click="resetUpdateForm('updateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "client",
  data() {
    return {
      queryName: "",
      queryTel: "",
      queryMail: "",
      queryStatus: "",
      size: 10,
      page: 1,
      total: 0,
      clientData: [],
      sexs: [
        {
          value: "false",
          label: "删除",
        },
        {
          value: "true",
          label: "正常",
        },
      ],
      addClientVisible: false,
      updateClientVisible: false,
      addClientForm: {
        clientName: "",
        clientPhone: "",
        clientAddress: "",
        clientGender: "",
        clientBirthday: "",
        clientEmail: "",
        clientDesc: "",
      },
      updateClientForm: {},
      updateForm: {
        clientName: "",
        clientPhone: "",
        clientAddress: "",
        clientGender: "",
        clientBirthday: "",
        clientEmail: "",
        clientDesc: "",
      },
      rules: {
        clientName: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        clientPhone: [
          { required: true, message: "请输入客户联系方式", trigger: "blur" },
        ],
        clientAddress: [
          {
            required: true,
            message: "请输入客户联系地址",
            trigger: "blur",
          },
        ],
        clientGender: [
          { required: true, message: "请选择客户性别", trigger: "blur" },
        ],
        clientBirthday: [
          { required: true, message: "请选择客户生日日期", trigger: "blur" },
        ],
        clientEmail: [
          { required: true, message: "请输入客户邮箱", trigger: "blur" },
        ],
        clientDesc: [
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
      this.updateClientVisible = true;
      this.updateClientForm = row;
    },
    handleCurrentChange(val) {
      this.page = val;
      if (
        this.queryName != "" ||
        this.queryTel != "" ||
        this.queryMail != "" ||
        this.queryStatus != ""
      ) {
        this.getClientByQuery();
      } else {
        this.getClient();
      }
    },
    handleAddClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          console.log(_);
          this.clearAddClientFormByClose();
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    handleUpdateClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          console.log(_);
          this.clearUpdateClientFormByClose();
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    getClient() {
      axios({
        method: "get",
        url: "/api/client/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.clientData = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addClient();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    clearAddClientFormByClose() {
      this.$refs["addClientForm"].resetFields();
    },
    submitUpdateForm() {
      console.log(this.updateForm);
      let formData = new FormData();
      for (var key in this.updateForm) {
        if (key === "clientEmail" && this.updateForm[key] != "") {
          this.updateForm[key] += ".com";
        }
        formData.append(key, this.updateForm[key]);
      }
      formData.append("clientId", this.updateClientForm.clientId);
      axios({
        method: "put",
        url: "/api/client/",
        headers: {
          Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.updateClientVisible = false;
            this.updateForm = {};
            this.handleCurrentChange(this.page);
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    resetUpdateForm(formName) {
      this.$refs[formName].resetFields();
    },
    clearUpdateClientFormByClose() {
      this.$refs["updateForm"].resetFields();
      this.updateClientForm = {};
    },
    addClient() {
      let formData = new FormData();
      for (var key in this.addClientForm) {
        if (key === "clientEmail") {
          this.addClientForm[key] += ".com";
        }
        formData.append(key, this.addClientForm[key]);
      }
      axios({
        method: "post",
        url: "/api/client/",
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
            this.addClientVisible = false;
            this.$refs["addClientForm"].resetFields();
            this.handleCurrentChange(1);
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    updateClientStatus(val1, val2) {
      axios({
        method: "put",
        url: "/api/client/status/" + val1 + "/" + val2,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.getClient();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    findClient() {
      this.page = 1;
      this.getClientByQuery();
    },
    getClientByQuery() {
      let getUrl = "/api/client/query?page=" + this.page + "&size=" + this.size;
      if (this.queryName != "") {
        getUrl += "&clientName=" + this.queryName;
      }
      if (this.queryTel != "") {
        getUrl += "&clientPhone=" + this.queryTel;
      }
      if (this.queryMail != "") {
        getUrl += "&clientEmail=" + this.queryMail;
      }
      if (this.queryStatus != "") {
        getUrl += "&clientStatus=" + this.queryStatus;
      }
      axios({
        method: "get",
        url: getUrl,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.clientData = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    changeQuery() {
      this.queryName = "";
      this.queryTel = "";
      this.queryMail = "";
      this.queryStatus = "";
      this.page = 1;
      this.getClient();
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    console.log(this.userDetails);
    this.getClient();
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
  overflow: hidden;
}
#clients {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(1) {
    width: 100%;
    height: 100%;
    display: flex;
    > .el-card {
      width: 100%;
      height: 90%;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-card__header {
        width: 98%;
        height: 10%;
        .clearfix {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div:nth-of-type(1) {
            font-size: 20px;
            color: rgb(138, 138, 138);
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            > span {
              line-height: 100%;
            }
          }
          > div:nth-of-type(2) {
            width: 80%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div:nth-of-type(1) {
              width: 70%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              > .el-input {
                width: 25%;
                height: 100%;
                margin-right: 10px;
              }
              > .el-select {
                width: 25%;
                margin-right: 10px;
                > .el-input {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            div:nth-of-type(2) {
              width: 25%;
              display: flex;
              justify-content: flex-end;
              .el-button {
                height: 95%;
              }
            }
          }
        }
      }
      .el-card__body {
        width: 98%;
        height: 90%;
        > div:nth-of-type(1) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 96%;
          .el-table {
            width: 100%;
          }
          // 去除el.table流体高度的滚动条
          ::-webkit-scrollbar {
            width: 1px;
            height: 1px;
          }
          // ::-webkit-scrollbar-thumb {
          //   background-color: #a1a3a9;
          //   border-radius: 0px;
          // }
          > div:nth-of-type(2) {
            width: 100%;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
