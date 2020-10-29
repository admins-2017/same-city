<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="config.page"
    :page-sizes="[5, 10, 20]"
    :page-size="config.count"
    layout="total, prev, pager, next, sizes"
    :total="config.total"
    background
  >
  </el-pagination>
</template>

<script>
export default {
  props: ["config"],
  methods: {
    handleSizeChange(val) {
      this.config.page = 1;
      this.config.count = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.config.page = val;
      this.query();
    },
    query() {
      this.$emit("change", this.config.page, this.config.count);
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  padding: 20px 0;
  text-align: right;
  margin-bottom: 20px;
}
</style>
