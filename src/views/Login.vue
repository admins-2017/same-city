<template>
  <div class="login">
    <h1><img src="../assets/img/logo5.jpg" />巨蜥云<sup>๑</sup></h1>
    <el-tabs type="border-card">
      <el-tab-pane label="账号登录">
        <div class="account">
          <el-form
            :model="loginData"
            :rules="rules"
            ref="accountForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item prop="username">
              <el-input
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
                v-model="loginData.username"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                v-model="loginData.password"
              />
            </el-form-item>
            <div class="content-code">
              <img
                :src="resultCode"
                alt
                v-loading="load.code"
                @click="getImgCode"
              />
              <el-form-item prop="result">
                <el-input
                  type="text"
                  placeholder="验证码"
                  prefix-icon="el-icon-collection-tag"
                  v-model="loginData.result"
                />
              </el-form-item>
            </div>
          </el-form>
          <!-- <div class="content-details">
            <router-link to="/">立即注册</router-link>
            <router-link to="/find">忘记密码</router-link>
          </div> -->
          <el-button type="primary" :loading="load.login" @click="userLogin">
            登录
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="手机号登录">
        <div class="tel">
          <el-input
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
            v-model="smsData.number"
          />
          <div>
            <el-input
              placeholder="验证码"
              prefix-icon="el-icon-collection-tag"
              v-model="smsData.result"
            >
              <el-button slot="append" type="success" @click="getSmsResult">
                发送验证码
              </el-button>
            </el-input>
          </div>
          <el-button type="primary" @click="test2">登录</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="bottom-layer">
      <span class="lh">©2020&nbsp;Baidu&nbsp;</span>
      <span class="lh">(京)-经营性-2017-0020</span>
      <span class="lh s-bottom-recordcode">京公网安备11000002000001号</span>
      <span class="lh">京ICP证030173号</span>
    </div>
  </div>
</template>

<script>
import { getCode, login } from "@/api/login"; // 接口-获取验证码 / 登录
import { accountRule } from "@/rule/login"; // 校验规则-账号登录
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      loginData: {
        username: "",
        password: "",
        result: "",
        code: "",
        type: "1",
      },
      smsData: {
        number: "",
        result: "",
        code: "",
        type: "2",
      },
      resultCode: "",
      tab1: "账号登录",
      tab2: "手机号登录",
      load: {
        code: false,
        login: false,
      },
      rules: accountRule, // 账号登陆规则
    };
  },
  created() {
    // 获取图片验证码
    this.getImgCode();
  },
  methods: {
    // 获取图片验证码
    getImgCode() {
      this.load.code = true;
      getCode()
        .then((resp) => {
          this.loginData.code = resp.uuid;
          this.resultCode = resp.img;
          // this.load.code = false;
        })
        .catch(() => {
          this.load.code = false;
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 登录
    userLogin() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          this.load.login = true;
          let formData = new FormData();
          for (var key in this.loginData) {
            formData.append(key, this.loginData[key]);
          }
          login(formData)
            .then((resp) => {
              if (resp.meta.status == 200) {
                this.$message({
                  message: resp.meta.msg,
                  type: "success",
                });
                localStorage.setItem(
                  "user-information",
                  JSON.stringify(resp.data)
                );
                this.$router.push("/home");
              } else {
                this.$message.error(resp.msg);
              }
              this.load.login = false;
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("登录失败，请稍后重试");
              this.load.login = false;
            });
        } else {
          return false;
        }
      });
    },

    test2() {
      let formData = new FormData();
      for (var key in this.smsData) {
        formData.append(key, this.smsData[key]);
      }
      axios({
        method: "post",
        url: "/api/login/userLogin",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        data: formData,
      }).then((res) => {
        if (res.data.meta.status == 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },

    // 获取手机验证码
    getSmsResult() {
      axios({
        method: "post",
        url: "/api/sms/send",
        params: {
          phoneNumber: this.smsData.number,
        },
      })
        .then((res) => {
          this.smsData.code = res.data.data.uuid;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url(../assets/img/beijing.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .el-tabs {
    width: 400px;
  }

  .account,
  .tel {
    height: 250px;
    padding: 0 20px 20px 20px;
    .el-input + .el-input {
      margin-top: 20px;
    }
    > .el-button {
      width: calc(100% - 70px);
      position: absolute;
      bottom: 35px;
    }
    > div {
      width: 100%;
    }

    .content-code {
      display: flex;
      justify-content: space-between;
      img {
        width: 35%;
        height: 37.45px;
      }
      .el-input {
        width: 100%;
      }
    }
    .content-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 12px;
    }
  }
  .tel {
    > div:nth-child(2) {
      display: flex;
      padding: 20px 0;
      justify-content: space-between;
    }
  }
}

/deep/ {
  .el-tabs {
    border: 0;
    border-radius: 5px;
    .el-tabs__header {
      border-radius: 5px 5px 0 0;
    }
    .el-tabs__nav {
      width: 100%;
      .el-tabs__item {
        width: 50%;
        text-align: center;
        margin: 0 !important;
        padding: 0 !important;
        border-top: 0 !important;
        &:nth-child(1) {
          border-left: 0;
          border-radius: 5px 0 0 0;
        }
        &:nth-child(2) {
          border-right: 0;
          border-radius: 0 5px 0 0;
        }
      }
    }
  }
  .el-form-item__content {
    margin-left: 0 !important;
  }
  a {
    color: #00bcd4;
  }
}
h1 {
  color: #fff;
  display: flex;
  align-items: center;
  width: 400px;
  text-shadow: 1px 0.5px 1px #00bcd3;
  letter-spacing: 3px;
  margin-top: -3%;
  img {
    border-radius: 50%;
    width: 37.45px;
    margin-right: 15px;
  }
  sup {
    font-size: 14px;
    margin-top: -15px;
    margin-left: 5px;
  }
}
.bottom-layer {
  color: #f6f0f0;
  font-size: 12px;
  position: absolute;
  bottom: 15px;
}
</style>
