<template>
  <div class="left" :style="isCollapse ? 'width:64px' : 'width:200px'">
    <div class="left-content">
      <div class="top-logo">
        <img src="../../assets/img/logo5.jpg" />
        <span v-show="!isCollapse">巨蜥云</span>
      </div>
      <el-row class="tac">
        <el-menu
          :default-active="active"
          class="el-menu-vertical-demo"
          background-color="#5d7599"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
        >
          <el-submenu
            v-for="menu in userMenu"
            :key="menu.name"
            :index="menu.name"
          >
            <template slot="title">
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.name }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.name"
              :index="child.path"
              >{{ child.name }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
        <!-- <el-menu
          default-active="/dashboard"
          class="el-menu-vertical-demo"
          background-color="#5d7599"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-s-home" />
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-tools" />
              <span slot="title">系统设置</span>
            </template>
            <el-menu-item index="/orders">系统设置1</el-menu-item>
            <el-menu-item index="/users">系统设置2</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-marketing" />
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item index="2-4-1">报表</el-menu-item>
            <el-menu-item index="3-4-2">数据</el-menu-item>
          </el-submenu>
        </el-menu> -->
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "left",
  props: ["userMenu"],
  data() {
    return {
      isCollapse: document.body.clientWidth < 1200,
      active: this.$route.path.split("/")[1] || "commoditys",
    };
  },
  mounted() {
    console.log(this.isCollapse);
    window.addEventListener("resize", () => {
      if (document.body.clientWidth < 1200) {
        this.isCollapse = true;
      } else {
        this.isCollapse = false;
      }
    });
  },
  destroyed() {
    window.removeEventListener("resize", arguments.callee);
  },
};
</script>

<style lang="scss" scoped>
.left {
  width: 200px;
  height: 100%;
  display: inline-block;
  transition: width 0.2s ease-in-out;

  @media screen and (max-width: 1200px) {
    width: 64px !important;
  }
  @media screen and (min-width: 1200px) {
    width: 200px !important;
  }

  .left-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #5d7599;
    transition: width 0.2s ease-in-out;
    &::-webkit-scrollbar {
      display: none;
    }
    .top-logo {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        color: #fff;
        font-size: 20px;
        margin-left: 10px;
      }

      img {
        width: 30px;
        height: 30px;
        // transform: rotate(43deg);
        border-radius: 50%;
        transition: transform 0.2s ease-in-out;
      }
    }
  }
}
/deep/ {
  a {
    color: #fff;
  }
}
</style>
