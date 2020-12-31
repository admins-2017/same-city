<template>
  <el-form label-position="top" class="row-form">
    <el-form-item>
      <img :src="com.commodityPicture" />
    </el-form-item>
    <el-form-item label="商品名称">
      <span>{{ com.commodityName }}</span>
    </el-form-item>
    <el-form-item label="商品编号">
      <span>{{ com.commodityNumber }}</span>
    </el-form-item>
    <el-form-item label="商品单位">
      <span>{{ com.commodityUnit }}</span>
    </el-form-item>
    <el-form-item label="商品分类">
      <span>{{ com.classificationName }}</span>
    </el-form-item>
    <el-form-item label="建议售价">
      <span>{{ com.commoditySellingPrice }} / 元</span>
    </el-form-item>
    <el-form-item label="状态">
      <span v-if="com.commodityStatus == 0">上架</span>
      <span v-if="com.commodityStatus == 1">下架</span>
      <span v-if="com.commodityStatus == 2">删除</span>
    </el-form-item>
    <el-form-item label="商品介绍">
      <span>{{ com.commodityDescription }}</span>
    </el-form-item>
    <el-form-item label="添加人员">
      <span>{{ com.insertUsername }}</span>
    </el-form-item>
    <el-form-item label="修改人员">
      <span>{{ com.updateUsername }}</span>
    </el-form-item>
    <el-form-item label="添加时间">
      <span>{{ com.insertTime }}</span>
    </el-form-item>
    <el-form-item label="最近修改时间">
      <span>{{ com.updateTime }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    com: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  width: 55px;
}
</style>
