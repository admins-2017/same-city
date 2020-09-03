<template>
  <div id="interfaces">
    <!-- 卡片 -->
    <el-card class="box-card">
      <OBJECT
        style="border: 0px"
        type="text/x-scriptlet"
        data="http://localhost:8082/swagger-ui.html"
        width="100%"
        height="490px"
      ></OBJECT>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "interfaces",
  data() {
    return {
      html: "",
    };
  },
  methods: {
    getSwagger() {
      axios({
        method: "get",
        url: "/api/swagger-ui.html/",
        headers: {
          Authorization: this.userDetails.token,
        },
      })
        .then((res) => {
          console.log(res);
          this.html = res.data;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },
  },
  created() {
    this.userDetails = JSON.parse(localStorage.getItem("user-information"));
    // this.getSwagger();
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
#interfaces{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	>div:nth-of-type(1){
		width: 94%;
	}
}
</style>
