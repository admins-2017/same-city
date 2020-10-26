<template>
  <div id="orders" class="area">
    <!-- <h2>销售单</h2> -->
    <div class="area-header">
      <div class="area-title">销售单</div>
      <div class="area-search">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click="addTableColumn">添加</el-button>
      </div>
    </div>
    <div class="area-body">
      <el-table :data="list.table">
        <el-table-column label="#" type="index" />
        <el-table-column label="name">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="date">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="number">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.name"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteTableColumn(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "orders",
  data() {
    return {
      list: {
        table: [],
      },
      input: "",
    };
  },
  methods: {
    addTableColumn() {
      let obj = {
        name: "",
        number: "",
        date: "",
      };
      this.list.table.push(obj);
    },
    deleteTableColumn(o) {
      console.log(o);
      this.list.table.splice(o, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
}
</style>
