<template>
  <div class="head">
    <el-input
      placeholder="请输入供应商名称"
      prefix-icon="el-icon-search"
      v-model="params.supplierName"
      size="small"
      clearable
    >
    </el-input>
    <el-input
      placeholder="请输入供应商电话号"
      prefix-icon="el-icon-search"
      v-model="params.supplierTelephone"
      size="small"
      clearable
    >
    </el-input>
    <el-input
      placeholder="请输入供应商邮箱号"
      prefix-icon="el-icon-search"
      v-model="params.supplierEmail"
      size="small"
      clearable
    >
    </el-input>
    <el-select
      size="small"
      v-model="params.supplierStatus"
      placeholder="请选择状态"
      clearable
    >
      <el-option
        v-for="item in statusArr"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button
      type="primary"
      size="small"
      @click="toQuery"
      icon="el-icon-search"
      >搜索
    </el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">
      新增
    </el-button>
    <el-popconfirm
      confirmButtonText="确定"
      cancelButtonText="取消"
      icon="el-icon-info"
      iconColor="red"
      title="确定导出当前供应商吗？"
      class="head-span"
      @onConfirm="toExport"
    >
      <el-button
        slot="reference"
        icon="el-icon-download"
        type="primary"
        size="small"
        >导出
      </el-button>
    </el-popconfirm>
  </div>
</template>

<script>
import { STATUS } from "../utils/constant";
import { exportSupplier } from "@/api/supplier";
import { exportFile } from "@/utils";
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusArr: STATUS, // 供应商状态
    };
  },
  methods: {
    // 搜索
    toQuery() {
      this.$parent.getSupplierByQuery();
    },

    // 新增
    toAdd() {
      this.$parent.addSupplierVisible = true;
    },

    // 导出
    toExport() {
      exportSupplier(this.params)
        .then((resp) => {
          exportFile(resp, "供应商");
        })
        .catch(() => {
          this.$message.error("导出失败，请稍后重试");
        });
    },
  },
};
</script>
