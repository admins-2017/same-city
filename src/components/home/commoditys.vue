<template>
  <div id="commoditys">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>分类详情</span>
        </div>
        <div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree
            :data="classificationData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree"
          >
          </el-tree>
        </div>
      </el-card>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品详情</span>
        </div>
        <div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item :title="item.commodityName" :name="item.commodityId" v-for="item in commoditys" :key="item">
              <div>
                与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
              </div>
              <div>
                在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "commoditys",
  data() {
    return {
      classificationData: [],
      filterText: "",
      activeNames: ["1"],
      size: 10,
      page: 1,
      total: 0,
      defaultProps: {
        children: "children",
        label: "classificationName",
      },
      commoditys: [],
    };
  },
  methods: {
    getAllClassification() {
      axios({
        method: "get",
        url: "/api/classification",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.classificationData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getAllCommodity() {
      axios({
        method: "get",
        url: "/api/commodity/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          this.commoditys = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getAllCommodity();
    },
    handleNodeClick(val) {
      console.log(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.classificationName.indexOf(value) !== -1;
    },
    handleChange(val) {
      console.log(val);
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllClassification();
    this.getAllCommodity();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
#commoditys {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  > div:nth-of-type(1) {
    width: 22%;
    height: 100%;
    display: flex;
    justify-content: center;
    .box-card {
      width: 95%;
      height: 100%;
      overflow-y: auto;
      .el-card__body {
        > div {
          .el-tree {
            margin: 10px 0px;
          }
        }
      }
    }
  }
  > div:nth-of-type(2) {
    width: 78%;
    display: flex;
    justify-content: center;
    background-color: white;
    > .box-card {
      width: 100%;
    }
  }
}
</style>
