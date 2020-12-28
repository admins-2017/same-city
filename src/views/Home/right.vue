<template>
  <div id="hometop" class="right">
    <div class="top-user">
      <div class="title">
        <!-- <i
          :class="
            $parent.$refs.left.isCollapse
              ? 'el-icon-s-unfold'
              : 'el-icon-s-fold'
          "
          @click="handleCollapse"
        /> -->
        <i :class="'el-icon-' + $store.state.pageInfo.icon" />
        <h3>{{ $store.state.pageInfo.title }}</h3>
      </div>
      <!-- <el-dropdown> -->
      <!-- <img :src="userDetails.userDetailsUrl" alt="" /> -->
      <!-- <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user-solid">
            <router-link to="/detail">个人中心</router-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-platform">
            <router-link to="/systemSettings">系统设置</router-link>
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-close">
            <router-link to="/systemSettings">退出登录</router-link>
          </el-dropdown-item>
        </el-dropdown-menu> -->
      <!-- </el-dropdown> -->
    </div>
    <div class="left-main">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "right",
  // props: ["userDetails"],
  data() {
    return {
      userImg: "",
      rightWidth: this.$parent.$refs.left.isCollapse
        ? "width: calc(100% - 64px);"
        : "width: calc(100% - 200px);",
    };
  },
  created() {
    // this.userDetail = JSON.parse(localStorage.getItem("user-information"));
    // this.imageUrl = this.userDetail.userDetailsUrl
  },
  watch: {
    // val 监听到的值
    // "$store.state.userImgUrl"(val) {
    //   this.userDetails.userDetailsUrl = val;
    // },
  },
  methods: {
    handleCollapse() {
      // this.$parent.$refs.left.isCollapse = !this.$parent.$refs.left.isCollapse;
      // this.rightWidth = this.$parent.$refs.left.isCollapse
      //   ? "width: calc(100% - 64px);"
      //   : "width: calc(100% - 200px);";
    },
  },
};
</script>

<style lang="less">
#hometop {
  width: calc(100% - 200px);
  height: 100%;
  display: inline-block;
  @media screen and (max-width: 1200px) {
    width: calc(100% - 64px);
  }
  @media screen and (min-width: 1200px) {
    width: calc(100% - 200px);
  }

  .title {
    height: 100%;
    display: flex;
    align-items: center;
    color: #495054;
    i {
      color: #00bcd4;
      font-size: 20px;
      margin-right: 10px;
    }
  }

  .top-user {
    height: 60px;
    border-bottom: 1px solid whitesmoke;
    display: flex;
    align-items: center;
    padding: 0 20px;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .left-main {
    height: calc(100% - 60px);
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #ebeef5;
    > div {
      margin: 20px;
      padding: 20px;
      border-radius: 5px;
      background-color: #fff;
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
