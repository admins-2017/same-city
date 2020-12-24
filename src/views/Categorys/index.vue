<template>
  <div class="categorys area">
    <div class="area-child">
      <div class="area-search">
        <el-input placeholder="请输入内容" v-model="queryName" clearable />
        <el-button type="primary" size="small" @click="findClassification">
          查询
        </el-button>
        <!-- <el-button type="primary" size="small">新增</el-button> -->
      </div>
    </div>
    <div class="area-body">
      <el-table
        :data="classificationList"
        :show-header="false"
        size="medium"
        class="one-table"
        ref="oneTable"
        v-loading="load.table"
        :row-class-name="getRowClass"
        @cell-click="rowClick"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.children"
              :show-header="false"
              class="two-table"
              ref="twoTable"
              :row-class-name="getRowClass"
              @cell-click="row2Click"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="three-div">
                    <el-tag
                      type="warning"
                      v-for="tagClassification in scope.row.children"
                      :key="tagClassification.classificationId"
                      >{{ tagClassification.classificationId }} &nbsp;&nbsp;
                      {{ tagClassification.classificationName }}</el-tag
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="two">
                  <el-tag type="success">{{
                    two.row.classificationName
                  }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="one">
            <el-tag>{{ one.row.classificationName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="one">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="mini"
              @click.native="edit(one.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="分类详情" :visible.sync="dialogVisible" width="400px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="分类名称">
            <el-input
              v-model="form.classificationName"
              :placeholder="form.classificationName"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类编号">
            <el-input
              v-model="form.classificationCode"
              :placeholder="form.classificationCode"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="changeUpdate">取 消</el-button>
          <el-button type="primary" size="small" @click="updateClassification"
            >修 改</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getClassification, queryClassification } from "@/api/categorys"; // 接口-获取所有分类 / 查询分类
export default {
  name: "categorys",
  data() {
    return {
      activeName: "食品/酒品/生鲜/特产",
      classificationList: [],
      queryName: "",
      dialogVisible: false,
      updateStatus: false,
      classificationDetail: [],
      form: {
        classificationName: "",
        classificationCode: "",
      },
      load: {
        table: false,
      },
    };
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    // 获取所有分类
    this.getAllClassification();
  },
  methods: {
    // 获取所有分类
    getAllClassification() {
      this.load.table = true;
      getClassification()
        .then((resp) => {
          this.classificationList = resp.data;
          this.load.table = false;
        })
        .catch(() => {
          this.load.table = false;
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 查询分类
    findClassification() {
      queryClassification(this.queryName)
        .then((resp) => {
          if (resp.status == 200) {
            this.dialogVisible = true;
            this.classificationDetail = resp.data;
          } else {
            this.$message.error("查询出错 请重试");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    updateClassification() {
      //   修改分类
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      axios({
        method: "put",
        url: "/api/classification/",
        headers: {
          Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((resp) => {
          console.log(resp);
          if (resp.data.status == 200) {
            this.$message({
              message: resp.data.data,
              type: "success",
            });
            this.dialogVisible = false;
            Object.keys(this.form).forEach((key) => (this.form[key] = ""));
            this.getAllClassification();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    changeUpdate() {
      // this.form.classificationName = "";
      // this.form.classificationCode = "";
      this.dialogVisible = false;
    },

    rowClick(row, column) {
      if (column.width == 50) return;
      if (row.children.length == 0) return;
      this.$refs.oneTable.toggleRowExpansion(row);
    },
    row2Click(row, column) {
      if (column.width == 50) return;
      if (row.children.length == 0) return;
      this.$refs.twoTable.toggleRowExpansion(row);
    },
    // 判断表格是否有子项，无子项不显示展开按钮
    getRowClass(row) {
      if (row.row.children.length === 0) {
        return "row-expand-cover";
      }
    },
    edit(row) {
      console.log(row);
      this.dialogVisible = true;
      this.form = row;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
/deep/ {
  .el-dialog__body {
    background-color: #fff;
  }
  .el-table {
    td {
      padding: 0;
      // border: 0;
    }
    tr {
      height: 50px;
      td:nth-child(1) {
        border: 0;
      }
    }
    .row-expand-cover .cell .el-table__expand-icon {
      display: none;
    }
  }
  .cell {
    text-align: left;
    padding: 0;
  }
  .two-table {
    padding-left: 38px;
  }
  .three-div {
    padding-left: 100px;
  }
}
.el-tag {
  zoom: 1;
  letter-spacing: 2px;
  border-radius: 0 15px 15px 0;
}
</style>
