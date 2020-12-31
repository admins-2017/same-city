<template>
  <div class="client">
    <!-- 搜索 -->
    <client-head :params="params" />

    <!-- 列表 -->
    <el-table :data="clientData" v-loading="load" size="small">
      <el-table-column prop="clientId" label="ID" show-overflow-tooltip />
      <el-table-column prop="clientName" label="名称" show-overflow-tooltip />
      <el-table-column
        prop="clientAddress"
        show-overflow-tooltip
        label="联系地址"
      />
      <el-table-column
        prop="clientPhone"
        label="联系方式"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientEmail"
        label="联系邮箱"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientBirthday"
        label="客户生日"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientDesc"
        show-overflow-tooltip
        label="提供简介"
      />
      <el-table-column
        prop="clientGender"
        label="客户性别"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag class="boy" v-if="scope.row.clientGender">
            男
          </el-tag>
          <el-tag class="girl" v-else>女</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientStatus"
        label="客户状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.clientStatus">
            正常
          </el-tag>
          <el-tag type="danger" v-else>删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="toUpdate(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            type="text"
            size="small"
            class="danger-text-btn"
            v-if="scope.row.clientStatus"
            @click="toChange(scope.row.clientId, 0)"
            >删除
          </el-button>
          <el-button
            type="text"
            @click="toChange(scope.row.clientId, 1)"
            size="small"
            class="success-text-btn"
            v-else
            >恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :config="params" @change="queryClient" />

    <!-- 表单 -->
    <client-form ref="form" />
  </div>
</template>

<script>
import axios from "axios";
import { getClient, exportClient } from "@/api/client";
import pagination from "@/components/pagination"; // 组件-分页
import clientHead from "./modules/head";
import clientForm from "./modules/form";
import { exportFile } from "@/utils";
export default {
  name: "client",
  components: {
    pagination,
    clientHead,
    clientForm,
  },
  data() {
    return {
      params: {
        total: 0, // 总数
        page: 1, // 页数
        size: 10, // 条数
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        clientStatus: "",
      },
      clientData: [],
      load: false,
    };
  },
  created() {
    this.queryClient();
  },
  methods: {
    // 查询
    queryClient() {
      this.load = true;
      getClient(this.params)
        .then((res) => {
          this.clientData = res.data.records;
          this.params.total = res.data.total;
          this.load = false;
        })
        .catch(() => {
          this.load = false;
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 编辑
    toUpdate(row) {
      this.$refs.form.show.dialog = true;
      this.$refs.form.isAdd = false;
      this.$refs.form.form = JSON.parse(JSON.stringify(row));
    },

    // 改变客户状态
    toChange(val1, val2) {
      axios({
        method: "put",
        url: "/api/client/status/" + val1 + "/" + val2,
      })
        .then((res) => {
          if (res.data.status == 200) {
            this.$message({
              message: res.data.data,
              type: "success",
            });
            this.queryClient();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 导出
    exportFile() {
      exportClient(this.params)
        .then((resp) => {
          exportFile(resp, "客户");
        })
        .catch(() => {
          this.$message.error("导出失败，请稍后重试");
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
