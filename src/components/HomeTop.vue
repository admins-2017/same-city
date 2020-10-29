<template>
  <div id="hometop">
    <div class="top-logo">
      <img src="../assets/logo3.jpg" alt="" />
      <span>巨蜥云</span>
    </div>
    <div class="top-nav"></div>
    <div class="top-user">
      <el-dropdown>
        <img :src="userDetails.userDetailsUrl" alt="" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid">
            <router-link to="/detail">个人中心</router-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-platform">
            <router-link to="/systemSettings">系统设置</router-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-close">
            <router-link to="/systemSettings">退出登录</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "hometop",
  props: ["userDetails"],
  data() {
    return {
      userImg: "",
    };
  },
  created() {
    // this.userDetail = JSON.parse(localStorage.getItem("user-information"));
    // this.imageUrl = this.userDetail.userDetailsUrl
  },
  watch: {
    // val 监听到的值
    "$store.state.userImgUrl"(val) {
      this.userDetails.userDetailsUrl = val;
    },
  },
};
</script>

<style lang="less">
#hometop {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid whitesmoke;

  .top-logo {
    width: 15%;
    height: 90%;
    display: flex;
    justify-content: start;
    align-items: center;

    span {
      color: #2a2e3a;
      font-size: 20px;
      margin-right: 10px;
    }

    img {
      width: 40px;
      height: 40px;
      margin-right: 15px;
      transform: rotate(43deg);
    }
  }

  .top-user {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
