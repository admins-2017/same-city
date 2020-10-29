<template>
  <el-dialog
    title="新增销售单"
    :visible.sync="show.dialog"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <template slot="title"> <i class="el-icon-plus" />新增销售单 </template>
    <div class="area">
      <el-form :model="form" :rules="rules.form" ref="addForm" inline>
        <!-- 基本信息 -->
        <div class="area-title">基本信息</div>
        <div class="area-child">
          <el-form-item label="销售单号" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <!-- 明细信息 -->
        <div class="area-title">明细信息</div>
        <div class="area-child">
          <el-button icon="el-icon-plus" @click="addTableColumn" size="mini"
            >添加商品</el-button
          >
          <el-table :data="form.table" empty-text="-" border>
            <el-table-column label="#" type="index" />
            <el-table-column label="name">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.name'"
                  :rules="rules.table.name"
                >
                  <el-input
                    v-model="scope.row.name"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="date">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.date'"
                  :rules="rules.table.date"
                >
                  <el-input
                    v-model="scope.row.date"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="number">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.number'"
                  :rules="rules.table.number"
                >
                  <el-input
                    v-model="scope.row.number"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteTableColumn(scope.$index)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 支付信息 -->
        <div class="area-title">支付信息</div>
        <div class="area-child">
          <el-form-item label="折后应付" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="折扣率" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="本单实付" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="结算账户" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <!-- 其他信息 -->
        <div class="area-title">其他信息</div>
        <div class="area-child">
          <el-form-item label="备注" class="textarea">
            <el-input
              v-model="form.name"
              type="textarea"
              :rows="2"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="calcel">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: {
        dialog: false,
      },
      form: {
        orderNumber: "",
        name: "",
        table: [],
      },
      rules: {
        form: {
          name: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
        },
        table: {
          number: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
          name: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
          date: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
        },
      },
    };
  },
  methods: {
    // 添加行
    addTableColumn() {
      let obj = {
        name: "",
        number: "",
        date: "",
      };
      this.form.table.push(obj);
    },

    // 删除行
    deleteTableColumn(index) {
      this.form.table.splice(index, 1);
    },

    // 新增
    add() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消
    calcel() {
      Object.assign(this.$data.form, this.$options.data().form); // 还原form数据
      this.$refs.addForm.clearValidate(); // 移除表单验证
      this.show.dialog = false;
    },
  },
};
</script>

