<template>
  <div class="dashboard area">
    <div class="area-title">首页驾驶舱</div>
    <div class="area-body">
      <div id="echart" />
    </div>
  </div>
</template>

<script>
import chart from "echarts";
export default {
  data() {
    return {
      info: {},
      dialog: false,
    };
  },
  created() {
    // chart
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  .area-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
      font-size: 36px;
      font-weight: 600;
      color: #222844;
      line-height: 54px;
      margin-bottom: 48px;
    }
  }
}
</style>
