<template>
  <div id="mainT"></div>
</template>
<script>
import chart from "echarts";
export default {
  data() {
    return {
      bar: {
        x: [],
        y1: [],
        y2: [],
      },
    };
  },
  mounted() {},
  destroyed() {
    window.removeEventListener("resize", arguments);
  },
  methods: {
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = chart.init(document.getElementById("mainT"));
      let option = {
        //画布背景色设置
        backgroundColor: "#fff",
        title: {
          text: "Revenue",
          textStyle: {
            //设置主标题字体颜色
            color: "#2c2c2c",
          },
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["分类一", "分类二"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.bar.x,
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              //刻度线
              show: false,
            },
            splitLine: {
              //网格线
              show: true,
            },
          },
        ],
        series: [
          {
            name: "销售收款",
            type: "bar",
            //设置柱状图宽度
            barWidth: "8",
            data: this.bar.y1,
            itemStyle: {
              normal: {
                //柱形图圆角，顺时针左上，右上，右下，左下）
                barBorderRadius: [5, 5, 0, 0],
                //设置柱状图颜色渐变
                color: new chart.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#5eb6de",
                  },
                  {
                    offset: 1,
                    color: "#58a0c1",
                  },
                ]),
              },
            },
          },
          {
            name: "进货支出",
            type: "bar",
            //设置柱状图宽度
            barWidth: "8",
            //柱状图间距
            // barGap: "200%",
            data: this.bar.y2,
            itemStyle: {
              normal: {
                // 统一设置四个角的圆角大小
                barBorderRadius: [5, 5, 0, 0],
                //设置柱状图颜色渐变
                color: new chart.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#bf6ddf",
                  },
                  {
                    offset: 1,
                    color: "#bb7cd4",
                  },
                ]),
              },
            },
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
#mainT {
  width: calc(50% - 10px);
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  @media screen and (max-width: 700px) {
    width: 100%;
    margin: 0 0 20px 0;
  }
  @media screen and (max-width: 1200px) and (min-width: 700px) {
    width: calc(50% - 10px);
  }
  @media screen and (min-width: 1200px) {
    width: calc(50% - 10px);
  }
}
</style>
