<template>
  <div id="orders" class="area">
    <div class="head">
      <el-input
        v-model="search.orderNumber"
        placeholder="请输入订单号查询"
        size="mini"
      ></el-input>
      <el-select
        v-model="search.state"
        placeholder="请选择订单状态"
        size="mini"
        clearable
      >
        <el-option
          v-for="item in list.users"
          :key="item.userId"
          :label="item.username"
          :value="item.userId"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="search.date"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="yyyy-MM-dd HH:mm:ss"
        size="mini"
      >
      </el-date-picker>
      <el-select
        v-model="search.operatorUser"
        clearable
        placeholder="请选择销售人员"
        size="mini"
      >
        <el-option
          v-for="item in list.users"
          :key="item.userId"
          :label="item.username"
          :value="item.userId"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        @click="query"
        icon="el-icon-search"
        size="mini"
        :loading="load.table"
        >查询</el-button
      >
      <el-button
        type="success"
        @click="toAdd"
        icon="el-icon-plus"
        size="mini"
        :loading="load.add"
        >添加</el-button
      >
    </div>
    <el-table :data="list.order" v-loading="load.table">
      <el-table-column label="#" type="index" />
      <el-table-column label="订单号" prop="orderNumber" />
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{ obj.state[scope.row.orderStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="clientName" />
      <el-table-column label="总金额" prop="orderActualPayment" />
      <el-table-column label="折后金额" prop="orderAmountAfterDiscount" />
      <el-table-column label="下单时间" prop="orderDate" width="180" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
          <el-button
            type="text"
            @click="cancellation(scope.row.orderId)"
            :loading="load.cancel"
            >作废</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :config="config" @change="getList" />
    <!-- 新增 -->
    <add ref="add-form" />
    <!-- 详情 -->
    <detail ref="detail-form" />
  </div>
</template>

<script>
import {
  getOrderList,
  getOrderListOption,
  cancelOrder,
  getUser,
} from "@/api/order"; // 获取列表
import { COUNT, ORDER_STATE } from "@/utils/constant"; // 查询条数
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
        users: [],
      },
      obj: {
        state: ORDER_STATE,
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
        cancel: false,
      },
      search: {
        orderNumber: "",
        date: "",
        operatorUser: "",
      },
      value2: "",
    };
  },
  created() {
    this.getUserList();
    this.getList(1);
  },
  methods: {
    // 获取列表
    getList(page, count = this.config.count) {
      this.load.table = true;
      getOrderList(page, count)
        .then((resp) => {
          console.log(resp);
          this.list.order = resp.data.records;
          this.config.total = resp.data.total;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
        });
    },

    // 获取列表
    getListOption(page, count = this.config.count) {
      this.load.table = true;
      getOrderListOption(page, count, this.search)
        .then((resp) => {
          resp = resp.data;
          this.list.order = [];
          this.list.order = resp.records;
          this.config.total = resp.total;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
        });
    },

    // 获取销售人员
    getUserList() {
      getUser().then((resp) => {
        console.log(resp);
        this.list.users = resp;
      });
    },

    // 查询
    query() {
      this.config.page = 1;
      // this.getList(1);
      this.getListOption(1);
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

    // 作废
    cancellation(id) {
      this.load.cancel = true;
      cancelOrder(id)
        .then(() => {
          this.load.cancel = false;
          this.getList(1);
        })
        .catch(() => {
          this.load.cancel = true;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
}
</style>
