<template>
  <div class="inventorys">
    <el-card shadow="never">
      <div slot="header" class="card-head">
        <el-input
          placeholder="输入关键字进行过滤"
          size="small"
          v-model="filterText"
        />
      </div>

      <el-tree
        class="filter-tree"
        :data="shopList"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        highlight-current
        ref="tree"
      />
    </el-card>

    <el-card shadow="never">
      <div slot="header" class="card-head">
        <span>{{ shopName }}</span>
        <div>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportDetails(0)"
          >
            导出所有
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="shopId != ''"
            @click="changeQuery"
            >取消查询
          </el-button>
        </div>
      </div>
      <div class="button-area">
        <el-card shadow="never" @click.native="getCommodity">
          <span>商品总量</span>
          <span>{{ commodityNumber }}</span>
        </el-card>
        <el-card shadow="never" @click.native="getZero">
          <span>缺货商品</span>
          <span>{{ stockNumber }}</span>
        </el-card>
        <el-card shadow="never" @click.native="getWarn">
          <span>存量不足</span>
          <span>{{ warnNumber }}</span>
        </el-card>
        <el-card shadow="never" @click.native="getAmple">
          <span>存量充足</span>
          <span>{{ inventoryNumber }}</span>
        </el-card>
      </div>
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        v-loading="load.table"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="top" inline class="row-form">
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
        <el-table-column label="商铺名称" prop="shopName" />
        <el-table-column label="商品名称" prop="commodityName" />
        <el-table-column
          label="库存数量"
          prop="inventoryNumber"
          align="right"
        />
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div>
        <el-dialog
          width="70%"
          :visible.sync="CommodityTableVisible"
          :close="closeCommodityDialog"
          :show-close="false"
        >
          <template slot="title">
            <div class="dialog-header">
              <span>{{ dialogTitle }}</span>
              <el-button
                v-if="commodityData.length != 0"
                type="primary"
                icon="el-icon-download"
                size="small"
                @click="exportDetails(1)"
                >导出信息
              </el-button>
            </div>
          </template>
          <el-table :data="commodityData" v-loading="load.dialog">
            <el-table-column label="商品ID" prop="commodityId" width="80">
            </el-table-column>
            <el-table-column
              label="商品名称"
              prop="commodityName"
              show-overflow-tooltip
            />
            <el-table-column
              label="商品编码"
              prop="commodityNumber"
              show-overflow-tooltip
            />
            <el-table-column
              label="建议售价"
              prop="commoditySellingPrice"
              show-overflow-tooltip
            />
            <el-table-column
              label="商品规格"
              prop="commodityUnit"
              show-overflow-tooltip
            />
            <el-table-column
              label="商品描述"
              prop="commodityDescription"
              show-overflow-tooltip
            />
            <el-table-column
              label="所属分类"
              prop="classificationName"
              align="right"
              show-overflow-tooltip
            />
          </el-table>
          <div slot="footer">
            <el-button
              type="primary"
              size="small"
              @click="CommodityTableVisible = false"
              >关 闭
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          width="40%"
          :visible.sync="dialogTableVisible"
          :show-close="false"
        >
          <template slot="title">
            <div class="dialog-header">
              <span>{{ dialogTitle }}</span>
              <el-button
                v-if="gridData.length != 0"
                type="primary"
                icon="el-icon-download"
                size="small"
                @click="exportDetails(dialogStatus)"
                >导出结果
              </el-button>
            </div>
          </template>
          <el-table
            :data="gridData"
            :row-class-name="tableRowClassName"
            v-loading="load.dialog"
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
                    <span>{{ props.row.inventoryNumber }}</span>
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
            <el-table-column
              label="库存数量"
              prop="inventoryNumber"
              align="right"
            >
            </el-table-column>
          </el-table>
          <div slot="footer">
            <el-button
              type="primary"
              size="small"
              @click="dialogTableVisible = false"
              >关 闭
            </el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
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
      gridData: [],
      commodityData: [],
      dialogTableVisible: false,
      CommodityTableVisible: false,
      dialogStatus: null,

      cardArr: [
        {
          label: "商品总量",
          detail: 1,
        },
        {
          label: "缺货商品",
          detail: 2,
        },
        {
          label: "存量不足",
          detail: 3,
        },
        {
          label: "存量充足",
          detail: 4,
        },
      ],
      load: {
        table: false,
        dialog: false,
      },
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
      this.load.table = true;
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
          this.load.table = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
          this.load.table = false;
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
    tableRowClassName({ row }) {
      if (row.inventoryNumber < 10 && row.inventoryNumber > 0) {
        return "warning-row";
      } else if (row.inventoryNumber === 0) {
        return "error-row";
      }
      return "";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getCommodityByShop();
    },
    getDetails(val) {
      this.load.dialog = true;
      let getUrl = "/api/inventory/status/" + val;
      if (this.shopId != "") {
        getUrl = getUrl + "?shopId=" + this.shopId;
      }
      console.log(getUrl);
      axios({
        method: "get",
        url: getUrl,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          if (val == 1) {
            this.commodityData = res.data.data;
          } else {
            this.gridData = res.data.data;
          }
          this.load.dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
          this.load.dialog = false;
        });
    },
    getCommodity() {
      this.CommodityTableVisible = true;
      this.dialogTitle = "商品总量";
      this.getDetails(1);
    },
    getWarn() {
      this.dialogTableVisible = true;
      this.dialogTitle = "缺货商品";
      this.dialogStatus = 3;
      this.getDetails(3);
    },
    getZero() {
      this.dialogTableVisible = true;
      this.dialogTitle = "存量不足";
      this.dialogStatus = 2;
      this.getDetails(2);
    },
    getAmple() {
      this.dialogTableVisible = true;
      this.dialogTitle = "存量充足";
      this.dialogStatus = 4;
      this.getDetails(4);
    },
    closeCommodityDialog() {
      this.CommodityTableVisible = false;
      this.dialogTitle = "";
      this.commodityData = [];
    },
    closeDetailsDialog() {
      this.dialogTableVisible = false;
      this.dialogTitle = "";
      this.gridData = [];
    },
    exportDetails(val) {
      let getUrl = "/api/inventory/export/" + val;
      if (this.shopId != "") {
        getUrl = getUrl + "?shopId=" + this.shopId;
      }
      axios({
        method: "get",
        url: getUrl,
        responseType: "blob",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          const blob = new Blob([res.data], {
            //取响应回来的数据
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          const downloadElement = document.createElement("a");
          downloadElement.href = href;
          downloadElement.download = decodeURI(res.headers["filename"]);
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((fail) => {
          console.error(fail);
        });
    },
    exportAll() {
      this.exportDetails(0);
    },
    exportCommodity() {
      this.exportDetails(1);
    },
    exportZero() {
      this.exportDetails(2);
    },
    exportWarn() {
      this.exportDetails(3);
    },
    exportAmple() {
      this.exportDetails(4);
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

<style lang="scss" scoped>
.inventorys {
  display: flex;
  padding: 0 !important;
  background: unset !important;
  > .el-card {
    &:nth-child(1) {
      width: 16%;
      margin-right: 10px;
    }
    &:nth-child(2) {
      width: 84%;
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .button-area {
    display: flex;
    > .el-card {
      width: 25%;
      margin-right: 10px;
      color: #fff;
      cursor: pointer;
      /deep/ {
        .el-card__body {
          display: flex;
          justify-content: space-between;
          > span:nth-child(2) {
            font-weight: 900;
          }
        }
      }
      &:nth-child(1) {
        background-image: linear-gradient(to right, #409eff, #409eff);
      }
      &:nth-child(2) {
        background-image: linear-gradient(to right, #f5ba07, #f5ba07);
      }
      &:nth-child(3) {
        background-image: linear-gradient(to right, #f59292, #f59292);
      }
      &:nth-child(4) {
        background-image: linear-gradient(to right, #67c23a, #67c23a);
        margin-right: 0;
      }
    }
    + .el-table {
      margin-top: 15px;
    }
  }
}
</style>
