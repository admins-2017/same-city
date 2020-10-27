<template>
  <div id="orders" class="area">
    <div class="area-title">销售单</div>
    <div class="area-child">
      <div class="area-search">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="getList" size="small">查询</el-button>
        <el-button type="primary" @click="toAdd" size="small">添加</el-button>
      </div>
    </div>
    <div class="area-body">
      <el-table :data="list.order" v-loading="load">
        <el-table-column label="#" type="index" />
        <el-table-column label="订单号" prop="orderNumber" />
        <el-table-column label="客户名称" prop="clientName" />
        <el-table-column label="总金额" prop="orderActualPayment" />
        <el-table-column label="折后金额" prop="orderAmountAfterDiscount" />
        <el-table-column label="下单时间" prop="orderDate" width="180" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增 -->
    <add ref="add-form" />
    <!-- 详情 -->
    <detail ref="detail-form" />
  </div>
</template>

<script>
import { getOrderList } from "@/api/order";
import add from "./modules/add";
import detail from "./modules/detail";
export default {
  name: "orders",
  components: {
    add,
    detail,
  },
  data() {
    return {
      list: {
        order: [],
      },
      load: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.load = true;
      getOrderList().then((resp) => {
        console.log(resp);
        this.list.order = resp.records;
        this.load = false;
      });
    },

    // 新增
    toAdd() {
      this.$refs["add-form"].show.dialog = true;
    },

    // 详情
    toDetail(obj) {
      this.$refs["detail-form"].info = obj;
      this.$refs["detail-form"].show.dialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
}
</style>
