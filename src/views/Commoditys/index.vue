<template>
  <div class="commoditys">
    <!-- 左侧分类 -->
    <com-left ref="left" />

    <el-card shadow="never">
      <div slot="header" class="card-head">
        <span>商品详情</span>
        <div>
          <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="toQuery"
            >查 询
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="toAdd"
            >新 增
          </el-button>
          <el-button
            icon="el-icon-close"
            type="primary"
            size="small"
            @click="toCancel"
            >取 消
          </el-button>
        </div>
      </div>
      <!-- 列表 -->
      <el-collapse v-loading="load">
        <el-collapse-item
          :title="item.commodityName"
          :name="item.commodityId"
          v-for="item in list"
          :key="item.commodityId"
        >
          <template slot="title">
            <div class="collapse-title">
              <span>{{ item.commodityName }}</span>
              <!-- 按钮区域 -->
              <com-buttons :com="item" />
            </div>
          </template>
          <!-- 商品详情 -->
          <com-detail :com="item" />
        </el-collapse-item>
      </el-collapse>
      <!-- 分页 -->
      <pagination :config="params" @change="queryCommodity" />
    </el-card>

    <!-- 表单 -->
    <com-form ref="form" />

    <!-- 查询 -->
    <com-query ref="query" />
  </div>
</template>

<script>
import { getCommodity } from "@/api/commodity";
import comLeft from "./modules/left";
import comButtons from "./modules/buttons";
import comDetail from "./modules/detail";
import comForm from "./modules/form";
import comQuery from "./modules/query";
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "commoditys",
  components: {
    comLeft,
    comButtons,
    comDetail,
    comForm,
    comQuery,
    pagination,
  },
  data() {
    return {
      params: {
        total: 0, // 总数
        page: 1, // 页数
        size: 10, // 条数
      },
      list: [],
      load: false,
    };
  },
  mounted() {
    // 查询商品
    this.queryCommodity();
  },
  methods: {
    // 查询商品
    queryCommodity(option) {
      this.load = true;
      if (option) {
        Object.assign(this.params, option);
      }
      getCommodity(this.params)
        .then((res) => {
          this.params.total = res.data.total;
          this.list = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },

    // 查询
    toQuery() {
      this.$refs.query.show.dialog = true;
    },

    // 新增
    toAdd() {
      this.$refs.form.isAdd = true;
      this.$refs.form.show.dialog = true;
    },

    // 取消
    toCancel() {
      this.params = {
        total: 0, // 总数
        page: 1, // 页数
        size: 10, // 条数
      };
      this.queryCommodity();
    },

    handleClose() {},
  },
};
</script>

<style lang="scss" scoped>
.commoditys {
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
      /deep/ {
        .el-card__body {
          padding-top: 0;
          overflow-y: auto;
          height: calc(100% - 89px);
        }
      }
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .el-collapse {
    border: 0;
    .collapse-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
    }
    /deep/ {
      .el-collapse-item__header.is-active {
        border-bottom-color: #ebeef5;
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    .row-form {
      padding-top: 25px;
      background: #f4f7fc;
    }
  }
}
/deep/ {
  img {
    width: 55px;
  }
}
</style>
