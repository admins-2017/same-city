<template>
  <div class="login">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane :label="tab1">
          <div class="login-content">
            <form action="/login" class="login-form">
              <div>
                <i class="el-icon-s-custom"></i>
                <input type="text" placeholder="请输入用户名" v-model="loginData.username" />
              </div>
              <div>
                <i class="el-icon-document"></i>
                <input type="password" placeholder="请输入密码" v-model="loginData.password" />
              </div>
            </form>
            <div class="content-code">
              <div>
                <img :src="resultCode" alt />
                <input type="text" v-model="loginData.result" />
              </div>
            </div>
            <div class="content-details">
              <span>
                还没有账号？
                <router-link to="/">立即注册</router-link>
              </span>
              <span>
                <router-link to="/find">忘记密码</router-link>
              </span>
            </div>
            <div class="content-botton">
              <el-button type="primary" @click="test">登录</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="tab2">
          <div class="login-sms">
            <div>
              <i class="el-icon-mobile-phone"></i>
              <input type="text" placeholder="请输入手机号" v-model="smsData.number" />
            </div>
            <div>
              <i class="el-icon-message"></i>
              <input type="text" placeholder="验证码" v-model="smsData.result" />
              <button @click="getSmsResult">发送验证码</button>
            </div>
            <div>
              <el-button type="primary" @click="test2">登录</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
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
    };
  },
  methods: {
    test() {
      let formData = new FormData();
      for (var key in this.loginData) {
        formData.append(key, this.loginData[key]);
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
          localStorage.setItem(
            "user-information",
            JSON.stringify(res.data.data)
          );
          this.$router.push("/home");
        } else {
          this.$message.error(res.data.meta.msg);
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
  created() {
    axios({
      method: "get",
      url: "/api/user/code",
    })
      .then((res) => {
        this.loginData.code = res.data.uuid;
        this.resultCode = res.data.img;
      })
      .catch((err) => {
        console.log(err);
        this.$message.error("服务器连接超时 请重试！");
      });
  },
};
</script>

<style lang="less" scoped>
html,
body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login {
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../assets/beijing.jpg);
  background-position: 100% 100%;

  > div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-tabs--border-card {
      opacity: 0.7;
      width: 30%;
      position: relative;
      top: -30px;

      .el-tabs__header {
        color: red;
      }

      .el-tabs__content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0px;
        background-color: indianred !important;
        .login-content {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .login-form {
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            div {
              width: 100%;
              border: 1px solid silver;
              margin: 5px 0px;
              display: flex;
              justify-content: center;
              i {
                font-size: 25px;
                margin: 5px;
              }
              input {
                font-size: 20px;
                border: 0px;
                margin: 5px 10px;
                text-align: center;
              }

              input:focus {
                border-bottom: 1px solid silver;
                text-align: center;
                outline: none;
              }
            }
          }
          .content-code {
            width: 60%;
            div {
              margin: 10px 0px;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img {
                width: 75%;
              }
              input {
                margin-left: 5px;
                width: 20%;
                flex: 1;
                border: 0px;
                font-size: 25px;
                border-bottom: 2px solid silver;
                text-align: center;
              }
              input:focus {
                outline: none;
                border-bottom: 2px solid silver;
              }
            }
          }
          .content-details {
            width: 80%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:nth-of-type(1) {
              width: 75%;
              font-size: 10px;
              a {
                text-decoration: none;
                font-size: 17px;
                color: #feba3c;
              }
            }
            span:nth-of-type(2) {
              width: 25%;
              a {
                text-decoration: none;
                font-size: 15px;
                color: #5bbf0e;
              }
            }
          }
          .content-botton {
            width: 100%;
            margin: 10px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            .el-button {
              width: 80%;
            }
          }
        }
        .login-sms {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          div:nth-of-type(1) {
            width: 80%;
            border: 1px solid silver;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0px;
            padding: 5px 0px;
            i {
              font-size: 25px;
            }
            input {
              font-size: 20px;
              border: 0px;
              margin-left: 5px;
              text-align: center;
            }
            input:focus {
              outline: none;
            }
          }
          div:nth-of-type(2) {
            width: 80%;
            border: 1px solid silver;
            margin: 10px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px 0px;
            i {
              font-size: 25px;
              width: 10%;
            }
            input {
              font-size: 15px;
              width: 30%;
              margin-left: 5px;
              padding: 2px;
              text-align: center;
              border: 0px;
              border-bottom: 1px solid silver;
            }
            input:focus {
              outline: none;
              border-bottom: 1px solid silver;
            }
            button {
              font-size: 15px;
              width: 28%;
              padding: 0px;
              margin-left: 10px;
              background-color: #67aea5;
            }
          }
          div:nth-of-type(3) {
            width: 80%;
            margin: 30px 0px;
            .el-button {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
