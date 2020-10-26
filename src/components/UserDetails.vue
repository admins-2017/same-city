<template>
  <div id="userDetails">
    <div class="detail-nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-main">
      <div>
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="修改头像" name="first">
              <el-upload
                class="avatar-uploader"
                action="/api/upload/uploadUserAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="updateHeader"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="登录记录" name="second">
              <loginRecord></loginRecord>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div>
        <el-card class="box-card">
          <el-tabs v-model="activeSetting">
            <el-tab-pane label="基本信息" name="first">
              <ul class="details-card">
                <li>
                  <div>
                    <i class="el-icon-user"></i>
                    <span>用户名</span>
                  </div>
                  <el-input
                    :placeholder="userDetail.username"
                    v-model="input"
                    :disabled="true"
                  >
                  </el-input>
                </li>
                <li>
                  <div>
                    <i
                      :class="
                        this.userDetail.userDetailsSex == sexInit
                          ? manIcon
                          : womanIcon
                      "
                    ></i>
                    <span>性别</span>
                  </div>
                  <el-select
                    v-model="updateUser.userDetailsSex"
                    :placeholder="
                      this.userDetail.userDetailsSex == sexInit
                        ? sexMan
                        : sexWoman
                    "
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="!inputShow"
                    >
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <div>
                    <i class="el-icon-s-home"></i>
                    <span>住址</span>
                  </div>
                  <el-input
                    :placeholder="userDetail.userDetailsAddr"
                    v-model="updateUser.userDetailsAddr"
                    :disabled="!inputShow"
                    clearable
                  >
                  </el-input>
                </li>
                <li>
                  <div>
                    <i class="el-icon-phone"></i>
                    <span>手机号</span>
                  </div>
                  <el-input
                    :placeholder="userDetail.userDetailsTel"
                    v-model="input"
                    :disabled="true"
                  >
                  </el-input>
                </li>
                <li>
                  <div>
                    <i class="el-icon-eleme"></i>
                    <span>邮箱</span>
                  </div>
                  <el-input
                    :placeholder="userDetail.userDetailsMail"
                    v-model="input"
                    :disabled="true"
                  >
                  </el-input>
                </li>
                <li>
                  <div>
                    <i class="el-icon-info"></i>
                    <span>所属部门</span>
                  </div>
                  <el-input
                    :placeholder="userDetail.shopName"
                    v-model="updateUser.shopId"
                    :disabled="!inputShow"
                    clearable
                  >
                  </el-input>
                </li>
                <li>
                  <div>
                    <i class="el-icon-info"></i>
                    <span>注册时间</span>
                  </div>
                  <el-date-picker
                    v-model="registeredTime"
                    type="date"
                    placeholder="选择日期"
                    :readonly="true"
                  >
                  </el-date-picker>
                </li>
              </ul>
              <div class="card-update">
                <el-switch
                  v-model="inputShow"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
                <span>修改</span>
                <el-button
                  type="primary"
                  v-if="inputShow"
                  icon="el-icon-check"
                  @click="updateUserDetails"
                ></el-button>
                <el-button
                  type="info"
                  v-if="inputShow"
                  icon="el-icon-close"
                  @click="updateShow"
                ></el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <change></change>
            </el-tab-pane>
            <el-tab-pane label="更换手机" name="third">
              <changePhone></changePhone>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import change from "./ChangePassword.vue";
import changePhone from "./ChangePhone.vue";
import loginRecord from "./LoginRecord.vue";
export default {
  name: "UserDetails",
  components: {
    change,
    changePhone,
    loginRecord,
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data;
      this.userDetail.userDetailsUrl = this.imageUrl;
      localStorage.setItem("user-information", JSON.stringify(this.userDetail));
      this.$store.commit("saveUserImgUrl", this.imageUrl);
      console.log(this.$store.state.userImgUrl);
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
    updateShow() {
      this.updateUser.userDetailsAddr = "";
      this.updateUser.shopId = "";
      this.updateUser.userDetailsSex = "";
    },
    updateUserDetails() {
      let formData = new FormData();
      for (var key in this.updateUser) {
        formData.append(key, this.updateUser[key]);
      }
      axios({
        method: "post",
        url: "/api/detail/",
        headers: {
          Authorization: this.userDetail.token,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res);
          if (res.data.status == 200) {
            this.$message({
              message: "" + res.data.data,
              type: "success",
            });
            this.inputShow = false;
          } else {
            this.$message.error("" + res.data.data);
          }
        })
        .catch((err) => {
          this.$message.error("服务器连接超时 请重试！");
          // this.$router.go(0);
        });
    },
  },
  data() {
    return {
      userDetail: {},
      activeName: "first",
      activeSetting: "first",
      imageUrl: "",
      inputShow: false,
      sexMan: "男",
      sexWoman: "女",
      sexInit: "1",
      manIcon: "el-icon-male",
      womanIcon: "el-icon-female",
      input: "",
      test: "",
      registeredTime: "2014-05-13",
      updateHeader: {
        Authorization: "",
      },
      updateUser: {
        userDetailsSex: "",
        userDetailsAddr: "",
        shopId: "",
      },
      options: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ],
    };
  },
  created() {
    this.userDetail = JSON.parse(localStorage.getItem("user-information"));
    this.imageUrl = this.userDetail.userDetailsUrl;
    this.updateHeader.Authorization = this.userDetail.token;
  },
  watch: {
    activeName() {
      if (this.activeName == "second") {
        console.log(this.activeName);
      }
    },
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0px;
  padding: 0px;

  a {
    text-decoration: none;
  }
}

#userDetails {
  width: 100%;
  height: 100%;
  background-color: white;
  .detail-nav {
    width: 100%;
    padding: 20px 40px;
  }

  .detail-main {
    height: 90%;
    flex: 1;
    display: flex;
    justify-content: center;

    > div:nth-of-type(1) {
      margin: 20px;
      width: 45%;

      .el-tabs__item {
        font-size: 16px;
        font-weight: 400;
      }

      .avatar-uploader {
        margin: 20px 10px;
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;

        .el-upload {
          width: 50%;
          height: 100%;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;

          .avatar {
            width: 80%;
            height: 80%;
          }
        }
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }

    > div:nth-of-type(2) {
      margin: 20px;
      width: 45%;

      .box-card {
        width: 100%;

        .el-card__body {
          width: 100%;

          .el-tabs {
            width: 100%;

            .el-tabs__content {
              width: 100%;

              .el-tab-pane {
                width: 100%;
                display: flex;
                justify-content: center;

                .details-card {
                  width: 80%;
                  padding: 0px;
                  list-style: none;

                  > li {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;

                    div:nth-of-type(1) {
                      height: 100%;
                      width: 30%;
                      margin-right: 10px;
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;

                      i {
                        margin: 0px 5px;
                      }

                      span {
                        margin: 0px 5px;
                      }
                    }

                    div:nth-of-type(2) {
                      width: 60%;
                      margin-left: 10px;

                      .el-input {
                        width: 100%;
                      }
                    }
                  }
                }

                .card-update {
                  width: 10%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;

                  span {
                    font-size: 13px;
                    display: block;
                  }

                  .el-button {
                    width: 80%;
                    margin: 10px 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }

                  .el-button--info {
                    margin: 0px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
