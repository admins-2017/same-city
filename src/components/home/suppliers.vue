<template>
  <div id="suppliers">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <span>供应商详情</span>
          </div>
          <div>
            <div>
              <el-input
                placeholder="请输入供应商名称"
                prefix-icon="el-icon-search"
                v-model="queryName"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入供应商电话号"
                prefix-icon="el-icon-search"
                v-model="queryTel"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入供应商邮箱号"
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
              <el-button
                size="small"
                @click="getSupplierByQuery"
                icon="el-icon-search"
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
                @click="addSupplierVisible = true"
                >新增</el-button
              >
            </div>
          </div>
        </div>
        <div>
          <el-table :data="supplierData" height="80%" stripe>
            <el-table-column fixed prop="supplierId" label="ID">
            </el-table-column>
            <el-table-column
              prop="supplierName"
              show-overflow-tooltip
              label="名称"
            >
            </el-table-column>
            <el-table-column
              prop="supplierAddress"
              show-overflow-tooltip
              label="联系地址"
            >
            </el-table-column>
            <el-table-column prop="supplierTelephone" label="联系方式">
            </el-table-column>
            <el-table-column
              prop="supplierEmail"
              label="联系邮箱"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="supplierPerson" label="联系人">
            </el-table-column>
            <el-table-column
              prop="supplierBusiness"
              show-overflow-tooltip
              label="提供业务"
            >
            </el-table-column>
            <el-table-column prop="supplierStatus" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.supplierStatus"
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
                  v-if="scope.row.supplierStatus"
                  @click="updateSupplierStatus(scope.row.supplierId, 0)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click="updateSupplierStatus(scope.row.supplierId, 1)"
                  size="small"
                  v-else
                  >恢复</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-info"
              iconColor="red"
              title="确定导出当前供应商吗？"
              @onConfirm="exportSupplier"
            >
              <el-button slot="reference" size="small">导出当前信息</el-button>
            </el-popconfirm>
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
        title="新增供应商"
        :visible.sync="addSupplierVisible"
        width="40%"
        :before-close="handleAddClose"
        center
      >
        <el-form
          :model="addSupplierForm"
          :rules="rules"
          ref="addSupplierForm"
          label-width="150px"
          class="demo-ruleForm"
          label-position="left"
        >
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="addSupplierForm.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="供应商注册资金" prop="supplierCapital">
            <el-input v-model="addSupplierForm.supplierCapital"></el-input>
          </el-form-item>
          <el-form-item label="供应生产地址" prop="supplierAddress">
            <el-input v-model="addSupplierForm.supplierAddress"></el-input>
          </el-form-item>
          <el-form-item label="供应商负责人" prop="supplierPerson">
            <el-input v-model="addSupplierForm.supplierPerson"></el-input>
          </el-form-item>
          <el-form-item label="供应商联系电话" prop="supplierTelephone">
            <el-input v-model="addSupplierForm.supplierTelephone"></el-input>
          </el-form-item>
          <el-form-item label="供应商电子邮箱" prop="supplierEmail">
            <el-input v-model="addSupplierForm.supplierEmail">
              <template slot="append">.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="供应商主营业务" prop="supplierBusiness">
            <el-input v-model="addSupplierForm.supplierBusiness"></el-input>
          </el-form-item>
          <el-form-item label="与供应商曾是否合作">
            <el-select
              v-model="addSupplierForm.supplierCooperated"
              placeholder="请选择"
            >
              <el-option label="否" value="false"></el-option>
              <el-option label="是" value="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addSupplierForm')"
              >添加</el-button
            >
            <el-button @click="resetForm('addSupplierForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="修改供应商"
        :visible.sync="updateSupplierVisible"
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
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input
              v-model="updateForm.supplierName"
              :placeholder="updateSupplierForm.supplierName"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商注册资金" prop="supplierCapital">
            <el-input
              v-model="updateForm.supplierCapital"
              :placeholder="updateSupplierForm.supplierCapital"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应生产地址" prop="supplierAddress">
            <el-input
              v-model="updateForm.supplierAddress"
              :placeholder="updateSupplierForm.supplierAddress"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商负责人" prop="supplierPerson">
            <el-input
              v-model="updateForm.supplierPerson"
              :placeholder="updateSupplierForm.supplierPerson"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商联系电话" prop="supplierTelephone">
            <el-input
              v-model="updateForm.supplierTelephone"
              :placeholder="updateSupplierForm.supplierTelephone"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商电子邮箱" prop="supplierEmail">
            <el-input
              v-model="updateForm.supplierEmail"
              :placeholder="updateSupplierForm.supplierEmail"
            >
              <template slot="append">.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="供应商主营业务" prop="supplierBusiness">
            <el-input
              v-model="updateForm.supplierBusiness"
              :placeholder="updateSupplierForm.supplierBusiness"
            ></el-input>
          </el-form-item>
          <el-form-item label="与供应商曾是否合作">
            <el-select
              v-model="updateForm.supplierCooperated"
              :placeholder="updateSupplierForm.supplierCooperated ? '是' : '否'"
              clearable
            >
              <el-option
                label="否"
                :disabled="updateSupplierForm.supplierCooperated == false"
                value="false"
              ></el-option>
              <el-option
                label="是"
                :disabled="updateSupplierForm.supplierCooperated == true"
                value="true"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdateForm()"
              >修改</el-button
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
  name: "suppliers",
  data() {
    return {
      queryName: "",
      queryTel: "",
      queryMail: "",
      queryStatus: "",
      size: 10,
      page: 1,
      total: 0,
      supplierData: [],
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
      addSupplierVisible: false,
      updateSupplierVisible: false,
      addSupplierForm: {
        supplierName: "",
        supplierCapital: "",
        supplierAddress: "",
        supplierPerson: "",
        supplierTelephone: "",
        supplierEmail: "",
        supplierBusiness: "",
        supplierCooperated: "",
      },
      updateSupplierForm: {},
      updateForm: {
        supplierName: "",
        supplierCapital: "",
        supplierAddress: "",
        supplierPerson: "",
        supplierTelephone: "",
        supplierEmail: "",
        supplierBusiness: "",
        supplierCooperated: "",
      },
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        supplierAddress: [
          { required: true, message: "请输入供应商地址", trigger: "blur" },
        ],
        supplierPerson: [
          {
            required: true,
            message: "请输入供应商负责人名称",
            trigger: "blur",
          },
          { min: 2, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        supplierTelephone: [
          { required: true, message: "请输入供应商联系方式", trigger: "blur" },
        ],
        supplierEmail: [
          { required: true, message: "请输入供应商邮箱地址", trigger: "blur" },
        ],
        supplierBusiness: [
          { required: true, message: "请输入供应商主营业务", trigger: "blur" },
        ],
        supplierCooperated: [
          {
            type: "array",
            required: true,
            message: "请选择是否合作",
            trigger: "change",
          },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
      this.updateSupplierVisible = true;
      this.updateSupplierForm = row;
    },
    handleCurrentChange(val) {
      this.page = val;
      if (
        this.queryName != "" ||
        this.queryTel != "" ||
        this.queryMail != "" ||
        this.queryStatus != ""
      ) {
        this.getSupplierByQuery();
      } else {
        this.getSupplier();
      }
    },
    handleAddClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          console.log(_);
          this.clearAddSupplierFormByClose();
          done();
        })
        .catch((_) => {
          console.log(_);
          console.log(this.addSupplierForm);
        });
    },
    handleUpdateClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          console.log(_);
          this.clearUpdateSupplierFormByClose();
          done();
        })
        .catch((_) => {
          console.log(_);
        });
    },
    getSupplier() {
      axios({
        method: "get",
        url: "/api/supplier/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.supplierData = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    submitForm(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSupplier();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    clearAddSupplierFormByClose() {
      console.log("执行clearAddSupplierFormByClose");
      this.$refs["addSupplierForm"].resetFields();
    },
    submitUpdateForm() {
      console.log(this.updateForm);
      let formData = new FormData();
      for (var key in this.updateForm) {
        if (key === "supplierEmail" && this.updateForm[key] != "") {
          this.updateForm[key] += ".com";
        }
        formData.append(key, this.updateForm[key]);
      }
      formData.append("supplierId", this.updateSupplierForm.supplierId);
      axios({
        method: "put",
        url: "/api/supplier/",
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
            this.updateSupplierVisible = false;
            this.updateForm = {};
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
    resetUpdateForm(formName) {
      this.$refs[formName].resetFields();
    },
    clearUpdateSupplierFormByClose() {
      this.updateSupplierForm = {};
      this.updateForm = {};
    },
    addSupplier() {
      let formData = new FormData();
      for (var key in this.addSupplierForm) {
        if (key === "supplierEmail") {
          this.addSupplierForm[key] += ".com";
        }
        formData.append(key, this.addSupplierForm[key]);
      }
      console.log(formData);
      axios({
        method: "post",
        url: "/api/supplier/",
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
            this.addSupplierVisible = false;
            this.$refs["addSupplierForm"].resetFields();
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
    updateSupplierStatus(val1, val2) {
      axios({
        method: "put",
        url: "/api/supplier/status/" + val2 + "/" + val1,
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
            this.getSupplier();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getSupplierByQuery() {
      let getUrl =
        "/api/supplier/query?page=" + this.page + "&size=" + this.size;
      if (this.queryName != "") {
        getUrl += "&supplierName=" + this.queryName;
      }
      if (this.queryTel != "") {
        getUrl += "&supplierTelephone=" + this.queryTel;
      }
      if (this.queryMail != "") {
        getUrl += "&supplierEmail=" + this.queryMail;
      }
      if (this.queryStatus != "") {
        getUrl += "&supplierStatus=" + this.queryStatus;
      }
      axios({
        method: "get",
        url: getUrl,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.supplierData = res.data.data.records;
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
      this.getSupplier();
    },
    exportSupplier() {
      let getUrl =
        "/api/supplier/export?page=" + this.page + "&size=" + this.size;
      if (this.queryName != "") {
        getUrl += "&supplierName=" + this.queryName;
      }
      if (this.queryTel != "") {
        getUrl += "&supplierTelephone=" + this.queryTel;
      }
      if (this.queryMail != "") {
        getUrl += "&supplierEmail=" + this.queryMail;
      }
      if (this.queryStatus != "") {
        getUrl += "&supplierStatus=" + this.queryStatus;
      }
      axios({
        method: "get",
        url: getUrl,
        responseType: "blob",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          const blob = new Blob([res.data], {
            //取响应回来的数据
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          const downloadElement = document.createElement("a");
          downloadElement.href = href;
          downloadElement.download = decodeURI(res.headers["filename"]);
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((fail) => {
          this.$message.error("导出结果为空，无法导出");
          console.error(fail);
        });
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    console.log(this.userDetails);
    this.getSupplier();
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
#suppliers {
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
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
