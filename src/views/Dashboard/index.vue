<template>
  <div class="dashboard area">
    <div class="gather">
      <div>
        <div>
          <div>支出</div>
          <span>{{ number.amountOfPayout }}</span>
        </div>
        <i class="el-icon-star-on" />
      </div>
      <div>
        <div>
          <div>收入</div>
          <span>{{ number.saleAmount }}</span>
        </div>
        <i class="el-icon-s-help" />
      </div>
      <div>
        <div>
          <div>进货</div>
          <span>{{ number.purchaseCount }}</span>
        </div>
        <i class="el-icon-s-promotion" />
      </div>
      <div>
        <div>
          <div>销售</div>
          <span>{{ number.saleCount }}</span>
        </div>
        <i class="el-icon-s-opportunity" />
      </div>
    </div>
    <!-- 统计图 -->
    <div class="chart">
      <!-- 柱状图 -->
      <bar ref="barRef" />
      <!-- 折线图 -->
      <brokenLine />
      <!-- 排行榜 -->
      <rank ref="rankRef" />
    </div>
  </div>
</template>

<script>
import bar from "./modules/bar";
import brokenLine from "./modules/brokenLine";
import rank from "./modules/rankw";
import { getIndex } from "@/api/dashboard";
export default {
  components: {
    bar,
    brokenLine,
    rank,
  },
  data() {
    return {
      info: {},
      dialog: false,
      number: {
        amountOfPayout: "", // 支出金额
        purchaseCount: "", // 进货次数
        saleAmount: "", // 收入金额
        saleCount: "", // 销售次数
      },
    };
  },
  mounted() {
    getIndex().then((resp) => {
      const { data } = resp;
      this.number = data.number;
      // 柱状图数据
      let bar = {
        x: [],
        y1: [],
        y2: [],
      };
      data.statistics.map((s) => {
        bar.x.push(s.statisticsYear + "-" + s.statisticsMonth);
        bar.y1.push(s.statisticsSale);
        bar.y2.push(s.statisticsPurchase);
      });
      this.$refs.barRef.bar = bar;
      this.$refs.barRef.setChart();

      // 排行榜数据
      // let rank = [["score", "amount", "product"]];
      // data.commodityList.map((c) => {
      //   let arr = [];
      //   arr.push(0, c.score, c.value);
      //   rank.push(arr);
      // });
      let rankArr = [];
      data.commodityList.map((c) => {
        let obj = {};
        obj["name"] = c.score;
        obj["value"] = c.score;
        rankArr.push(obj);
      });
      this.$refs.rankRef.rank = rankArr;
      this.$refs.rankRef.setChart();
    });
  },
  methods: {},
};
</script>

<style lang="scss">
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
  .gather {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: calc(25% - 15px);
      height: 120px;
      background-color: #fff;
      margin-right: 20px;
      border-radius: 7px;
      box-shadow: 0 1px 10px #dad6d5;
      color: #fff;
      padding: 20px 20px 20px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      &:nth-child(1) {
        background-image: linear-gradient(to right, #fb9899, #f4706c);
      }
      &:nth-child(2) {
        @media screen and (max-width: 1200px) {
          margin-right: 0;
          margin-bottom: 20px;
        }
        background-image: linear-gradient(to right, #67d885, #3bba5f);
      }
      &:nth-child(3) {
        background-image: linear-gradient(to right, #7bbbd9, #3ea0c6);
      }
      &:last-child {
        background-image: linear-gradient(to right, #c573df, #a337c8);
        margin-right: 0;
      }
      i {
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 12px;
        font-size: 50px;
      }
      > div {
        > div {
          font-size: 14px;
          margin-bottom: 5px;
        }
        > span {
          font-size: 26px;
        }
      }
      @media screen and (max-width: 700px) {
        width: 100%;
        margin: 0 0 20px 0;
      }
      @media screen and (max-width: 1200px) and (min-width: 700px) {
        width: calc(50% - 10px);
      }
      @media screen and (min-width: 1200px) {
        width: calc(25% - 15px);
      }
    }
  }
}
.chart {
  margin-top: 20px;
  > div {
    display: inline-block;
    box-shadow: 0px 12px 33px 0px #3e495414;
  }
  @media screen and (max-width: 700px) {
    margin-top: 0;
  }
}
</style>
