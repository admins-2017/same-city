<template>
  <div id="mainC"></div>
</template>
<script>
import chart from "echarts";
export default {
  data() {
    return {
      rank: [],
    };
  },
  mounted() {},
  destroyed() {
    window.removeEventListener("resize", arguments);
  },
  methods: {
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = chart.init(document.getElementById("mainC"));
      let option = {
        title: {
          x: "center",
          textStyle: {
            color: "#495054",
            fontsize: "16px",
          },
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "{b} </br> {c} </br> 占比{d}%",
        },
        legend: {
          orient: "horizontal", // 布局  纵向布局 图例标记居文字的左边 vertical则反之
          width: 40, // 图行例组件的宽度,默认自适应
          x: "right", // 图例显示在右边
          y: "center", // 图例在垂直方向上面显示居中
          itemWidth: 10, // 图例标记的图形宽度
          itemHeight: 10, // 图例标记的图形高度
          data: [
            "人工款支出金额(万元)",
            "材料设备款支出金额(万元)",
            "其他费用支出金额(万元)",
          ],
          textStyle: {
            color: "#495054",
            fontSize: 10,
          },
          formatter: (name, d) => {
            let str = "";
            this.legend.forEach((l) => {
              if (l.name === name) {
                str = l.name + "    " + l.percent;
              }
            });
            return str;
          },
        },
        series: [
          {
            name: "数据占比",
            type: "pie",
            radius: ["30%", "45%"],
            center: ["40%", "53%"],
            avoidLabelOverlap: true,
            color: ["#26BAFF", "#FCC006", "#1672BC"],
            formatter: "{b}: {d}",
            label: {
              // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
              normal: {
                show: false,
                position: "outside",
                formatter: (data) => {
                  // 赋值百分比给legend
                  // this.legend.forEach((l) => {
                  //   if (l.name === '人工款支出金额(万元)') {
                  //     l.percent = numFilterToDivisionW(
                  //       this.pieData.manualPayment
                  //     );
                  //   } else if (l.name === '材料设备款支出金额(万元)') {
                  //     l.percent = numFilterToDivisionW(
                  //       this.pieData.materialEquipmentPay
                  //     );
                  //   } else if (l.name === '其他费用支出金额(万元)') {
                  //     l.percent = numFilterToDivisionW(
                  //       this.pieData.otherPayment
                  //     );
                  //   }
                  // });
                  return (
                    data.name +
                    "" +
                    data.value +
                    "元" +
                    "\n" +
                    "占比" +
                    data.percent.toFixed(2) +
                    "%"
                  );
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "14",
                    fontWeight: "bold",
                  },
                },
              },
            },
            labelLine: {
              // 标签的视觉引导线样式,在 label 位置 设置为'outside'的时候会显示视觉引导线。
              normal: {
                show: false,
                length: 15,
                length2: 10,
              },
            },
            data: this.rank,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
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
#mainC {
  width: calc(50% - 10px);
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px 0 0 20px;
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
