<template>
  <div id="homeleft">
    <div class="left-content">
      <el-row class="tac">
        <el-menu
          default-active="1"
          :collapse="!isCollapse"
          :style="!isCollapse?'width:64px':'width:150px'"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
		  router
        >
          <div v-for="(menu) in userMenu" :key="menu.name">
            <el-submenu :index="menu.menuId+''" v-if="menu.type==0">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title" v-if="isCollapse">{{menu.name}}</span>
              </template>
              <el-menu-item-group v-if="menu.children.length!=0">
                <span slot="title" v-if="!isCollapse">{{menu.name}}</span>
                <el-menu-item
                  :index="child.path"
                  v-for="(child) in menu.children"
                  :key="child.name"
                >
                  <i :class="child.icon"></i>
                  <router-link
                    :to="'/'+child.path"
                    @click.native="doSomething(child.path,child.name)"
                  >{{child.name}}</router-link>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-if="menu.type==1" :class="onItem" :index="menu.path" @click.native="doSomething(menu.path,menu.name)">
              <i :class="menu.icon"></i>
              <span slot="title">{{menu.name}}</span>
              </span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-row>
      <el-switch v-model="isCollapse" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </div>
    <div class="left-main">
      <tags></tags>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import tags from "../components/HomeTag.vue";
export default {
  name: "homeleft",
  props: ["userMenu"],
  components: {
    tags,
  },
  data() {
    return {
      isCollapse: false,
      tags: [],
      isOk: true,
      onItem: "on-my-item",
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

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
}

#homeleft {
  height: 100%;
  display: flex;
  justify-content: space-between;

  .left-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #bbe6d6;

    > .el-row {
      > .el-menu {
		border: 0px !important;
        > div {
          > .el-submenu {
			  background-color: #bbe6d6 !important;
            .el-menu-item-group__title {
              padding: 0px !important;
            }

            .el-submenu__icon-arrow {
              display: none;
            }

            .el-menu-item {
              padding-left: 40px !important;
			  background-color: #bbe6d6 !important;
              // text-align: center;
            }
          }
		  > .el-menu-item{
			  background-color: #bbe6d6 !important;
		  }
        }
      }
    }

    > .el-switch {
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .left-main {
    height: 100%;
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: whitesmoke;
  }
}
</style>
