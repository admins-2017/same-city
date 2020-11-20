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
            highlight-current
          >
          </el-tree>
        </div>
      </el-card>
    </div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>商品详情</span>
          <div>
            <el-button icon="el-icon-search" @click="dialogTableVisible = true"
              >查询</el-button
            >
            <el-button icon="el-icon-circle-plus-outline" @click="addCommodity"
              >新增</el-button
            >
            <el-button icon="el-icon-error" @click="cancelAll">取消</el-button>
          </div>
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
          <el-form ref="updateForm" :model="updateForm" label-width="80px">
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
                v-model="updateForm.commodityName"
                :placeholder="commodityDetail.commodityName"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品编号:">
              <el-input
                v-model="updateForm.commodityNumber"
                :placeholder="commodityDetail.commodityNumber"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品单位:">
              <el-select
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
                    item.classificationName ==
                      commodityDetail.classificationName
                  "
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建议售价:">
              <el-input
                v-model="updateForm.commoditySellingPrice"
                :placeholder="commodityDetail.commoditySellingPrice"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品简介:">
              <el-input
                type="textarea"
                v-model="updateForm.commodityDescription"
                :placeholder="commodityDetail.commodityDescription"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="onSubmit">立即修改</el-button>
              <el-button @click="drawer = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
      <div>
        <el-dialog title="构建查询条件" :visible.sync="dialogTableVisible">
          <el-form :model="findCommodityForm">
            <el-form-item label="商品名称" :label-width="formLabelWidth">
              <el-input
                v-model="findCommodityForm.commodityName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品编号" :label-width="formLabelWidth">
              <el-input
                v-model="findCommodityForm.commodityNumber"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品单位:" :label-width="formLabelWidth">
              <el-select v-model="findCommodityForm.commodityUnit" clearable>
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
              <el-select v-model="findCommodityForm.commodityStatus" clearable>
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
              <el-select v-model="findCommodityForm.insertUser" clearable>
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
              <el-select v-model="findCommodityForm.updateUser" clearable>
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
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelFindCommodity">取 消</el-button>
            <el-button type="primary" @click="getCommodityByCondition"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="收货地址" :visible.sync="dialogDetailTableVisible">
          <el-table :data="productsUnderCategory">
            <el-table-column
              property="date"
              label="日期"
              width="150"
            ></el-table-column>
            <el-table-column
              property="name"
              label="姓名"
              width="200"
            ></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <div class="add-commodity">
        <el-drawer
          title="我是标题"
          :visible.sync="addCommodityDrawer"
          :direction="direction"
          :before-close="handleClose"
          :with-header="false"
          size="30%"
        >
          <div>
            <el-form ref="addForm" :model="addForm" label-width="80px">
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
                <el-input v-model="addForm.commodityName"></el-input>
              </el-form-item>
              <el-form-item label="商品编号:">
                <el-input v-model="addForm.commodityNumber"></el-input>
              </el-form-item>
              <el-form-item label="商品单位:">
                <el-select v-model="addForm.commodityUnit" clearable>
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
                <el-select v-model="addForm.classificationId" clearable>
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
                <el-input v-model="addForm.commoditySellingPrice">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="商品简介:">
                <el-input
                  type="textarea"
                  v-model="addForm.commodityDescription"
                  maxlength="30"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="info" @click="insertCommodity"
                  >立即修改</el-button
                >
                <el-button @click="addCommodityDrawer = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-drawer>
      </div>
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
      productsUnderCategory: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      dialogTableVisible: false,
      dialogDetailTableVisible: false,
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
    handleNodeClick(val) {
      console.log(val);
      this.dialogDetailTableVisible = true;
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
        .then((_) => {
          console.log(_);
          done();
        })
        .catch((_) => {
          console.log(_);
        });
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
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow-y: hidden;
  > div:nth-of-type(1) {
    width: 22%;
    height: 100%;
    display: flex;
    justify-content: center;
    .box-card {
      width: 95%;
      height: 90%;
      overflow-y: scroll;
      .el-card__header {
        padding: 10px;
        .clearfix {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            padding: 8px;
          }
          .el-button {
            padding: 8px;
            font-size: 13px;
          }
        }
      }
      .el-card__body {
        > div {
          .el-tree {
            margin: 10px 0px;
          }
        }
      }
    }
    .box-card::-webkit-scrollbar {
      width: 0 !important;
    }
    .box-card::-webkit-scrollbar {
      width: 0 !important;
      height: 0;
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
      > .el-card__header {
        padding: 10px;
        .clearfix {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            padding: 8px;
          }
          .el-button {
            padding: 8px;
            font-size: 13px;
          }
        }
      }
      > .el-card__body {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .my-collapse {
          width: 100%;
          height: 85%;
          overflow-y: auto;
          .el-collapse {
            width: 100%;
            .el-collapse-item__wrap {
              width: 100%;
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
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }
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
            width: 100%;
            height: 200px;
            line-height: 178px;
            text-align: center;
          }
          .avatar {
            width: 100%;
            height: 200px;
            display: block;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .add-commodity {
      .el-upload {
        width: 100%;
      }
    }
  }
}
</style>
