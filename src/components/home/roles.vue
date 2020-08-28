<template>
  <div id="roles">
    <div>
      <div>
          <div>
            <el-input placeholder="请输入角色名" prefix-icon="el-icon-search" v-model="queryName"></el-input>
            <el-button type="primary" plain @click="getRoleByName">查询</el-button>
            <el-button type="primary" plain @click="clearQuery">取消</el-button>
          </div>
          <el-button type="primary" plain @click="insertDialogFormVisible = true">新增用户</el-button>
        </div>
      <div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="roleId" label="角色id" width="170"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="170"></el-table-column>
          <el-table-column prop="roleDescription" label="角色简介"></el-table-column>
          <el-table-column prop="roleCode" label="角色编码" width="180"></el-table-column>
          <el-table-column label="默认角色"  width="100" prop="defaultRole">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.defaultRole">默认角色</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="updateRole(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="delRoleById(scope.row.roleId)">删除</el-button>
              <el-button @click="updateDefaultRole(scope.row.roleId)" type="text" size="small" v-if="!scope.row.defaultRole">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="size"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div>
        <el-dialog title="新增角色" :visible.sync="insertDialogFormVisible" :width="dialogWidht" center>
            <el-form :model="insertForm">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="insertForm.username" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="updateDialogFormVisible = false">取 消</el-button>
              <el-button type="primary">确 定</el-button>
            </div>
          </el-dialog>
      </div>
      <div>
        <el-dialog title="角色详情" :visible.sync="updateDialogFormVisible" :class="roleDetailsClass" :width="dialogWidht" center>
            <el-form :model="updateForm">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="updateForm.username" autocomplete="off" ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="insertDialogFormVisible = false">取 消</el-button>
              <el-button type="primary">确 定</el-button>
            </div>
          </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "roles",
  data() {
    return {
      tableData: [],
      userDetails: {},
      buttonClass: "operating-class",
      page: 1,
      size: 10,
      total: 0,
      queryName: '',
      updateDialogFormVisible: false,
      insertDialogFormVisible: false,
      dialogWidht: '50%',
      formLabelWidth: "100px",
      insertForm: {
        username: "",
        
      },
      updateForm: {
        username: "",
      },
      roleDetailsClass: 'role-details-class'
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getAllRole() {
      axios({
        method: "get",
        url: "/api/role/" + this.page + "/" + this.size,
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
    getRoleByName(){

    },
    clearQuery(){

    },
    delRoleById(value){
      console.log(value)
    },
    handleClick(value){
      console.log(value)
    },
    updateRole(value){
      this.updateDialogFormVisible = true
      console.log(value)
    },
    updateDefaultRole(value){
      console.log(value)
    }
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllRole();
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
#roles {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
      >div:nth-of-type(1){
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    > div:nth-of-type(2) {
      margin-top: 20px;
      width: 94%;
    }
    > div:nth-of-type(3) {
      margin-top: 30px;
      width: 94%;
    }
    > div:nth-of-type(4) {
      background-color: whitesmoke;
    }
    > div:nth-of-type(5) {
      .role-details-class{
        .el-dialog{
          background-color: red
        }
      }
    }
  }
}
</style>
