<template>
  <el-card shadow="never">
    <div slot="header" class="card-head">
      <el-input
        placeholder="输入关键字进行过滤"
        size="small"
        v-model="filterText"
      />
    </div>
    <el-tree
      :data="classificationData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="tree"
      highlight-current
    />
  </el-card>
</template>

<script>
import { getClassification } from "@/api/categorys";
export default {
  data() {
    return {
      filterText: "",
      classificationData: [],
      defaultProps: {
        children: "children",
        label: "classificationName",
      },
    };
  },
  mounted() {
    // 查询分类
    this.queryClassification();
  },
  methods: {
    // 查询分类
    queryClassification() {
      getClassification()
        .then((res) => {
          this.classificationData = res.data;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.classificationName.indexOf(value) !== -1;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
