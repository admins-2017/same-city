<template>
  <div id="homeleft">
    <div
      class="left-content"
      :style="isCollapse ? 'width:64px' : 'width:200px'"
    >
      <el-row class="tac">
        <!-- <el-menu
          default-active="1"
          mode="vertical "
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          background-color="#5d7599"
          text-color="#fff"
          menu-trigger="click"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
          router
        >
          <div v-for="menu in userMenu" :key="menu.name">
            <el-submenu :index="menu.menuId + ''" v-if="menu.type == 0">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title">{{ menu.name }}</span>
              </template>
              <el-menu-item-group v-if="menu.children.length != 0">
                <span slot="title">{{ menu.name }}</span>
                <el-menu-item
                  :index="child.path"
                  v-for="child in menu.children"
                  :key="child.name"
                >
                  <i :class="child.icon"></i>
                  <router-link
                    :to="'/' + child.path"
                    @click.native="doSomething(child.path, child.name)"
                    >{{ child.name }}</router-link
                  >
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
              v-if="menu.type == 1"
              :class="onItem"
              :index="menu.path"
              @click.native="doSomething(menu.path, menu.name)"
            >
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
          </div>
        </el-menu> -->
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
      </el-row>
      <!-- <el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
    </div>
    <div class="left-main">
      <!-- <tags></tags> -->
      <div class="router-view-area">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import tag from "./tag.vue";
export default {
  name: "homeleft",
  props: ["userMenu"],
  components: {
    tag,
  },
  data() {
    return {
      isCollapse: false,
      tags: [],
      isOk: true,
      onItem: "on-my-item",
      active: this.$route.path.split("/")[1] || "commoditys",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    doSomething(toUrl, name) {
      console.log(toUrl, name);
      this.tags = this.$store.state.homeTags;
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i].name == name) {
          this.isOk = false;
        }
      }
      if (this.isOk) {
        this.$store.commit("saveHomeTags", {
          name: "" + name,
          type: "",
          path: "/" + toUrl,
        });
        this.isOk = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#homeleft {
  height: 92%;
  display: flex;
  justify-content: space-between;

  .left-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #5d7599;
    transition: width 0.2s ease-in-out;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .left-main {
    height: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #eff2f4;
    .router-view-area {
      padding: 20px;
    }
  }
}
/deep/ {
  a {
    color: #fff;
  }
}
</style>
