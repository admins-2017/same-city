<template>
  <div id="menus">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入权限名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
          <el-button type="primary" plain @click="getMenuByName">查询</el-button>
          <el-button type="primary" plain @click="clearQuery">取消</el-button>
        </div>
        <el-button type="primary" plain @click="insertDialogFormVisible = true">新增权限</el-button>
      </div>
      <div>
        <el-table :data="tableData" border style="width: 100%" highlight-current-row>
          <el-table-column prop="menuId" label="ID" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="权限名称" width="180" align="center"></el-table-column>
          <el-table-column prop="path" label="跳转路径" width="120"></el-table-column>
          <el-table-column prop="permission" label="权限标识"></el-table-column>
          <el-table-column prop="type" label="类型" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions v-if="scope.row.type === 0 ">目录</el-tag>
              <el-tag type="success" disable-transitions v-else-if="scope.row.type === 1">菜单</el-tag>
              <el-tag type="info" disable-transitions v-else>按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="delFlag" label="删除标识" width="80" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.delFlag === 0 ? 'success' : 'danger'"
                disable-transitions
                v-if="scope.row.delFlag === 0 "
              >使用</el-tag>
              <el-tag
                :type="scope.row.delFlag === 0 ? 'success' : 'danger'"
                disable-transitions
                v-else
              >删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="显示图标" width="100" align="center">
            <template slot-scope="scope">
              <i :class="scope.row.icon"></i>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "menus",
  data() {
    return {
      queryName: "",
      insertDialogFormVisible: false,
      page: 1,
      size: 10,
      total: 0,
      tableData: [],
    };
  },
  methods: {
    getMenuByName() {},
    clearQuery() {},
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getAllMenu();
    },
    getAllMenu() {
      axios({
        method: "get",
        url: "/api/menu/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllMenu();
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}

#menus {
  width: 100%;
  height: 100%;
  > div {
    width: 98%;
    height: 98%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    > div:nth-of-type(1) {
      width: 94%;
      margin-top: 20px;
      padding: 0px 20px;
      display: flex;
      justify-content: space-between;

      > div:nth-of-type(1) {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    > div:nth-of-type(2) {
      width: 94%;
      margin-top: 20px;
      display: flex;
      justify-content: center;

      .is-center {
        padding: 8px 0px !important;
      }
    }
    > div:nth-of-type(3) {
      width: 94%;
      margin-top: 20px;
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
