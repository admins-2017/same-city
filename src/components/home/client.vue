<template>
  <div id="clients">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <span>客户详情</span>
          </div>
          <div>
            <div>
              <el-input
                placeholder="请输入供应商名称"
                prefix-icon="el-icon-search"
                v-model="input2"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入供应商电话号"
                prefix-icon="el-icon-search"
                v-model="input2"
                size="small"
              >
              </el-input>
              <el-input
                placeholder="请输入供应商邮箱号"
                prefix-icon="el-icon-search"
                v-model="input2"
                size="small"
              >
              </el-input>
              <el-select
                size="small"
                v-model="supplierStatus"
                clearable
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in sexs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <el-button size="small" icon="el-icon-search">搜索</el-button>
              <el-button size="small" icon="el-icon-circle-plus-outline"
                >新增</el-button
              >
              <el-button size="small" icon="el-icon-circle-close"
                >取消</el-button
              >
            </div>
          </div>
        </div>
        <div>
          <el-table :data="clientData" height="80%" stripe>
            <el-table-column fixed prop="supplierId" label="ID">
            </el-table-column>
            <el-table-column prop="supplierName" label="名称">
            </el-table-column>
            <el-table-column
              prop="supplierAddress"
              show-overflow-tooltip
              label="联系地址"
            >
            </el-table-column>
            <el-table-column prop="supplierTelephone" label="联系方式">
            </el-table-column>
            <el-table-column
              prop="supplierEmail"
              label="联系邮箱"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="supplierPerson" label="联系人">
            </el-table-column>
            <el-table-column
              prop="supplierBusiness"
              show-overflow-tooltip
              label="提供业务"
            >
            </el-table-column>
            <el-table-column prop="supplierStatus" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.supplierStatus"
                  >正常</el-tag
                >
                <el-tag type="info" v-else>删除</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="size"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "client",
  data() {
    return {
      input2: "",
      size: 10,
      page: 1,
      total: 0,
      clientData: [],
      sexs: [
        {
          value: "false",
          label: "删除",
        },
        {
          value: "true",
          label: "正常",
        },
      ],
      supplierStatus: "",
      dialogVisible: false,
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSupplier();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          console.log(_)
          done();
        })
        .catch((_) => {
          console.log(_)
        });
    },
    getSupplier() {
      axios({
        method: "get",
        url: "/api/supplier/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.clientData = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    console.log(this.userDetails);
    this.getSupplier();
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
  overflow: hidden;
}
#clients {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(1) {
    width: 100%;
    height: 100%;
    display: flex;
    > .el-card {
      width: 100%;
      height: 90%;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-card__header {
        width: 98%;
        height: 10%;
        .clearfix {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div:nth-of-type(1) {
            font-size: 20px;
            color: rgb(138, 138, 138);
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            > span {
              line-height: 100%;
            }
          }
          > div:nth-of-type(2) {
            width: 80%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div:nth-of-type(1) {
              width: 70%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              > .el-input {
                width: 25%;
                height: 100%;
                margin-right: 10px;
              }
              > .el-select {
                width: 25%;
                margin-right: 10px;
                > .el-input {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            div:nth-of-type(2) {
              width: 25%;
              display: flex;
              justify-content: flex-end;
              .el-button {
                height: 95%;
              }
            }
          }
        }
      }
      .el-card__body {
        width: 98%;
        height: 90%;
        > div:nth-of-type(1) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 96%;
          .el-table {
            width: 100%;
          }
          // 去除el.table流体高度的滚动条
          ::-webkit-scrollbar {
            width: 1px;
            height: 1px;
          }
          // ::-webkit-scrollbar-thumb {
          //   background-color: #a1a3a9;
          //   border-radius: 0px;
          // }
          > div:nth-of-type(2) {
            width: 100%;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
