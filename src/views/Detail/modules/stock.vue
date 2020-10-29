<template>
  <div class="stock area">
    <div class="area-child">
      <div class="area-search">
        <el-input v-model="text.query" placeholder="请输入内容"></el-input>
        <el-button
          type="primary"
          @click="query"
          icon="el-icon-search"
          size="small"
          >查询</el-button
        >
        <!-- <el-button
          type="primary"
          @click="toAdd"
          icon="el-icon-plus"
          size="small"
          >添加</el-button
        > -->
      </div>
    </div>
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
    <!-- 分页 -->
    <pagination :config="config" @change="getList" />
    <!-- 新增 -->
    <!-- <add ref="add-form" /> -->
    <!-- 详情 -->
    <!-- <detail ref="detail-form" /> -->
  </div>
</template>

<script>
import { getOrderList } from "@/api/order"; // 获取列表
import { COUNT } from "@/utils/constant"; // 查询条数
// import add from "./modules/add"; // 组件-新增
// import detail from "./modules/detail"; // 组件-详情
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "orders",
  components: {
    // add,
    // detail,
    pagination,
  },
  data() {
    return {
      list: {
        order: [],
      },
      config: {
        total: 12, // 总数
        page: 1, // 页数
        count: COUNT, // 条数
      },
      text: {
        query: "", // 查询内容
      },
      load: true, // 表格loading
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    // 获取列表
    getList(page, count = this.config.count) {
      this.load = true;
      getOrderList(page, count)
        .then((resp) => {
          this.list.order = resp.records;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
        });
    },

    // 查询
    query() {
      this.config.page = 1;
      this.getList(1);
    },

    // 新增
    toAdd() {
      this.$refs["add-form"].show.dialog = true;
    },

    // 详情
    toDetail(obj) {
      console.log(obj);
      this.$refs["detail-form"].info = obj;
      this.$refs["detail-form"].dialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.stock {
  .area-child {
    padding: 0;
  }
}
.el-table {
  width: 100%;
}
</style>
