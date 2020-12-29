<template>
  <div class="roles">
    <!-- 头部搜索 -->
    <eheader />
    <!-- 列表 -->
    <el-table :data="tableData" v-loading="load" size="small">
      <el-table-column
        prop="roleId"
        label="角色id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roleDescription"
        label="角色简介"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="roleCode"
        label="角色编码"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="默认角色" prop="defaultRole">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.defaultRole">
            默认角色
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="left">
        <template slot-scope="scope">
          <el-button @click="updateRole(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <template v-if="!scope.row.defaultRole">
            <el-divider direction="vertical" />
            <el-button
              type="text"
              size="small"
              class="danger-text-btn"
              @click="delRoleById(scope.row.roleId)"
              >删除
            </el-button>
            <el-divider direction="vertical" />
            <el-button
              @click="updateDefaultRole(scope.row.roleId)"
              type="text"
              size="small"
              >设为默认
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :config="params" @change="queryAllRole" />

    <!-- 表单 -->
    <roleForm ref="form" />
  </div>
</template>

<script>
import axios from "axios";
import { COUNT } from "@/utils/constant"; // 查询条数
import { getAllRole, getRoleByName, delRole } from "@/api/role";
import pagination from "@/components/pagination"; // 组件-分页
import eheader from "./modules/head.vue";
import roleForm from "./modules/form.vue";
export default {
  name: "roles",
  components: {
    eheader,
    pagination,
    roleForm,
  },
  data() {
    return {
      params: {
        total: 0, // 总数
        page: 1, // 页数
        size: COUNT, // 条数
      },
      tableData: [], // 表格数据
      load: false,

      userDetails: {},
    };
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.queryAllRole();
  },
  methods: {
    // 查询所有角色
    queryAllRole() {
      this.load = true;
      getAllRole(this.params)
        .then((res) => {
          this.params.total = res.data.total;
          this.tableData = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
        });
    },

    // 根据名称查询
    queryRoleByName(queryName) {
      this.load = true;
      getRoleByName(queryName, this.params.page, this.params.size)
        .then((res) => {
          this.total = res.data.total;
          this.tableData = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
        });
    },

    // 编辑
    updateRole(value) {
      const form = this.$refs.form;
      form.show.dialog = true;
      form.show.load = true;
      this.$nextTick(() => {
        form.$refs.tree.setCheckedKeys([]);
        form.isAdd = false;
        form.form = value;
        form.roleId = value.roleId;
        form.getMenuByRole(value.roleId);
      });
    },

    // 删除
    delRoleById(value) {
      delRole(value)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.data,
              type: "success",
            });
            this.queryAllRole();
          } else {
            this.$message.error("删除角色出错 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 设为默认
    updateDefaultRole(value) {
      axios({
        method: "put",
        url: "/api/role/default/" + value,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.queryAllRole();
          } else {
            this.$message.error("修改默认角色出错 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>
