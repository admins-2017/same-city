<template>
  <div class="head">
    <el-input
      placeholder="根据用户名过滤"
      prefix-icon="el-icon-search"
      v-model="config.requestUser"
      size="mini"
    ></el-input>
    <el-date-picker
      v-model="recordTime"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      size="mini"
    ></el-date-picker>
    <el-select
      v-model="config.requestType"
      clearable
      placeholder="请选择类型"
      size="mini"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-button type="primary" size="mini" @click="toQuery">查询</el-button>
  </div>
</template>
<script>
export default {
  props: ["config"],
  data() {
    return {
      options: [
        {
          value: "get",
          label: "查询请求",
        },
        {
          value: "post",
          label: "添加请求",
        },
        {
          value: "put",
          label: "修改请求",
        },
        {
          value: "delete",
          label: "删除请求",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    // 查询
    toQuery() {
      this.$parent.getRecordByCondition();
    },
  },
};
</script>
