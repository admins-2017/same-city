<template>
  <div id="orders" class="area">
    <div class="area-title">资金流查询</div>
    <div class="area-child">
      <div class="area-search">
        <el-input
          v-model="search.number"
          placeholder="请输入订单号查询"
        ></el-input>
        <el-date-picker
          v-model="search.date"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
        <el-button
          type="primary"
          @click="query"
          icon="el-icon-search"
          size="small"
          :loading="load.table"
          >查询</el-button
        >
        <el-button
          type="primary"
          @click="toAdd"
          icon="el-icon-plus"
          size="small"
          :loading="load.add"
          >添加</el-button
        >
      </div>
    </div>
    <div class="area-body">
      <el-table :data="list.order" v-loading="load.table">
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
    <!-- 分页 -->
    <pagination :config="config" @change="getList" />
    <!-- 新增 -->
    <add ref="add-form" />
    <!-- 详情 -->
    <detail ref="detail-form" />
  </div>
</template>

<script>
import { getOrderList } from "@/api/order"; // 获取列表
import { COUNT } from "@/utils/constant"; // 查询条数
import add from "./modules/add"; // 组件-新增
import detail from "./modules/detail"; // 组件-详情
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "orders",
  components: {
    add,
    detail,
    pagination,
  },
  data() {
    return {
      list: {
        order: [],
      },
      config: {
        total: 0, // 总数
        page: 1, // 页数
        count: COUNT, // 条数
      },
      text: {
        query: "", // 查询内容
      },
      load: {
        add: false, // 添加按钮loading
        table: true, // 表格loading
      },
      search: {
        number: "",
        date: "",
        user: "",
        type: "",
        sale: "",
      },
      value2: "",
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    // 获取列表
    getList(page, count = this.config.count) {
      this.load.table = true;
      getOrderList(page, count)
        .then((resp) => {
          this.list.order = resp.records;
          this.config.total = resp.total;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
        });
    },

    // 查询
    query() {
      this.config.page = 1;
      this.getList(1);
    },

    // 新增
    toAdd() {
      this.load.add = true;
      this.$refs["add-form"].init();
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
.el-table {
  width: 100%;
}
</style>
