<template>
  <el-dialog
    title="点击选择商品"
    width="80%"
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <template slot="title"> <i class="el-icon-goods" />点击选择商品 </template>
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
      <el-button type="primary" @click="close">关 闭</el-button>
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
      shopId: "", // 店铺ID
      load: true,
      dialog: false,
    };
  },
  methods: {
    getList(id, index) {
      this.list.commodity = [];
      this.shopId = id;
      this.index = index;
      this.load = true;
      getCommodityList(id)
        .then((resp) => {
          this.list.commodity = resp;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
        });
    },
    confirm(row) {
      console.log(row);
      this.$parent.$parent.form.details[this.index].commodityId =
        row.commodityId;
      this.$parent.$parent.form.details[this.index].commodityName =
        row.commodityName;
      this.$parent.$parent.form.details[this.index].orderDetailPrice =
        row.commoditySellingPrice;
      this.$parent.$parent.form.details[this.index].orderDetailNumber = 1;
      this.$parent.$parent.calcTotalAmt();
      this.$parent.$parent.$refs.addForm.validateField("commodityId");
      this.dialog = false;
    },

    // 关闭
    close() {
      this.dialog = false;
    },
    transMethod, // 支付方式
    transState, // 订单状态
  },
};
</script>

<style lang="less" scoped>
.el-table {
  border-radius: 5px;
}
</style>
