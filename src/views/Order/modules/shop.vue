<template>
  <el-dialog
    title="销售单详情"
    :visible.sync="dialog"
    width="80%"
    append-to-body
  >
    <template slot="title"> <i class="el-icon-tickets" />销售单详情 </template>
    <div class="area">
      <el-table :data="list.commodity" v-loading="load" @cell-click="confirm">
        <el-table-column label="#" type="index" />
        <el-table-column label="商品名称" prop="commodityName" />
        <el-table-column label="商品编码" prop="commodityNumber" />
        <el-table-column label="建议售价" prop="commoditySellingPrice" />
        <el-table-column label="规格" prop="commodityUnit" />
        <el-table-column label="库存" prop="inventoryNumber" />
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialog = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { transMethod, transState } from "@/utils";
import { getCommodityList } from "@/api/shop"; // 根据商铺id查询商铺
export default {
  data() {
    return {
      info: {},
      list: {
        commodity: [],
      },
      index: "",
      load: true,
      dialog: false,
    };
  },
  methods: {
    getList(id, index) {
      this.index = index;
      this.load = true;
      getCommodityList(id)
        .then((resp) => {
          this.list.commodity = resp;
          this.load = false;
        })
        .catch(() => {});
    },
    confirm(row) {
      this.$parent.$parent.form.table[this.index].commodityId = row.commodityId;
      this.dialog = false;
    },
    transMethod, // 支付方式
    transState, // 订单状态
  },
};
</script>
