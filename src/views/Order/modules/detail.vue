<template>
  <el-dialog
    title="销售单详情"
    :visible.sync="show.dialog"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <div class="area">
      <el-form inline>
        <!-- 基本信息 -->
        <div class="area-title">基本信息</div>
        <div class="area-child">
          <el-form-item label="销售单号" prop="name">
            <span>{{ info.orderNumber }}</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="show.dialog = false"
        >关 闭</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      show: {
        dialog: false,
      },
    };
  },
};
</script>

