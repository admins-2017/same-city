<template>
  <div id="home">
    <left ref="left" :userMenu="userMenu" />
    <right />
  </div>
</template>

<script>
import axios from "axios";
import left from "./left.vue";
import right from "./right.vue";
export default {
  name: "home",
  data() {
    return {
      testVuex: {},
      userMenu: [],
    };
  },
  components: {
    left,
    right,
  },
  methods: {
    getMenu() {
      this.$refs.left.load = true;
      axios({
        method: "get",
        url: "/api/menu/basisTree",
        headers: {
          Authorization: this.testVuex.token,
        },
      })
        .then((res) => {
          if (res.data.status) {
            this.userMenu = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
          this.$refs.left.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.$refs.left.load = false;
        });
    },
  },
  mounted() {
    this.testVuex = JSON.parse(localStorage.getItem("user-information"));
    this.getMenu();
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  a {
    text-decoration: none;
    // color: #fff;
  }
}

#home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;

  // > #hometop {
  //   height: 8%;
  // }

  // > #homeleft {
  //   flex: 1;
  // }
}
</style>
