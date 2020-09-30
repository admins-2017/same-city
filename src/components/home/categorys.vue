<template>
  <div id="categorys">
    <div>
      <div>
        <div>
          <el-input placeholder="请输入内容" v-model="queryName" clearable>
          </el-input>
          <el-button type="primary" @click="findClassification">查询</el-button>
          <el-button type="primary" @click="changeQuery">取消</el-button>
        </div>
        <div>
          <el-button type="primary">新增</el-button>
        </div>
      </div>
      <div>
        <el-tabs
          type="border-card"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            :label="item.classificationName"
            :name="item.classificationName"
            v-for="item in classificationList"
            :key="item.classificationId"
          >
            <el-table :data="item.children" style="width: 100%" height="550">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-tag
                    v-for="tagClassification in props.row.children"
                    :key="tagClassification.classificationId"
                    >{{ tagClassification.classificationId }} &nbsp;&nbsp;
                    {{ tagClassification.classificationName }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column prop="classificationId" label="ID">
              </el-table-column>
              <el-table-column prop="classificationName" label="分类名称">
              </el-table-column>
              <el-table-column prop="classificationCode" label="分类编号">
              </el-table-column>
              <el-table-column prop="classificationLevel" label="分类等级">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <el-dialog
          title="分类详情"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            v-for="item in classificationDetail"
            :key="item.classificationId"
          >
            <el-form-item label="分类名称">
              <el-input
                v-model="form.classificationName"
                :placeholder="item.classificationName"
                :disabled="!updateStatus"
              ></el-input>
            </el-form-item>
            <el-form-item label="分类编号">
              <el-input
                v-model="form.classificationCode"
                :placeholder="item.classificationCode"
                :disabled="!updateStatus"
              ></el-input>
            </el-form-item>
            <el-form-item class="update-form">
              <el-switch
                v-model="updateStatus"
                active-text="修改"
                inactive-text="显示"
              >
              </el-switch>
              <el-button  type="text" v-if="updateStatus" @click="updateClassification(item)"
                >立即修改</el-button
              >
              <el-button @click="changeUpdate" type="text">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      form: {
        classificationName: "",
        classificationCode: "",
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getAllClassification() {
      axios({
        method: "get",
        url: "/api/classification",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.classificationList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    findClassification() {
      axios({
        method: "get",
        url: "/api/classification/" + this.queryName,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.dialogVisible = true;
            this.classificationDetail = res.data.data;
            console.log(this.classificationDetail);
          } else {
            this.$message.error("查询出错 请重试");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    changeQuery() {
      this.queryName = "";
      this.getAllClassification();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    onSubmit() {
      console.log("submit!");
    },
    updateClassification(val) {
      console.log(val);
      //   修改分类
      let formData = new FormData();
      for (var key in this.form) {
        formData.append(key, this.form[key]);
      }
      formData.append("classificationId", val.classificationId);
      axios({
        method: "put",
        url: "/api/classification/",
        headers: {
          Authorization: this.userDetails.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
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
      (this.form.classificationName = ""),
        (this.form.classificationCode = ""),
        (this.dialogVisible = false);
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllClassification();
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

#categorys {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 98%;
    height: 98%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;

    > div:nth-of-type(1) {
      width: 95%;
      margin: 10px 0px;
      display: flex;
      justify-content: space-between;
      > div:nth-of-type(1) {
        width: 30%;
        display: flex;
        justify-content: space-between;
        .el-input {
          width: 60%;
        }
      }
      > div:nth-of-type(2) {
        width: 30%;
        display: flex;
        justify-content: flex-end;
      }
    }

    > div:nth-of-type(2) {
      width: 95%;
      .el-tag {
        margin-right: 10px;
      }
    }
    > div:nth-of-type(3) {
      .update-form {
		  margin-top: 25px;
		  display: flex;
		  justify-content: center;
        .el-form-item__content {
		  width: 90%;
		  margin: 0px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
