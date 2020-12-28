<template>
  <div class="users-left">
    <el-input
      placeholder="根据商铺名查询"
      prefix-icon="el-icon-search"
      size="small"
      v-model="input"
      @change="findShop"
      clearable
    ></el-input>
    <el-tree
      :props="shops"
      :data="allShop"
      @node-click="handleCheckChange"
      v-loading="load"
    ></el-tree>
  </div>
</template>
<script>
import { getShop, getAllShop } from "@/api/shop";
export default {
  data() {
    return {
      input: "",
      shops: {
        label: "shopName",
        id: "shopId",
      },
      allShop: [],
      load: false,
    };
  },
  created() {
    this.getAllShop();
  },
  methods: {
    // 查询所有商铺
    getAllShop() {
      this.load = true;
      getAllShop()
        .then((resp) => {
          this.allShop = resp.data;
          this.$parent.$refs.editRef.allShop = resp.data;
          this.$parent.$refs.addRef.allShop = resp.data;
          this.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },

    // 查询商铺
    findShop() {
      this.load = true;
      getShop(this.input)
        .then((resp) => {
          if (resp.status == 200) {
            this.allShop = resp.data;
          } else {
            this.$message.error("查询超时 请重试！");
          }
          this.load = false;

          if (this.input == "") {
            this.$parent.getUserList();
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },

    // 点击店铺查询用户
    handleCheckChange(data) {
      this.$emit("click", data);
    },
  },
};
</script>
<style lang="scss" scoped>
.users-left {
  margin: 20px 5px 20px 20px;
  padding: 20px;
  background: #fff;
  width: 15%;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 3px;
  vertical-align: top;
  position: relative;
  > .el-input {
    margin-bottom: 20px;
  }

  // &:before,
  // &:after {
  //   content: "";
  //   width: 30px;
  //   height: 30px;
  //   background: url(../../../assets/img/link.png);
  //   background-size: 100%;
  //   position: absolute;
  //   border-radius: 3px;
  // }
  // &:before {
  //   right: -20.5px;
  //   top: 30px;
  // }
  // &:after {
  //   right: -20.5px;
  //   bottom: 30px;
  // }
}
</style>
