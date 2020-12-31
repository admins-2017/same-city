<template>
  <div class="shops">
    <!-- 搜索 -->
    <shopHead :config="config" />

    <!-- 列表 -->
    <el-table :data="tableData" v-loading="load" size="small">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.children"
            ref="singleTable"
            size="small"
            border
          >
            <el-table-column
              prop="username"
              label="店员名"
              show-overflow-tooltip
            />
            <el-table-column
              prop="userDetailsTel"
              label="联系方式"
              show-overflow-tooltip
            />
            <el-table-column
              prop="userDetailsSex"
              label="性别"
              width="50"
              align="center"
            />
            <el-table-column
              prop="userDetailsMail"
              label="联系邮箱"
              show-overflow-tooltip
            />
            <el-table-column
              prop="userDetailsAddr"
              label="联系地址"
              show-overflow-tooltip
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="商铺名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="shopAddress"
        label="商铺地址"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="shopIntroduction"
        label="商铺公告"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="shopTel"
        label="商铺电话"
        width="140"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="insertTime"
        label="创建时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="最近一次修改时间"
        align="center"
        width="160"
      ></el-table-column>
      <el-table-column
        prop="shopStatus"
        label="状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.shopStatus == 1">营业</el-tag>
          <el-tag type="info" v-else-if="scope.row.shopStatus == 2">
            休息
          </el-tag>
          <el-tag type="warning" v-else>暂停营业</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toUpdate(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :config="config" @change="queryShop" />

    <!-- 表单 -->
    <shopForm ref="form" />
  </div>
</template>

<script>
import shopHead from "./modules/head";
import shopForm from "./modules/form";
import { getShopByName } from "@/api/shop"; // 接口-查询店铺
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "shops",
  components: {
    pagination,
    shopHead,
    shopForm,
  },
  data() {
    return {
      config: {
        total: 0, // 总数
        page: 1, // 页数
        size: 10, // 条数
        name: "",
      },
      tableData: [],
      load: false,
    };
  },
  created() {
    this.queryShop();
  },
  methods: {
    // 查询店铺
    queryShop() {
      this.load = true;
      getShopByName(this.config)
        .then((res) => {
          this.config.total = res.data.total;
          this.tableData = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },

    // 修改
    toUpdate(val) {
      const form = this.$refs.form;
      form.isAdd = false;
      form.form = val;
      form.show.dialog = true;
    },
  },
};
</script>
