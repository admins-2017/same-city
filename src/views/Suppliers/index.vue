<template>
  <div class="suppliers">
    <div class="head">
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
      <el-button
        type="primary"
        size="small"
        @click="getSupplierByQuery"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addSupplierVisible = true"
        >新增</el-button
      >
      <el-popconfirm
        confirmButtonText="确定"
        cancelButtonText="取消"
        icon="el-icon-info"
        iconColor="red"
        title="确定导出当前供应商吗？"
        class="head-span"
        @onConfirm="exportSupplier"
      >
        <el-button
          slot="reference"
          icon="el-icon-download"
          type="primary"
          size="small"
          >导出</el-button
        >
      </el-popconfirm>
    </div>
    <el-table :data="supplierData" v-loading="load" size="small">
      <el-table-column prop="supplierId" label="ID" show-overflow-tooltip />
      <el-table-column prop="supplierName" show-overflow-tooltip label="名称" />
      <el-table-column
        prop="supplierAddress"
        show-overflow-tooltip
        label="联系地址"
      />
      <el-table-column prop="supplierTelephone" label="联系方式" />
      <el-table-column
        prop="supplierEmail"
        label="联系邮箱"
        show-overflow-tooltip
      />
      <el-table-column prop="supplierPerson" label="联系人" />
      <el-table-column
        prop="supplierBusiness"
        show-overflow-tooltip
        label="提供业务"
      />
      <el-table-column prop="supplierStatus" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.supplierStatus">正常</el-tag>
          <el-tag type="danger" v-else>删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            type="text"
            size="small"
            class="danger-text-btn"
            v-if="scope.row.supplierStatus"
            @click="updateSupplierStatus(scope.row.supplierId, 0)"
            >删除</el-button
          >
          <el-button
            type="text"
            @click="updateSupplierStatus(scope.row.supplierId, 1)"
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

    <el-dialog
      title="新增供应商"
      :visible.sync="addSupplierVisible"
      width="60%"
      center
    >
      <el-form
        :model="addSupplierForm"
        :rules="rules"
        ref="addSupplierForm"
        class="row-form"
        label-position="top"
      >
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input
            v-model="addSupplierForm.supplierName"
            placeholder="供应商名称"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商注册资金" prop="supplierCapital">
          <el-input
            v-model="addSupplierForm.supplierCapital"
            placeholder="供应商注册资金"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应生产地址" prop="supplierAddress">
          <el-input
            v-model="addSupplierForm.supplierAddress"
            placeholder="供应生产地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商负责人" prop="supplierPerson">
          <el-input
            v-model="addSupplierForm.supplierPerson"
            placeholder="供应商负责人"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商联系电话" prop="supplierTelephone">
          <el-input
            v-model="addSupplierForm.supplierTelephone"
            placeholder="供应商联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商电子邮箱" prop="supplierEmail">
          <el-input
            v-model="addSupplierForm.supplierEmail"
            placeholder="供应商电子邮箱"
          >
            <template slot="append">.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商主营业务" prop="supplierBusiness">
          <el-input
            v-model="addSupplierForm.supplierBusiness"
            placeholder="供应商主营业务"
          ></el-input>
        </el-form-item>
        <el-form-item label="与供应商曾是否合作">
          <el-select
            v-model="addSupplierForm.supplierCooperated"
            placeholder="与供应商曾是否合作"
          >
            <el-option label="否" value="false"></el-option>
            <el-option label="是" value="true"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addSupplierForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('addSupplierForm')">
          添加
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改供应商"
      :visible.sync="updateSupplierVisible"
      width="60%"
    >
      <el-form
        :model="updateForm"
        ref="updateForm"
        class="row-form"
        label-position="top"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateForm')">重置</el-button>
        <el-button type="primary" @click="submitUpdateForm()">修改</el-button>
      </div>
    </el-dialog>
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
      load: false,
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

    // 查询供应商
    getSupplier() {
      this.load = true;
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
          this.load = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },

    // 添加
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

    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 修改
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

    // 新增
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

    // 搜索
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

    // 导出
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
