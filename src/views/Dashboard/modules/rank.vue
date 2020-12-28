<template>
  <div id="mainB"></div>
</template>
<script>
import chart from "echarts";
export default {
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    // this.setChart();
  },
  destroyed() {
    window.removeEventListener("resize", arguments);
  },
  methods: {
    setChart() {
      var labelSetting = {
        normal: {
          show: true,
          position: "right",
          offset: [10, 0],
          textStyle: {
            fontSize: 16,
          },
        },
      };
      var maxData = 20000;
      // 基于准备好的dom，初始化echarts实例
      let myChart = chart.init(document.getElementById("mainB"));
      let option = {
        title: {
          text: "销量排行",
        },
        dataset: {
          source: this.data,
        },
        grid: { containLabel: true },
        xAxis: {
          name: "amount",
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
        yAxis: {
          type: "category",
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            margin: 10,
            textStyle: {
              color: "#999",
              fontSize: 16,
            },
          },
        },

        series: [
          {
            type: "pictorialBar",
            label: labelSetting,
            symbol: "rect",
            itemStyle: {
              normal: {
                color: "#007eb1",
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product",
            },
            z: 10,
          },
          {
            // full data
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "#7dbad2",
                opacity: 0.2,
              },
            },
            /* symbolRepeat: 'fixed',*/
            /*        symbolMargin: '5%',
             */ symbol: "rect",
            /*        symbolSize: 30,*/
            symbolBoundingData: maxData,
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product",
            },
            z: 5,
          },
        ],
      };
      //  使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize(), false);
    },
  },
};
</script>

<style lang="scss" scpoed>
#mainB {
  width: 100%;
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  margin-top: 20px;
  // @media screen and (max-width: 700px) {
  //   width: 100%;
  //   margin: 0 0 20px 0;
  // }
  // @media screen and (max-width: 1200px) and (min-width: 700px) {
  //   width: calc(50% - 10px);
  // }
  // @media screen and (min-width: 1200px) {
  //   width: calc(50% - 10px);
  // }
}
</style>
