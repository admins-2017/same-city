<template>
  <div class="head">
    <el-input
      placeholder="请输入客户名称"
      prefix-icon="el-icon-search"
      v-model="params.clientName"
      size="small"
      clearable
    />
    <el-input
      placeholder="请输入客户电话号"
      prefix-icon="el-icon-search"
      v-model="params.clientPhone"
      size="small"
      clearable
    />
    <el-input
      placeholder="请输入供客户邮箱号"
      prefix-icon="el-icon-search"
      v-model="params.clientEmail"
      size="small"
      clearable
    />
    <el-select
      size="small"
      v-model="params.clientStatus"
      placeholder="请选择状态"
      clearable
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
      @click="toQuery"
      icon="el-icon-search"
      >查 询
    </el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">
      新增
    </el-button>
    <el-popconfirm
      confirmButtonText="确定"
      cancelButtonText="取消"
      class="head-span"
      icon="el-icon-info"
      iconColor="red"
      title="确定导出当前客户吗？"
      @onConfirm="toExport"
    >
      <el-button
        slot="reference"
        type="primary"
        icon="el-icon-download"
        size="small"
        >导出
      </el-button>
    </el-popconfirm>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
    };
  },
  methods: {
    // 查询
    toQuery() {
      this.$parent.queryClient();
    },

    // 新增
    toAdd() {
      const form = this.$parent.$refs.form;
      form.isAdd = true;
      form.show.dialog = true;
    },

    // 导出
    toExport() {
      this.$parent.exportFile();
    },
  },
};
</script>
