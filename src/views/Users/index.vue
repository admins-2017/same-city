<template>
  <div class="user">
    <!-- 左侧商铺列表 -->
    <user-left @click="handleCheckChange" />
    <!-- 右侧用户列表 -->
    <div class="user-right">
      <div class="head">
        <el-input
          placeholder="请输入用户名"
          prefix-icon="el-icon-search"
          size="small"
          v-model="queryName"
          clearable
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="getUserByName"
          >查 询
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="toAdd"
          >新 增
        </el-button>
      </div>
      <el-table :data="tableData" v-loading="load.table" size="small">
        <el-table-column
          prop="userId"
          sortable
          label="用户id"
          width="175"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="85"
        ></el-table-column>
        <el-table-column
          prop="userDetailsSex"
          label="性别"
          width="65"
          :filters="[
            { text: '男', value: 1 },
            { text: '女', value: 2 },
          ]"
          :filter-method="filterHandler"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              class="boy"
              size="small"
              disable-transitions
              v-if="scope.row.userDetailsSex === 1"
              >男
            </el-tag>
            <el-tag class="girl" size="small" disable-transitions v-else
              >女</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="userDetailsTel"
          label="联系方式"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="userDetailsAddr"
          label="家庭住址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="shopName"
          label="所属商铺"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="70"
          :filters="[
            { text: '正常', value: 'NORMAL' },
            { text: '停用', value: 'PROHIBIT' },
          ]"
          :filter-method="filterHandler"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.status === 'NORMAL' ? 'success' : 'danger'"
              disable-transitions
              v-if="scope.row.status == 'NORMAL'"
              >正常</el-tag
            >
            <el-tag
              size="small"
              :type="scope.row.status === 'NORMAL' ? 'success' : 'danger'"
              disable-transitions
              v-else
              >停用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="toEdit(scope.row)" size="small"
              >编辑</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              type="text"
              size="small"
              class="danger-text-btn"
              @click="toStop(scope.row.userId)"
              v-if="scope.row.status === 'NORMAL'"
              >停用</el-button
            >
            <el-button
              type="text"
              size="small"
              class="success-text-btn"
              @click="toStart(scope.row.userId)"
              v-else
              >启用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :config="config" @change="getUserList" />
    </div>

    <!-- 编辑 -->
    <edit ref="editRef" />

    <!-- 新增 -->
    <add ref="addRef" />
  </div>
</template>

<script>
import {
  getAllUser,
  getUserByName,
  stopUser,
  startUser,
  getShopUser,
} from "@/api/users";
import userLeft from "./modules/left"; // 组件-左侧商铺
import add from "./modules/add"; // 组件-新增弹窗
import edit from "./modules/edit"; // 组件-编辑弹窗
import pagination from "@/components/pagination"; // 组件-分页
import { COUNT } from "@/utils/constant"; // 查询条数
export default {
  name: "users",
  components: {
    userLeft,
    add,
    edit,
    pagination,
  },
  data() {
    return {
      config: {
        total: 0, // 总数
        page: 1, // 页数
        size: COUNT, // 条数
      },
      queryName: "",
      tableData: [],
      load: {
        table: false,
      },
    };
  },
  mounted() {
    // 查询所有用户
    this.getUserList();
  },
  methods: {
    // 新增
    toAdd() {
      this.$refs.addRef.addDialog = true;
    },

    // 编辑
    toEdit(value) {
      this.$refs.editRef.editDialog = true;
      this.$refs.editRef.userDetailsShow = value;
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },

    // 查询所有用户
    getUserList() {
      this.load.table = true;
      getAllUser(this.config)
        .then((resp) => {
          this.config.total = resp.data.total;
          this.tableData = resp.data.records;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 点击左侧店铺查询用户
    handleCheckChange(data) {
      this.load.table = true;
      getShopUser(data.shopId, this.config)
        .then((resp) => {
          this.config.total = resp.data.total;
          this.tableData = resp.data.records;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 根据名称查询用户
    getUserByName() {
      getUserByName(this.queryName, this.config)
        .then((resp) => {
          this.config.total = resp.data.total;
          this.tableData = resp.data.records;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 停用用户
    toStop(id) {
      stopUser(id)
        .then((resp) => {
          if (resp.status == 200) {
            this.$message({
              message: "已停用",
              type: "success",
            });
            this.getUserList();
          } else {
            this.$message.error("停用账号发生错误 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 启用用户
    toStart(id) {
      startUser(id)
        .then((resp) => {
          if (resp.status == 200) {
            this.$message({
              message: "已启用",
              type: "success",
            });
            this.getUserList();
          } else {
            this.$message.error("启用账号发生错误 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user {
  margin: 0 !important;
  padding: 0 !important;
  background: unset !important;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;

  .user-right {
    margin: 20px 20px 20px 5px;
    padding: 20px;
    width: 85%;
    padding-left: 20px;
    border-left: 0.5px solid #ebeef5;
    border-radius: 3px;
    background: #fff;
    .head {
      display: flex;
    }
  }
}
</style>
