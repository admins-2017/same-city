<template>
  <div class="commoditys">
    <el-card shadow="never">
      <div slot="header" class="card-head">
        <el-input
          placeholder="输入关键字进行过滤"
          size="small"
          v-model="filterText"
        />
      </div>
      <el-tree
        :data="classificationData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="tree"
        highlight-current
      />
    </el-card>
    <el-card shadow="never">
      <div slot="header" class="card-head">
        <span>商品详情</span>
        <div>
          <el-button
            icon="el-icon-search"
            size="small"
            type="primary"
            @click="dialogTableVisible = true"
            >查 询
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addCommodity"
            >新 增
          </el-button>
          <el-button
            icon="el-icon-close"
            type="primary"
            size="small"
            @click="cancelAll"
            >取 消
          </el-button>
        </div>
      </div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          :title="item.commodityName"
          :name="item.commodityId"
          v-for="item in commoditys"
          :key="item.commodityId"
        >
          <template slot="title">
            <div class="collapse-title">
              <span>{{ item.commodityName }}</span>
              <div class="operating-commodity">
                <el-button
                  class="success-text-btn"
                  type="text"
                  size="mini"
                  v-if="item.commodityStatus != 0"
                  @click="updateCommodityStatus(item.commodityId, 3, $event)"
                  >上架
                </el-button>
                <el-button
                  class="warning-text-btn"
                  type="text"
                  size="mini"
                  v-if="item.commodityStatus != 1 && item.commodityStatus != 2"
                  @click="updateCommodityStatus(item.commodityId, 1, $event)"
                  >下架
                </el-button>
                <el-divider direction="vertical" />
                <el-button
                  class="danger-text-btn"
                  type="text"
                  size="mini"
                  v-if="item.commodityStatus != 2"
                  @click="updateCommodityStatus(item.commodityId, 2, $event)"
                  >删除
                </el-button>
                <el-button
                  class="success-text-btn"
                  type="text"
                  size="mini"
                  v-if="item.commodityStatus == 2"
                  @click="updateCommodityStatus(item.commodityId, 4, $event)"
                  >恢复
                </el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  size="mini"
                  @click="updateCommodity(item, $event)"
                  >修改
                </el-button>
              </div>
            </div>
          </template>

          <el-form label-position="top" class="row-form">
            <el-form-item>
              <img :src="item.commodityPicture" />
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ item.commodityName }}</span>
            </el-form-item>
            <el-form-item label="商品编号">
              <span>{{ item.commodityNumber }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ item.commodityUnit }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ item.classificationName }}</span>
            </el-form-item>
            <el-form-item label="建议售价">
              <span>{{ item.commoditySellingPrice }} / 元</span>
            </el-form-item>
            <el-form-item label="状态">
              <span v-if="item.commodityStatus == 0">上架</span>
              <span v-if="item.commodityStatus == 1">下架</span>
              <span v-if="item.commodityStatus == 2">删除</span>
            </el-form-item>
            <el-form-item label="商品介绍">
              <span>{{ item.commodityDescription }}</span>
            </el-form-item>
            <el-form-item label="添加人员">
              <span>{{ item.insertUsername }}</span>
            </el-form-item>
            <el-form-item label="修改人员">
              <span>{{ item.updateUsername }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{ item.insertTime }}</span>
            </el-form-item>
            <el-form-item label="最近修改时间">
              <span>{{ item.updateTime }}</span>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog title="修改商品" :visible.sync="drawer" size="50%">
      <el-form
        ref="updateForm"
        :model="updateForm"
        label-position="top"
        class="row-form"
      >
        <el-form-item label="商品图:">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/uploadImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="updateHeader"
          >
            <img
              v-if="commodityDetail.commodityPicture"
              :src="commodityDetail.commodityPicture"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称:">
          <el-input
            size="small"
            v-model="updateForm.commodityName"
            :placeholder="commodityDetail.commodityName"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编号:">
          <el-input
            size="small"
            v-model="updateForm.commodityNumber"
            :placeholder="commodityDetail.commodityNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品单位:">
          <el-select
            size="small"
            v-model="updateForm.commodityUnit"
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
          <el-select
            size="small"
            v-model="updateForm.classificationId"
            clearable
            :placeholder="commodityDetail.classificationName"
          >
            <el-option
              v-for="item in allClassificationNode"
              :key="item.classificationId"
              :label="item.classificationName"
              :value="item.classificationId"
              :disabled="
                item.classificationName == commodityDetail.classificationName
              "
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建议售价:">
          <el-input
            size="small"
            v-model="updateForm.commoditySellingPrice"
            :placeholder="commodityDetail.commoditySellingPrice"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介:">
          <el-input
            size="small"
            type="textarea"
            v-model="updateForm.commodityDescription"
            :placeholder="commodityDetail.commodityDescription"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="drawer = false">取消</el-button>
        <el-button size="small" type="primary" @click="onSubmit">
          立即修改
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="构建查询条件"
      :visible.sync="dialogTableVisible"
      width="50%"
    >
      <el-form :model="findCommodityForm" label-position="top" class="row-form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input
            size="small"
            v-model="findCommodityForm.commodityName"
            autocomplete="off"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编号" :label-width="formLabelWidth">
          <el-input
            size="small"
            v-model="findCommodityForm.commodityNumber"
            autocomplete="off"
            placeholder="请输入商品编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品单位:" :label-width="formLabelWidth">
          <el-select
            size="small"
            placeholder="请选择商品单位"
            v-model="findCommodityForm.commodityUnit"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态:" :label-width="formLabelWidth">
          <el-select
            size="small"
            placeholder="请选择商品状态"
            v-model="findCommodityForm.commodityStatus"
            clearable
          >
            <el-option
              v-for="item in commodityStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加人员:" :label-width="formLabelWidth">
          <el-select
            size="small"
            placeholder="请选择添加人员"
            v-model="findCommodityForm.insertUser"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改人员:" :label-width="formLabelWidth">
          <el-select
            size="small"
            placeholder="请选择修改人员"
            v-model="findCommodityForm.updateUser"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间:" :label-width="formLabelWidth">
          <el-date-picker
            v-model="insertTimeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日 HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间:" :label-width="formLabelWidth">
          <el-date-picker
            v-model="updateTimeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelFindCommodity">取 消</el-button>
        <el-button size="small" type="primary" @click="getCommodityByCondition">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增商品" :visible.sync="addCommodityDrawer" size="50%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-position="top"
        class="row-form"
      >
        <el-form-item label="商品图:">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/uploadImg"
            :show-file-list="false"
            :on-success="addHandleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="updateHeader"
          >
            <img
              v-if="addForm.commodityPicture"
              :src="addForm.commodityPicture"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称:">
          <el-input
            size="small"
            placeholder="请输入商品名称"
            v-model="addForm.commodityName"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编号:">
          <el-input
            size="small"
            placeholder="请输入商品编号"
            v-model="addForm.commodityNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品单位:">
          <el-select
            size="small"
            placeholder="请选择商品单位"
            v-model="addForm.commodityUnit"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类:">
          <el-select
            size="small"
            placeholder="请选择商品分类"
            v-model="addForm.classificationId"
            clearable
          >
            <el-option
              v-for="item in allClassificationNode"
              :key="item.classificationId"
              :label="item.classificationName"
              :value="item.classificationId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建议售价:">
          <el-input
            size="small"
            placeholder="请输入建议售价"
            v-model="addForm.commoditySellingPrice"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品简介:">
          <el-input
            type="textarea"
            placeholder="请输入商品简介"
            v-model="addForm.commodityDescription"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addCommodityDrawer = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="insertCommodity">
          立即修改
        </el-button>
      </div>
    </el-dialog>
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
      addCommodityDrawer: false,
      direction: "ltr",
      updateForm: {
        commodityName: "",
        commodityNumber: "",
        commoditySellingPrice: "",
        commodityUnit: "",
        commodityDescription: "",
        commodityPicture: "",
      },
      addForm: {
        commodityName: "",
        commodityNumber: "",
        commoditySellingPrice: "",
        commodityUnit: "",
        commodityDescription: "",
        commodityPicture: "",
        classificationId: "",
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
      commodityStatus: [
        {
          value: "0",
          label: "上架",
        },
        {
          value: "1",
          label: "下架",
        },
        {
          value: "2",
          label: "删除",
        },
      ],
      commodityDetail: {},
      updateHeader: {
        Authorization: "",
      },
      dialogTableVisible: false,
      commodityDetailsByClassification: [],
      findCommodityForm: {
        commodityName: "",
        commodityNumber: "",
        commodityUnit: "",
        commodityStatus: "",
        insertStartTime: "",
        insertEndTime: "",
        insertUser: "",
        updateStartTime: "",
        updateEndTime: "",
        updateUser: "",
      },
      formLabelWidth: "120px",
      insertTimeValue: [],
      updateTimeValue: [],
      userList: [],
      allClassificationNode: [],
    };
  },
  methods: {
    getAllUser() {
      axios({
        method: "get",
        url: "/api/user/all",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          this.userList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getAllClassificationNode() {
      axios({
        method: "get",
        url: "/api/classification/all",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.allClassificationNode = res.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
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
          this.total = res.data.data.total;
          this.commoditys = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      let isNoll = false;
      for (var key in this.findCommodityForm) {
        if (this.findCommodityForm[key] != "") {
          isNoll = true;
        }
      }
      console.log(isNoll);
      if (isNoll) {
        this.findCommodityByCondition();
      } else {
        this.getAllCommodity();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.classificationName.indexOf(value) !== -1;
    },
    handleChange(val) {
      console.log(val);
    },
    updateCommodityStatus(val1, val2, e) {
      e.stopPropagation();
      axios({
        method: "put",
        url: "/api/commodity/" + val1 + "/" + val2,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          if (res.status) {
            this.$notify.success({
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
    updateCommodity(val, e) {
      e.stopPropagation();
      this.commodityDetail = val;
      this.drawer = true;
    },
    onSubmit() {
      console.log(this.updateForm);
      console.log(this.commodityDetail.commodityId);
      let formData = new FormData();
      for (var key in this.updateForm) {
        formData.append(key, this.updateForm[key]);
      }
      formData.append("commodityId", this.commodityDetail.commodityId);
      axios({
        method: "put",
        url: "/api/commodity/",
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
            this.drawer = false;
            Object.keys(this.updateForm).forEach(
              (key) => (this.updateForm[key] = "")
            );
            this.getAllCommodity();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    insertCommodity() {
      console.log(this.addForm);
      let formData = new FormData();
      for (var key in this.addForm) {
        formData.append(key, this.addForm[key]);
      }
      axios({
        method: "post",
        url: "/api/commodity/",
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
            this.addCommodityDrawer = false;
            Object.keys(this.addForm).forEach(
              (key) => (this.addForm[key] = "")
            );
            this.getAllCommodity();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    handleAvatarSuccess(res, file) {
      console.log(file);
      this.commodityDetail.commodityPicture = res.data;
      this.updateForm.commodityPicture = res.data;
    },
    addHandleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.addForm.commodityPicture = res.data;
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
    findCommodityByCondition() {
      this.dialogFormVisible = false;
      if (this.insertTimeValue.length != 0 && this.insertTimeValue != "") {
        this.findCommodityForm.insertStartTime = this.insertTimeValue[0];
        this.findCommodityForm.insertEndTime = this.insertTimeValue[1];
      }
      if (this.updateTimeValue.length != 0 && this.insertTimeValue != "") {
        this.findCommodityForm.updateStartTime = this.updateTimeValue[0];
        this.findCommodityForm.updateEndTime = this.updateTimeValue[1];
      }
      let urlCondition = "";
      for (var key in this.findCommodityForm) {
        urlCondition += key + "=" + this.findCommodityForm[key] + "&";
      }
      urlCondition += "page=" + this.page + "&";
      urlCondition += "size=" + this.size;

      axios({
        method: "get",
        url: "/api/commodity/?" + urlCondition,
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.dialogTableVisible = false;
          this.total = res.data.data.total;
          this.commoditys = res.data.data.records;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
    getCommodityByCondition() {
      this.page = 1;
      this.findCommodityByCondition();
    },
    cancelFindCommodity() {
      this.dialogTableVisible = false;
      for (var key in this.findCommodityForm) {
        this.findCommodityForm[key] = "";
      }
      if (this.insertTimeValue.length != 0 && this.insertTimeValue != "") {
        this.insertTimeValue = [];
      }
      if (this.updateTimeValue.length != 0 && this.insertTimeValue != "") {
        this.updateTimeValue = [];
      }
    },
    cancelAll() {
      for (var key in this.findCommodityForm) {
        this.findCommodityForm[key] = "";
      }
      if (this.insertTimeValue.length != 0 && this.insertTimeValue != "") {
        this.insertTimeValue = [];
      }
      if (this.updateTimeValue.length != 0 && this.insertTimeValue != "") {
        this.updateTimeValue = [];
      }
      this.page = 1;
      this.getAllCommodity();
    },
    addCommodity() {
      this.addCommodityDrawer = true;
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    this.getAllClassification();
    this.getAllCommodity();
    this.getAllUser();
    this.getAllClassificationNode();
    this.updateHeader.Authorization = this.userDetails.token;
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.commoditys {
  height: calc(100% - 40px);
  display: flex;
  padding: 0 !important;
  background: unset !important;
  > .el-card {
    &:nth-child(1) {
      width: 16%;
      margin-right: 10px;
    }
    &:nth-child(2) {
      width: 84%;
      /deep/ {
        .el-card__body {
          padding-top: 0;
          overflow-y: auto;
          height: calc(100% - 89px);
        }
      }
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .el-collapse {
    border: 0;
    .collapse-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
    }
    /deep/ {
      .el-collapse-item__header.is-active {
        border-bottom-color: #ebeef5;
      }
    }
    .row-form {
      padding-top: 25px;
    }
  }
  img {
    width: 55px;
  }
}
</style>
