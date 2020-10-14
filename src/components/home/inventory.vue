<template>
  <div id="commoditys">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>所有商铺</span>
        </div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="shopList"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
          highlight-current
          ref="tree"
        >
        </el-tree>
      </el-card>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ shopName }}</span>
          <div>
            <el-button style="float: right; padding: 3px 0" type="text"
              >导出结果</el-button
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              v-if="shopId != ''"
              @click="changeQuery"
              >取消查询</el-button
            >
          </div>
        </div>
        <div>
          <div>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div class="my-card-context" @click="getCommodity">
                    <div>
                      <span>商品总量</span>
                    </div>
                    <div>
                      <span>{{ commodityNumber }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div class="my-card-context" @click="getZero">
                    <div>
                      <span>缺货商品</span>
                    </div>
                    <div>
                      <span>{{ stockNumber }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div class="my-card-context" @click="getWarn">
                    <div>
                      <span>存量不足</span>
                    </div>
                    <div>
                      <span>{{ warnNumber }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <div class="my-card-context" @click="getAmple">
                    <div>
                      <span>存量充足</span>
                    </div>
                    <div>
                      <span>{{ inventoryNumber }}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
        <div>
          <el-table
            :data="tableData"
            style="width: 100%"
            background
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商品名称">
                    <span>{{ props.row.commodityName }}</span>
                  </el-form-item>
                  <el-form-item label="所属店铺">
                    <span>{{ props.row.shopName }}</span>
                  </el-form-item>
                  <el-form-item label="所属分类">
                    <span>{{ props.row.classificationName }}</span>
                  </el-form-item>
                  <el-form-item label="商品简介">
                    <span>{{ props.row.commodityDescription }}</span>
                  </el-form-item>
                  <el-form-item label="商品售价">
                    <span>{{ props.row.commoditySellingPrice }}</span>
                  </el-form-item>
                  <el-form-item label="商品规格">
                    <span>{{ props.row.commodityUnit }}</span>
                  </el-form-item>
                  <el-form-item label="库存数量">
                    <span style="color: SaddleBrown; font-weight: 600">{{
                      props.row.inventoryNumber
                    }}</span>
                  </el-form-item>
                  <el-form-item label="商铺地址">
                    <span>{{ props.row.shopAddress }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="商铺名称" prop="shopName">
            </el-table-column>
            <el-table-column label="商品名称" prop="commodityName">
            </el-table-column>
            <el-table-column label="库存数量" prop="inventoryNumber">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div>
          <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
              <el-table-column
                property="date"
                label="日期"
                width="150"
              ></el-table-column>
              <el-table-column
                property="name"
                label="姓名"
                width="200"
              ></el-table-column>
              <el-table-column
                property="address"
                label="地址"
              ></el-table-column>
            </el-table>
          </el-dialog>
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
      userDetails: "",
      filterText: "",
      shopList: [],
      defaultProps: {
        label: "shopName",
      },
      size: 10,
      page: 1,
      total: 0,
      tableData: [],
      shopId: "",
      shopName: "库存明细",
      warnNumber: "",
      commodityNumber: "",
      stockNumber: "",
      inventoryNumber: "",
      dialogTitle: "",
      gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        dialogTableVisible: false,
    };
  },
  methods: {
    filterNode(value, shopList) {
      if (!value) return true;
      return shopList.shopName.indexOf(value) !== -1;
    },
    getShop() {
      axios({
        method: "get",
        url: "/api/shop",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.shopList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getCommodityByShop() {
      let getUrl = "/api/inventory?page=" + this.page + "&size=" + this.size;
      if (this.shopId != "") {
        getUrl = getUrl + "&shopId=" + this.shopId;
      }
      axios({
        method: "get",
        url: getUrl,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.warnNumber = res.data.data.warnNumber;
          this.commodityNumber = res.data.data.commodityNumber;
          this.stockNumber = res.data.data.stockNumber;
          this.inventoryNumber = res.data.data.inventoryNumber;
          this.total = res.data.data.vos.total;
          this.tableData = res.data.data.vos.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    handleNodeClick(val) {
      this.shopName = val.shopName;
      this.page = 0;
      this.shopId = val.shopId;
      this.getCommodityByShop();
    },
    changeQuery() {
      this.page = 0;
      this.shopId = "";
      this.shopName = "库存明细";
      this.getCommodityByShop();
    },
    tableRowClassName({ row, rowIndex }) {
      rowIndex;
      if (row.inventoryNumber < 10 && row.inventoryNumber > 0) {
        return "warning-row";
      } else if (row.inventoryNumber === 0) {
        return "error-row";
      }
      return "success-row";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getCommodityByShop();
    },
    getDetails(val) {
      let getUrl = "/api/inventory/status/"+val;
      if (this.shopId != "") {
        getUrl = getUrl + "&shopId=" + this.shopId;
      }
      console.log(getUrl)
      axios({
        method: "get",
        url: getUrl,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getCommodity() {
      this.dialogTableVisible = true;
      this.dialogTitle = "商品总量"
      this.getDetails(1);
    },
    getWarn() {
      this.dialogTableVisible = true;
      this.dialogTitle = "缺货商品"
      this.getDetails(2);

    },
    getZero() {
      this.dialogTableVisible = true;
      this.dialogTitle = "存量不足"
      this.getDetails(3);

    },
    getAmple() {
      this.dialogTableVisible = true;
      this.dialogTitle = "存量充足"
      this.getDetails(4);

    },
    
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    console.log(this.userDetails);
    this.getShop();
    this.getCommodityByShop();
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
  overflow-y: hidden;
}
#commoditys {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-y: hidden;

  > div:nth-of-type(1) {
    width: 22%;
    height: 100%;
    display: flex;
    justify-content: center;
    .box-card {
      width: 95%;
      height: 100%;
      position: relative;
      .el-card__header {
        padding: 10px;
        height: 10%;
        .clearfix {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            padding: 8px;
          }
          .el-button {
            padding: 8px;
            font-size: 13px;
          }
        }
      }

      .el-card__body {
        > .el-tree {
          margin: 10px -10px;
        }
      }
    }
  }
  > div:nth-of-type(2) {
    width: 78%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: white;
    .box-card {
      width: 100%;
      height: 100%;
      position: relative;
      overflow-y: hidden;
      .el-card__header {
        height: 10%;
        width: 100%;
        padding: 10px;
        .clearfix {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            padding: 8px;
          }
          .el-button {
            padding: 8px;
            font-size: 13px;
          }
        }
      }

      .el-card__body {
        widows: 100%;
        height: 80%;
        > div:nth-of-type(1) {
          widows: 100%;
          height: 10%;
          > div {
            .my-card-context {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #f8f8ff;
              > div:nth-of-type(1) {
                margin-top: 10px;
                font-weight: 600;
              }
              > div:nth-of-type(2) {
                margin: 10px 0px;
                font-size: 15px;
              }
            }
          }
        }
        > div:nth-of-type(2) {
          widows: 100%;
          height: 68%;
          .el-table {
            height: 100%;
            overflow-y: auto;
          }
          .el-table .success-row {
            background: white;
          }
          .el-table .warning-row {
            background: rgb(255 239 219);
          }

          .el-table .error-row {
            background: rgb(255 106 106);
          }
          margin-top: 10px;
          .demo-table-expand {
            font-size: 0;
          }
          .demo-table-expand label {
            width: 90px;
            color: #99a9bf;
          }
          .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
          }
        }
        > div:nth-of-type(3) {
          widows: 100%;
          height: 10%;
          margin-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
