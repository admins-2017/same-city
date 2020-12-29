<template>
  <div class="head">
    <el-input
      placeholder="请输入角色名"
      prefix-icon="el-icon-search"
      size="small"
      v-model="queryName"
      clearable
    ></el-input>
    <el-button type="primary" size="small" icon="el-icon-search" @click="query">
      查 询
    </el-button>
    <el-button type="primary" size="small" icon="el-icon-plus" @click="add">
      新 增
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
      if (this.queryName !== "") {
        this.$parent.queryRoleByName(this.queryName);
      } else {
        this.$parent.queryAllRole();
      }
    },

    // 新增用户
    add() {
      const form = this.$parent.$refs.form;
      form.isAdd = true;
      Object.assign(form.$data.form, form.$options.data().form);
      if (form.$refs.tree) {
        form.$refs.tree.setCheckedKeys([]);
      }
      form.show.dialog = true;
    },
  },
};
</script>
