<template>
  <div id="box"></div>
</template>
<script>
import chart from "echarts";
export default {
  data() {
    return {
      line: {
        x: [],
        y1: [],
        y2: [],
        y3: [],
        y4: [],
      },
    };
  },
  mounted() {},
  destroyed() {
    window.removeEventListener("resize", false);
  },
  methods: {
    setChart() {
      //初始化ehcharts实例
      var myChart = chart.init(document.getElementById("box"));
      //指定图表的配置项和数据
      var option = {
        //标题
        title: {
          text: "上周进销统计",
        },
        //图例-每一条数据的名字叫销量
        legend: {
          data: ["销售次数", "进货次数", "销售退货", "进货退货"],
        },
        //x轴
        xAxis: {
          data: this.line.x,
          axisLine: {
            //y轴
            show: false,
          },
        },
        //y轴没有显式设置，根据值自动生成y轴
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
        //数据-data是最终要显示的数据
        series: [
          {
            name: "销售次数",
            type: "line",
            data: this.line.y1,
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: new chart.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1, //变化度
                    //三种由深及浅的颜色
                    [
                      {
                        offset: 0,
                        color: "#fcf2f1",
                      },
                      {
                        offset: 1,
                        color: "#fcf2f1",
                      },
                    ]
                  ),
                },
                lineStyle: {
                  //线的颜色
                  color: "#f4706c",
                },
                //以及在折线图每个日期点顶端显示数字
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "white",
                  },
                },
              },
            },
          },
          {
            name: "进货次数",
            type: "line",
            data: this.line.y2,
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: new chart.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1, //变化度
                    //三种由深及浅的颜色
                    [
                      {
                        offset: 0,
                        color: "#fcf2f1",
                      },
                      {
                        offset: 1,
                        color: "#fcf2f1",
                      },
                    ]
                  ),
                },
                lineStyle: {
                  //线的颜色
                  color: "#3bba5f",
                },
                //以及在折线图每个日期点顶端显示数字
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "white",
                  },
                },
              },
            },
          },
          {
            name: "销售退货",
            type: "line",
            data: this.line.y2,
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: new chart.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1, //变化度
                    //三种由深及浅的颜色
                    [
                      {
                        offset: 0,
                        color: "#fcf2f1",
                      },
                      {
                        offset: 1,
                        color: "#fcf2f1",
                      },
                    ]
                  ),
                },
                lineStyle: {
                  //线的颜色
                  color: "#3ea0c6",
                },
                //以及在折线图每个日期点顶端显示数字
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "white",
                  },
                },
              },
            },
          },
          {
            name: "进货退货",
            type: "line",
            data: this.line.y4,
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default",
                  //渐变色实现
                  color: new chart.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1, //变化度
                    //三种由深及浅的颜色
                    [
                      {
                        offset: 0,
                        color: "#fcf2f1",
                      },
                      {
                        offset: 1,
                        color: "#fcf2f1",
                      },
                    ]
                  ),
                },
                lineStyle: {
                  //线的颜色
                  color: "#a337c8",
                },
                //以及在折线图每个日期点顶端显示数字
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "white",
                  },
                },
              },
            },
          },
        ],
      };
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option);
      window.addEventListener("resize", () => myChart.resize(), false);
    },
  },
};
</script>

<style lang="scss" scpoed>
#box {
  width: calc(50% - 10px);
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
  @media screen and (max-width: 1200px) and (min-width: 700px) {
    width: calc(50% - 10px);
    margin-left: 20px;
  }
  @media screen and (min-width: 1200px) {
    width: calc(50% - 10px);
    margin-left: 20px;
  }
}
</style>
