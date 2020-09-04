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
      <div>
        <el-dialog title="角色详情" :visible.sync="insertDialogFormVisible" :width="fromWidth" center>
          <div class="insert-menu-from">
            <div>
              <el-select v-model="insertFrom.type" clearable placeholder="请选择权限类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <el-input v-model="insertFrom.name" placeholder="权限名称" clearable></el-input>
              <el-input
                v-model="insertFrom.path"
                placeholder="权限路径"
                clearable
                v-if="insertFrom.type == 1"
              ></el-input>
              <el-input
                v-model="insertFrom.permission"
                placeholder="权限标识"
                v-if="insertFrom.type!=0"
                clearable
              ></el-input>
              <el-input
                v-model="insertFrom.iCon"
                placeholder="权限图标"
                clearable
                v-if="insertFrom.type!=2"
              ></el-input>
            </div>
            <div v-if="insertFrom.type!=0">
              <el-select
                v-model="insertFrom.parentId"
                clearable
                :placeholder="insertFrom.type==1? '请选择上级目录':'请选择上级菜单'"
              >
                <el-option
                  v-for="item in fatherMenu"
                  :key="item.menuId"
                  :label="item.name"
                  :value="item.menuId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog">取 消</el-button>
            <el-button type="primary" @click="insertMenu">确 定</el-button>
          </div>
        </el-dialog>
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
      fromWidth: "30%",
      tableData: [],
      insertFrom: {
        name: "",
        path: "",
        permission: "",
        type: "",
        iCon: "",
        parentId: "",
      },
      options: [
        {
          value: "0",
          label: "目录",
        },
        {
          value: "1",
          label: "菜单",
        },
        {
          value: "2",
          label: "按钮",
        },
      ],
      value: "",
      fatherMenu: [],
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
    getMenuByType() {
      axios({
        method: "get",
        url: "/api/menu/type/" + this.insertFrom.type,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.fatherMenu = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    cancelDialog() {
      this.insertDialogFormVisible = false;
      this.insertFrom.name = "";
      this.insertFrom.path = "";
      this.insertFrom.permission = "";
      this.insertFrom.type = "";
      this.insertFrom.iCon = "";
      this.insertFrom.parentId = 0;
    },
    insertMenu() {
      console.log(this.insertFrom);
      let formData = new FormData();
      for (var key in this.insertFrom) {
        formData.append(key, this.insertFrom[key]);
      }
      axios({
        method: "post",
        url: "/api/menu/",
        headers: {
          Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.insertFrom.name = "";
            this.insertFrom.path = "";
            this.insertFrom.permission = "";
            this.insertFrom.type = "";
            this.insertFrom.iCon = "";
            this.insertFrom.parentId = 0;
            this.insertDialogFormVisible = false;
            this.getAllMenu();
          } else {
            this.$message.error("删除失败 请重试！");
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
  watch: {
    "insertFrom.type": {
      handler: function () {
        if (this.insertFrom.type != 0) {
          this.getMenuByType();
        }
      },
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

    > div:nth-of-type(4) {
      .el-dialog {
        background: #bbe6d6;
        .insert-menu-from {
          > div:nth-of-type(1) {
            display: flex;
            justify-content: center;
            width: 100%;
            > .el-select {
              width: 70%;
              display: flex;
              justify-content: center;
              > .el-input {
                width: 100%;
              }
            }
          }
          > div:nth-of-type(2) {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            margin: 20px 0px;
            > .el-input {
              width: 70%;
              margin: 5px 0px;
            }
          }
          > div:nth-of-type(3) {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-top: 20px;
            > .el-select {
              width: 70%;
              display: flex;
              justify-content: center;
              > .el-input {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
