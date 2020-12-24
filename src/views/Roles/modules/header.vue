<template>
  <div class="head">
    <el-input
      placeholder="请输入角色名"
      prefix-icon="el-icon-search"
      size="mini"
      v-model="queryName"
      clearable
    ></el-input>
    <el-button type="primary" size="mini" @click="query">
      查询
    </el-button>
    <el-button type="primary" size="mini" @click="add">
      新增用户
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryName: "",
    };
  },
  methods: {
    // 查询
    query() {
      this.$parent.getRoleByName(this.queryName);
    },

    // 新增用户
    add() {
      this.$parent.insertDialogFormVisible = true;
    },
  },
};
</script>
