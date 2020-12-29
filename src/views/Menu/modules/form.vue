<template>
  <el-dialog title="新增角色" :visible.sync="show.dialog" width="30%">
    <div class="small-dialog">
      <el-select
        v-model="insertFrom.type"
        clearable
        placeholder="请选择权限类型"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-model="insertFrom.name"
        placeholder="权限名称"
        clearable
      ></el-input>
      <el-input
        v-model="insertFrom.path"
        placeholder="权限路径"
        clearable
        v-if="insertFrom.type == 1"
      ></el-input>
      <el-input
        v-model="insertFrom.permission"
        placeholder="权限标识"
        v-if="insertFrom.type != 0"
        clearable
      ></el-input>
      <el-input
        v-model="insertFrom.iCon"
        placeholder="权限图标"
        clearable
        v-if="insertFrom.type != 2"
      ></el-input>
      <el-select
        v-if="insertFrom.type != 0"
        v-model="insertFrom.parentId"
        clearable
        :placeholder="
          insertFrom.type == 1 ? '请选择上级目录' : '请选择上级菜单'
        "
      >
        <el-option
          v-for="item in fatherMenu"
          :key="item.menuId"
          :label="item.name"
          :value="item.menuId"
        ></el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="insertMenu">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addMenu } from "@/api/menus";
export default {
  data() {
    return {
      show: {
        dialog: false,
      },
      insertFrom: {
        name: "",
        path: "",
        permission: "",
        type: "",
        iCon: "",
        parentId: "",
      },
      options: [
        {
          value: "0",
          label: "目录",
        },
        {
          value: "1",
          label: "菜单",
        },
        {
          value: "2",
          label: "按钮",
        },
      ],
      fatherMenu: [],
    };
  },
  methods: {
    // 新增
    insertMenu() {
      addMenu(this.insertFrom)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: res.data,
              type: "success",
            });
            this.cancel();
            this.getAllMenu();
          } else {
            this.$message.error("删除失败 请重试！");
          }
        })
        .catch(() => {
          this.$message.error("服务器连接超时 请重试！");
        });
    },

    // 取消
    cancel() {
      this.show.dialog = false;
      Object.assign(this.$data.insertFrom, this.$options.data().insertFrom);
    },
  },
};
</script>
