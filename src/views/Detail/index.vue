<template>
  <div class="detail area">
    <div class="area-title">明细</div>
    <div class="area-child">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="进货" name="first">
          <stock />
        </el-tab-pane>
        <el-tab-pane label="退货" name="second">退货</el-tab-pane>
        <el-tab-pane label="订单" name="third">订单</el-tab-pane>
        <el-tab-pane label="付款" name="fourth">付款</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import stock from "./modules/stock.vue";
export default {
  data() {
    return {
      info: {},
      dialog: false,
      activeName: "first",
    };
  },
  components: {
    stock,
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  .el-tabs {
    margin-bottom: 20px;
  }
}
</style>