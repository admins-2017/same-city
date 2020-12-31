<template>
  <div class="suppliers">
    <!-- 搜索 -->
    <supplier-head :params="params" />

    <!-- 列表 -->
    <el-table :data="list" v-loading="load" size="small">
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
          <el-button @click="toUpdate(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="text"
            size="small"
            class="danger-text-btn"
            v-if="scope.row.supplierStatus"
            @click="updateSupplierStatus(scope.row.supplierId, 0)"
            >删除
          </el-button>
          <el-button
            type="text"
            @click="updateSupplierStatus(scope.row.supplierId, 1)"
            size="small"
            class="success-text-btn"
            v-else
            >恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :config="params" @change="getSupplierByQuery" />

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

import { fromRule } from "./utils/rule";
import { getSupplier } from "@/api/supplier";
import supplierHead from "./modules/head";
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "suppliers",
  components: {
    supplierHead,
    pagination,
  },
  data() {
    return {
      params: {
        total: 0, // 总数
        page: 1, // 页数
        size: 10, // 条数
        supplierName: "",
        supplierTelephone: "",
        supplierEmail: "",
        supplierStatus: "",
      },
      list: [], // 列表
      load: false,

      addSupplierVisible: false,
      updateSupplierVisible: false,
      addSupplierForm: {
        supplierId: "",
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
      rules: fromRule,
    };
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getSupplierByQuery();
  },
  methods: {
    // 搜索
    getSupplierByQuery() {
      getSupplier(this.params)
        .then((res) => {
          this.list = res.data.records;
          this.params.total = res.data.total;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 编辑
    toUpdate(row) {
      this.updateSupplierVisible = true;
      this.updateSupplierForm = row;
    },

    // 添加
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSupplier();
        } else {
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
        .catch(() => {
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
        .catch(() => {
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
            this.getSupplierByQuery();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>
