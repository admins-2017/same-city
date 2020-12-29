<template>
  <div class="head">
    <el-input
      placeholder="请输入权限名"
      prefix-icon="el-icon-search"
      size="small"
      v-model="queryName"
    ></el-input>
    <el-button type="primary" size="small" icon="el-icon-search"
      >查 询
    </el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd"
      >新 增
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryName: "",
    };
  },
  methods: {
    toAdd() {
      this.$parent.$refs.formRef.show.dialog = true;
    },
  },
};
</script>
