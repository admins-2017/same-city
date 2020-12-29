<template>
  <div class="menus">
    <!-- 搜索 -->
    <menuHead />

    <!-- 列表 -->
    <el-table :data="tableData" v-loading="load" size="small">
      <el-table-column
        prop="menuId"
        label="ID"
        width="50"
        show-overflow-tooltip
      />
      <el-table-column prop="icon" label="图标" width="50">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="权限名称"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column prop="path" label="跳转路径" show-overflow-tooltip />
      <el-table-column
        prop="permission"
        label="权限标识"
        show-overflow-tooltip
      />
      <el-table-column prop="type" label="类型" width="80" align="center">
        <template slot-scope="scope">
          <el-tag
            type="warning"
            size="small"
            disable-transitions
            v-if="scope.row.type === 0"
          >
            目录
          </el-tag>
          <el-tag
            class="boy"
            size="small"
            disable-transitions
            v-else-if="scope.row.type === 1"
            >菜单
          </el-tag>
          <el-tag type="info" size="small" disable-transitions v-else>
            按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="delFlag" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.delFlag === 0 ? 'success' : 'danger'"
            disable-transitions
            v-if="scope.row.delFlag === 0"
            >{{ scope.row.delFlag === 0 ? "使用" : "删除" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
        align="right"
      />
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="150"
        align="right"
      />
    </el-table>

    <!-- 分页 -->
    <pagination :config="params" @change="getAllMenu" />

    <!-- 表单 -->
    <menuForm ref="formRef" />
  </div>
</template>

<script>
import { COUNT } from "@/utils/constant"; // 查询条数
import { getMenus } from "@/api/menus";
import menuHead from "./modules/head"; // 组件-头部
import pagination from "@/components/pagination"; // 组件-分页
import menuForm from "./modules/form"; // 组件-表单
export default {
  name: "menus",
  components: {
    pagination,
    menuHead,
    menuForm,
  },
  data() {
    return {
      tableData: [],
      load: false,
      params: {
        total: 0, // 总数
        page: 1, // 页数
        size: COUNT, // 条数
      },
    };
  },
  created() {
    // 查询
    this.getAllMenu();
  },
  methods: {
    // 查询
    getAllMenu() {
      this.load = true;
      getMenus(this.params)
        .then((res) => {
          this.params.total = res.data.total;
          this.tableData = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
        });
    },
  },
};
</script>
