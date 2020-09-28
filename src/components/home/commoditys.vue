<template>
  <div id="commoditys">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>分类详情</span>
        </div>
        <div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree
            :data="classificationData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree"
          >
          </el-tree>
        </div>
      </el-card>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品详情</span>
        </div>
        <div class="my-collapse">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item
              :title="item.commodityName"
              :name="item.commodityId"
              v-for="item in commoditys"
              :key="item.commodityId"
            >
              <div>
                <img :src="item.commodityPicture" :alt="item.commodityName" />
              </div>
              <div>
                <el-row :gutter="20">
                  <el-col :span="3"><span>商品名：</span></el-col>
                  <el-col :span="5"
                    ><span>{{ item.commodityName }}</span></el-col
                  >
                  <el-col :span="3"><span>商品编号：</span></el-col>
                  <el-col :span="5"
                    ><span>{{ item.commodityNumber }}</span></el-col
                  >
                  <el-col :span="3"><span>商品单位：</span></el-col>
                  <el-col :span="5"
                    ><span>{{ item.commodityUnit }}</span></el-col
                  >
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3"><span>分类：</span></el-col>
                  <el-col :span="5"
                    ><span>{{ item.classificationName }}</span></el-col
                  >
                  <el-col :span="3"><span>建议售价：</span></el-col>
                  <el-col :span="5"
                    ><span>{{ item.commoditySellingPrice }}/元</span></el-col
                  >
                  <el-col :span="3"><span>状态：</span></el-col>
                  <el-col :span="5" v-if="item.commodityStatus == 0"
                    ><span>上架</span></el-col
                  >
                  <el-col :span="5" v-if="item.commodityStatus == 1"
                    ><span>下架</span></el-col
                  >
                  <el-col :span="5" v-if="item.commodityStatus == 2"
                    ><span>删除</span></el-col
                  >
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3"><span>商品介绍：</span></el-col>
                  <el-col :span="15"
                    ><span>{{ item.commodityDescription }}</span></el-col
                  >
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3"><span>添加人员：</span></el-col>
                  <el-col :span="7"
                    ><span>{{ item.insertUsername }}</span></el-col
                  >
                  <el-col :span="3"><span>修改人员：</span></el-col>
                  <el-col :span="7"
                    ><span>{{ item.updateUsername }}</span></el-col
                  >
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="3"><span>添加时间：</span></el-col>
                  <el-col :span="7"
                    ><span>{{ item.insertTime }}</span></el-col
                  >
                  <el-col :span="4"><span>最近修改时间：</span></el-col>
                  <el-col :span="7"
                    ><span>{{ item.updateTime }}</span></el-col
                  >
                </el-row>
                <div class="operating-commodity">
                  <el-button
                    type="success"
                    size="mini"
                    v-if="item.commodityStatus != 0"
                    @click="updateCommodityStatus(item.commodityId, 3)"
                    >上架</el-button
                  >
                  <el-button
                    type="warning"
                    size="mini"
                    v-if="
                      item.commodityStatus != 1 && item.commodityStatus != 2
                    "
                    @click="updateCommodityStatus(item.commodityId, 1)"
                    >下架</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    v-if="item.commodityStatus != 2"
                    @click="updateCommodityStatus(item.commodityId, 2)"
                    >删除</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="item.commodityStatus == 2"
                    @click="updateCommodityStatus(item.commodityId, 4)"
                    >恢复</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="updateCommodity(item)"
                    >修改</el-button
                  >
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
      <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        :with-header="false"
        size="30%"
      >
        <div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="商品图:">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品名称:">
              <el-input
                v-model="form.name"
                :placeholder="commodityDetail.commodityName"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品编号:">
              <el-input
                v-model="form.name"
                :placeholder="commodityDetail.commodityNumber"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品单位:">
              <el-select
                v-model="unitValue"
                clearable
                :placeholder="commodityDetail.commodityUnit"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.value == commodityDetail.commodityUnit"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类:">
              <el-input
                v-model="form.name"
                :placeholder="commodityDetail.commodityName"
              ></el-input>
            </el-form-item>
            <el-form-item label="建议售价:">
              <el-input
                v-model="form.name"
                :placeholder="commodityDetail.commoditySellingPrice"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品简介:">
              <el-input
                type="textarea"
                v-model="form.desc"
                :placeholder="commodityDetail.commodityDescription"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "commoditys",
  data() {
    return {
      classificationData: [],
      filterText: "",
      activeNames: ["1"],
      size: 10,
      page: 1,
      total: 0,
      defaultProps: {
        children: "children",
        label: "classificationName",
      },
      commoditys: [],
      drawer: false,
      direction: "ltr",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      options: [
        {
          value: "盒",
          label: "1/盒",
        },
        {
          value: "瓶",
          label: "1/瓶",
        },
        {
          value: "箱",
          label: "1/箱",
        },
        {
          value: "包",
          label: "1/包",
        },
        {
          value: "份",
          label: "1/份",
        },
        {
          value: "个",
          label: "1/个",
        },
        {
          value: "杯",
          label: "1/杯",
        },
        {
          value: "条",
          label: "1/条",
        },
      ],
      unitValue: "",
      commodityDetail: {},
      imageUrl:
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1954582644,2804545051&fm=26&gp=0.jpg",
    };
  },
  methods: {
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
          this.classificationData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getAllCommodity() {
      axios({
        method: "get",
        url: "/api/commodity/" + this.page + "/" + this.size,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.total = res.data.data.total;
          this.commoditys = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getAllCommodity();
    },
    handleNodeClick(val) {
      console.log(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.classificationName.indexOf(value) !== -1;
    },
    handleChange(val) {
      console.log(val);
    },
    updateCommodityStatus(val1, val2) {
      axios({
        method: "put",
        url: "/api/commodity/" + val1 + "/" + val2,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.status) {
            this.$notify({
              title: "提示",
              message: res.data.data,
            });
            this.getAllCommodity();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    updateCommodity(val) {
      console.log(val);
      this.commodityDetail = val;
      this.drawer = true;
    },
    handleClose(done) {
      console.log(done);
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onSubmit() {
      console.log("submit!");
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllClassification();
    this.getAllCommodity();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
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
#commoditys {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(1) {
    width: 22%;
    height: 100%;
    display: flex;
    justify-content: center;
    .box-card {
      width: 95%;
      height: 100%;
      overflow-y: auto;
      position: relative;
      .el-card__body {
        > div {
          .el-tree {
            margin: 10px 0px;
          }
        }
      }
    }
  }
  > div:nth-of-type(2) {
    width: 78%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: white;
    > .box-card {
      width: 100%;
      height: 100%;
      position: relative;
      overflow-y: auto;
      .my-collapse {
        width: 100%;
        height: 80%;
        overflow-y: auto;
        .el-collapse {
          width: 100%;
          height: 100%;
          .el-collapse-item__wrap {
            width: 100%;
            height: 100%;

            .el-collapse-item__content {
              width: 100%;
              display: flex;
              justify-content: space-between;
              > div:nth-of-type(1) {
                width: 25%;
                img {
                  width: 90%;
                  height: 160px;
                }
              }
              > div:nth-of-type(2) {
                width: 75%;
                img {
                  width: 100%;
                  height: 210px;
                }
                .operating-commodity {
                  width: 50%;
                  margin: 10px 0px;
                  display: flex;
                  justify-content: space-between;
                }
              }
            }
          }
        }
      }
      .el-pagination {
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        width: 100%;
        position: relative;
        bottom: -20px;
      }
    }
    .el-drawer {
      width: 100%;
      .el-drawer__body {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        > div {
          width: 80%;
          height: 100%;
          margin: 20px 0px;
          .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            // display: flex;
            // justify-content: center;
            // align-items: center;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409eff;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 200px;
            line-height: 178px;
            text-align: center;
          }
          .avatar {
            width: 290px;
            height: 200px;
            display: block;
          }
        }
      }
    }
  }
}
</style>
