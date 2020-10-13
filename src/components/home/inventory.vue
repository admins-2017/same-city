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
          <span>库存明细</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >导出结果</el-button
          >
        </div>
        <div>
          <div>
            <el-row>
              <el-col
                :span="4"
                v-for="(o, index) in 4"
                :key="o"
                :offset="index > 0 ? 2 : 0"
              >
                <el-card :body-style="{ padding: '0px' }">
                  <div style="padding: 14px">
                    <span>好吃的汉堡</span>
                    <div class="bottom clearfix">
                      <time class="time">{{ currentDate }}</time>
                      <el-button type="text" class="button">操作按钮</el-button>
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
            height="500"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商品名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="所属店铺">
                    <span>{{ props.row.shop }}</span>
                  </el-form-item>
                  <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="店铺 ID">
                    <span>{{ props.row.shopId }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="店铺地址">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="商品描述">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="商品 ID" prop="id"> </el-table-column>
            <el-table-column label="商品名称" prop="name"> </el-table-column>
            <el-table-column label="描述" prop="desc"> </el-table-column>
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
      tableData: [
        {
          id: "12987122",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333",
        },
        {
          id: "12987123",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333",
        },
        {
          id: "12987125",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333",
        },
        {
          id: "12987126",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "testtest",
          shopId: "10333",
        },
      ],
    };
  },
  methods: {
    filterNode(value, shopList) {
      console.log(value);
      console.log(shopList);
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
    handleNodeClick(val) {
      console.log(val);
      //   this.dialogDetailTableVisible = true;
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row);
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleCurrentChange(val) {
      this.page = val;
      let isNoll = false;
      for (var key in this.findCommodityForm) {
        if (this.findCommodityForm[key] != "") {
          isNoll = true;
        }
      }
      console.log(isNoll);
      if (isNoll) {
        this.findCommodityByCondition();
      } else {
        this.getAllCommodity();
      }
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getShop();
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
  height: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(1) {
    width: 22%;
    height: 100%;
    display: flex;
    justify-content: center;
    .box-card {
      width: 95%;
      height: 100%;
      overflow-y: auto;
      position: relative;
      .el-card__header {
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
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: white;
    > .box-card {
      width: 100%;
      height: 100%;
      position: relative;
      overflow-y: auto;
      .el-card__header {
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
      .my-collapse {
        width: 100%;
        height: 80%;
        overflow-y: auto;
        .el-collapse {
          width: 100%;
          height: 100%;
          .el-collapse-item__wrap {
            width: 100%;
            height: 100%;

            .el-collapse-item__content {
              width: 100%;
              display: flex;
              justify-content: space-between;
              > div:nth-of-type(1) {
                width: 25%;
                img {
                  width: 90%;
                  height: 160px;
                }
              }
              > div:nth-of-type(2) {
                width: 75%;
                img {
                  width: 100%;
                  height: 210px;
                }
                .operating-commodity {
                  width: 50%;
                  margin: 10px 0px;
                  display: flex;
                  justify-content: space-between;
                }
              }
            }
          }
        }
      }
      .el-table .warning-row {
        background: rgb(179, 202, 74);
      }

      .el-table .success-row {
        background: #f0f9eb;
      }
      .el-pagination {
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        width: 100%;
        position: relative;
        bottom: -20px;
      }
    }
    .el-drawer {
      width: 100%;
      .el-drawer__body {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        > div {
          width: 80%;
          height: 100%;
          margin: 20px 0px;
          .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409eff;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100%;
            height: 200px;
            line-height: 178px;
            text-align: center;
          }
          .avatar {
            width: 100%;
            height: 200px;
            display: block;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .add-commodity {
      .el-upload {
        width: 100%;
      }
    }
  }
}
</style>
