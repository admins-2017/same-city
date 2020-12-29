<template>
  <div class="client" shadow="never">
    <div slot="header" class="head">
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
      <el-button
        type="primary"
        size="small"
        @click="findClient"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addClientVisible = true"
        >新增</el-button
      >
      <el-popconfirm
        confirmButtonText="确定"
        cancelButtonText="取消"
        class="head-span"
        icon="el-icon-info"
        iconColor="red"
        title="确定导出当前客户吗？"
        @onConfirm="exportClient"
      >
        <el-button
          slot="reference"
          type="primary"
          icon="el-icon-download"
          size="small"
          >导出</el-button
        >
      </el-popconfirm>
    </div>
    <el-table :data="clientData" v-loading="load" size="small">
      <el-table-column prop="clientId" label="ID" show-overflow-tooltip />
      <el-table-column prop="clientName" label="名称" show-overflow-tooltip />
      <el-table-column
        prop="clientAddress"
        show-overflow-tooltip
        label="联系地址"
      />
      <el-table-column
        prop="clientPhone"
        label="联系方式"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientEmail"
        label="联系邮箱"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientBirthday"
        label="客户生日"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientDesc"
        show-overflow-tooltip
        label="提供简介"
      />
      <el-table-column
        prop="clientGender"
        label="客户性别"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag class="boy" v-if="scope.row.clientGender">
            男
          </el-tag>
          <el-tag class="girl" v-else>女</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientStatus"
        label="客户状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.clientStatus">
            正常
          </el-tag>
          <el-tag type="danger" v-else>删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            type="text"
            size="small"
            class="danger-text-btn"
            v-if="scope.row.clientStatus"
            @click="updateClientStatus(scope.row.clientId, 0)"
            >删除</el-button
          >
          <el-button
            type="text"
            @click="updateClientStatus(scope.row.clientId, 1)"
            size="small"
            class="success-text-btn"
            v-else
            >恢复</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="size"
      :current-page="page"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="新增客户" :visible.sync="addClientVisible" width="50%">
      <el-form
        :model="addClientForm"
        :rules="rules"
        ref="addClientForm"
        label-position="top"
        class="row-form"
      >
        <el-form-item label="客户名称" prop="clientName">
          <el-input
            size="small"
            placeholder="请输入客户名称"
            v-model="addClientForm.clientName"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="clientPhone">
          <el-input
            size="small"
            placeholder="请输入联系方式"
            v-model="addClientForm.clientPhone"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="clientAddress">
          <el-input
            size="small"
            placeholder="请输入联系地址"
            v-model="addClientForm.clientAddress"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="clientGender">
          <el-select
            size="small"
            v-model="addClientForm.clientGender"
            placeholder="请选择客户性别"
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
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户邮箱" prop="clientEmail">
          <el-input
            size="small"
            placeholder="请输入客户邮箱"
            v-model="addClientForm.clientEmail"
          >
            <template slot="append">.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户简介" prop="clientDesc">
          <el-input
            type="textarea"
            size="small"
            placeholder="请输入客户简介"
            v-model="addClientForm.clientDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm('addClientForm')">
          重置
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="submitForm('addClientForm')"
          >添加
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改供应商"
      :visible.sync="updateClientVisible"
      width="50%"
    >
      <el-form
        :model="updateForm"
        label-position="left"
        ref="updateForm"
        class="row-form"
      >
        <el-form-item label="客户名称" prop="clientName">
          <el-input
            size="small"
            v-model="updateForm.clientName"
            :placeholder="updateClientForm.clientName"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="clientPhone">
          <el-input
            size="small"
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
            size="small"
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
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户邮箱" prop="clientEmail">
          <el-input
            size="small"
            v-model="updateForm.clientEmail"
            :placeholder="updateClientForm.clientEmail"
          >
            <template slot="append">.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户简介" prop="clientDesc">
          <el-input
            size="small"
            type="textarea"
            v-model="updateForm.clientDesc"
            :placeholder="updateClientForm.clientDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetUpdateForm('updateForm')">
          重置
        </el-button>
        <el-button size="small" type="primary" @click="submitUpdateForm()">
          修改
        </el-button>
      </div>
    </el-dialog>
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
      load: false,
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
    getClient() {
      this.load = true;
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
          this.load = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
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
    exportClient() {
      let getUrl =
        "/api/client/export?page=" + this.page + "&size=" + this.size;
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
    this.getClient();
  },
};
</script>

<style lang="scss" scoped></style>
