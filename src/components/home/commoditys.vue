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
				<span>缩略图</span>
                <img :src="item.commodityPicture" alt="">
              </div>
			  <div>
				  <el-row :gutter="20">
				    <el-col :span="3"><span>商品名：</span></el-col>
				    <el-col :span="5"><span>{{item.commodityName}}</span></el-col>
					<el-col :span="3"><span>商品编号：</span></el-col>
					<el-col :span="5"><span>{{item.commodityNumber}}</span></el-col>
					<el-col :span="3"><span>商品单位：</span></el-col>
					<el-col :span="5"><span>{{item.commodityUnit}}</span></el-col>
				  </el-row>
				  <el-row :gutter="20">
				    <el-col :span="3"><span>分类：</span></el-col>
				    <el-col :span="5"><span>{{item.classificationName}}</span></el-col>
				  					<el-col :span="3"><span>建议售价：</span></el-col>
				  					<el-col :span="5"><span>{{item.commoditySellingPrice}}/元</span></el-col>
				  					<el-col :span="3"><span>状态：</span></el-col>
				  					<el-col :span="5" v-if="item.commodityStatus == 0"><span>上架</span></el-col>
									<el-col :span="5" v-if="item.commodityStatus == 1"><span>下架</span></el-col>
									<el-col :span="5" v-if="item.commodityStatus == 2"><span>删除</span></el-col>
				  </el-row>
				  <el-row :gutter="20">
				    <el-col :span="3"><span>商品介绍：</span></el-col>
				    <el-col :span="15"><span>{{item.commodityDescription}}</span></el-col>
				  </el-row>
				  <el-row :gutter="20">
				    <el-col :span="3"><span>添加人员：</span></el-col>
				    <el-col :span="7"><span>{{item.insertUsername}}</span></el-col>
					<el-col :span="3"><span>修改人员：</span></el-col>
					<el-col :span="7"><span>{{item.updateUsername}}</span></el-col>
				  </el-row>
				  <el-row :gutter="20">
				    <el-col :span="3"><span>添加时间：</span></el-col>
				    <el-col :span="7"><span>{{item.insertTime}}</span></el-col>
				  					<el-col :span="4"><span>最近修改时间：</span></el-col>
				  					<el-col :span="7"><span>{{item.updateTime}}</span></el-col>
				  </el-row>
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
