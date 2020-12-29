<template>
  <div class="records">
    <pageHead ref="header" :config="config" />
    <el-table :data="tableData" v-loading="load" size="small">
      <el-table-column prop="description" label="操作描述" />
      <el-table-column
        prop="requestUser"
        label="操作人员"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column prop="requestType" label="请求方式" width="100">
        <template slot-scope="scope">
          <el-tag size="medium" :type="transType[scope.row.requestType]">{{
            scope.row.requestType
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="请求详情" width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>访问方法: {{ scope.row.requestMethod }}</p>
            <p>访问路径: {{ scope.row.requestUrl }}</p>
            <div slot="reference" class="name-wrapper">
              <el-button size="mini" type="text">{{
                scope.row.requestIp
              }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="requestTime"
        label="操作日期"
        align="right"
        width="160"
        show-overflow-tooltip
      />
    </el-table>
    <!-- 分页 -->
    <pagination :config="config" @change="getRecordByPage" />
  </div>
</template>

<script>
import { COUNT, REQ_TYPE } from "@/utils/constant"; // 查询条数 / 请求方式
import { getRecords } from "@/api/records"; // 接口-查询操作记录
import pageHead from "./modules/header"; // 组件-头部搜索
import pagination from "@/components/pagination"; // 组件-分页
export default {
  name: "records",
  components: {
    pagination,
    pageHead,
  },
  data() {
    return {
      config: {
        total: 0, // 总数
        page: 1, // 页数
        size: COUNT, // 条数
        requestUser: "",
        requestType: "",
        startTime: "",
        endTime: "",
      },
      transType: REQ_TYPE,
      tableData: [],
      load: false,
    };
  },
  mounted() {
    // 查询操作记录
    this.getRecordByPage();
  },
  methods: {
    // 查询操作记录
    getRecordByPage() {
      this.load = true;
      const arr = this.$refs.header.recordTime;
      if (arr && arr.length > 0) {
        this.config.startTime = arr[0];
        this.config.endTime = arr[1];
      }
      getRecords(this.config)
        .then((res) => {
          this.config.total = res.data.total;
          this.tableData = res.data.records;
          this.load = false;
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
          this.load = false;
        });
    },
  },
};
</script>
