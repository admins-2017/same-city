<template>
  <div class="head">
    <el-input
      placeholder="请输入商铺名"
      prefix-icon="el-icon-search"
      size="small"
      v-model="config.name"
      clearable
    ></el-input>
    <el-button
      type="primary"
      size="small"
      icon="el-icon-search"
      @click="toQuery"
      >查 询
    </el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">
      新 增
    </el-button>
  </div>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {};
  },
  methods: {
    // 查询
    toQuery() {
      this.$parent.queryShop();
    },

    // 新增
    toAdd() {
      const form = this.$parent.$refs.form;
      form.isAdd = true;
      form.show.dialog = true;
    },
  },
};
</script>
