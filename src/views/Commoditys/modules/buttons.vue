<template>
  <div>
    <el-button
      class="success-text-btn"
      type="text"
      size="mini"
      :loading="load.upDown"
      v-if="com.commodityStatus != 0"
      @click="updateCommodityStatus(com.commodityId, 3, $event)"
      >上架
    </el-button>
    <el-button
      class="warning-text-btn"
      type="text"
      size="mini"
      :loading="load.upDown"
      v-if="com.commodityStatus != 1 && com.commodityStatus != 2"
      @click="updateCommodityStatus(com.commodityId, 1, $event)"
      >下架
    </el-button>
    <el-divider direction="vertical" />
    <el-button
      class="danger-text-btn"
      type="text"
      size="mini"
      :loading="load.delRec"
      v-if="com.commodityStatus != 2"
      @click="updateCommodityStatus(com.commodityId, 2, $event)"
      >删除
    </el-button>
    <el-button
      class="success-text-btn"
      type="text"
      size="mini"
      :loading="load.delRec"
      v-if="com.commodityStatus == 2"
      @click="updateCommodityStatus(com.commodityId, 4, $event)"
      >恢复
    </el-button>
    <el-divider direction="vertical" />
    <el-button type="text" size="mini" @click="toUpdate(com, $event)"
      >修改
    </el-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    com: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      load: {
        upDown: false,
        delRec: false,
      },
    };
  },
  methods: {
    // 修改商品状态
    updateCommodityStatus(val1, val2, e) {
      e.stopPropagation();
      if ([2, 4].includes(val2)) {
        this.load.delRec = true;
      } else {
        this.load.upDown = true;
      }
      axios({
        method: "put",
        url: "/api/commodity/" + val1 + "/" + val2,
      })
        .then((res) => {
          if (res.status) {
            this.$notify.success({
              title: "提示",
              message: res.data.data,
            });
            this.$parent.$parent.$parent.$parent.queryCommodity();
          }
          this.load.delRec = false;
          this.load.upDown = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load.delRec = false;
          this.load.upDown = false;
        });
    },

    // 修改
    toUpdate(val, e) {
      e.stopPropagation();
      const parent = this.$parent.$parent.$parent.$parent.$refs.form;
      parent.isAdd = false;
      parent.form = JSON.parse(JSON.stringify(val));
      parent.show.dialog = true;
    },
  },
};
</script>
