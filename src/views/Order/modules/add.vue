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
    <div class="area" v-loading="show.load">
      <el-form :model="form" :rules="rules.form" ref="addForm" inline>
        <!-- 基本信息 -->
        <div class="area-title">基本信息</div>
        <div class="area-child">
          <el-form-item label="销售单号">
            <el-input
              v-model="form.orderNumber"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户">
            <el-select v-model="form.clientId" placeholder="请选择">
              <el-option
                v-for="item in list.clients"
                :key="item.clientId"
                :label="item.clientName"
                :value="item.clientId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="商铺">
            <el-select v-model="form.shopId" placeholder="请选择">
              <el-option
                v-for="item in list.shops"
                :key="item.shopId"
                :label="item.shopName"
                :value="item.shopId"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="销售人员">
            <el-select v-model="form.userId" placeholder="请选择">
              <el-option
                v-for="item in list.users"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="form.orderDate"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
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
            <el-table-column label="商铺">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.shopId'"
                  :rules="rules.table.shopId"
                >
                  <el-select
                    v-model="scope.row.shopId"
                    placeholder="请选择商铺"
                  >
                    <el-option
                      v-for="item in list.shops"
                      :key="item.shopId"
                      :label="item.shopName"
                      :value="item.shopId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="商品">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.commodityId'"
                  :rules="rules.table.commodityId"
                >
                  <el-input
                    v-model="scope.row.commodityId"
                    placeholder="请选择商品"
                    readonly
                    @click.native="chooseCommodity(scope)"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.commodityId'"
                  :rules="rules.table.commodityId"
                >
                  <el-input
                    v-model="scope.row.commodityId"
                    placeholder="请输入数量"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'table.' + scope.$index + '.commodityId'"
                  :rules="rules.table.commodityId"
                >
                  <el-input
                    v-model="scope.row.commodityId"
                    placeholder="请输入价格"
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
          <el-form-item label="折扣率">
            <el-input
              v-model="form.orderDiscountRate"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="折后金额">
            <el-input
              v-model="form.orderAmountAfterDiscount"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="本单实付">
            <el-input
              v-model="form.orderActualPayment"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="本单未付">
            <el-input
              v-model="form.orderUnpaidAmount"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select
              v-model="form.orderSettlementMethod"
              placeholder="请选择"
            >
              <el-option
                v-for="item in list.methods"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算账户">
            <el-input
              v-model="form.orderSettlementAccount"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item />
          <el-form-item />
        </div>
        <!-- 其他信息 -->
        <div class="area-title">其他信息</div>
        <div class="area-child">
          <el-form-item label="备注" class="textarea">
            <el-input
              v-model="form.orderRemarks"
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
    <!-- 商品列表 -->
    <shop ref="shop" />
  </el-dialog>
</template>

<script>
import { initOrder } from "@/api/order"; // 新增销售订单-前置查询
import { transMethod, transState } from "@/utils"; // 字典转换
import { SETTLEMENT_METHOD_LIST } from "@/utils/constant.js"; // 支付方式列表
import shop from "./shop"; // 组件-新增
export default {
  components: {
    shop,
  },
  data() {
    return {
      show: {
        dialog: false,
        load: true,
      },
      list: {
        clients: [],
        shops: [],
        methods: SETTLEMENT_METHOD_LIST,
      },
      form: {
        orderNumber: "",
        clientId: "",
        shopId: "",
        userId: "",
        orderDiscountRate: "",
        orderAmountAfterDiscount: "",
        orderActualPayment: "",
        orderUnpaidAmount: "",
        orderSettlementMethod: "",
        orderSettlementAccount: "",
        orderRemarks: "",
        orderDate: "",
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
          shopId: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
          commodityId: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
          ],
        },
      },
    };
  },
  methods: {
    // 新增init
    init() {
      initOrder()
        .then((resp) => {
          console.log(resp);
          this.form.orderNumber = resp.orderNumber;
          this.list.clients = resp.clients;
          this.list.shops = resp.shops;
          this.list.users = resp.users;
          this.show.load = false;
        })
        .catch(() => {});
    },

    // 新增
    add() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log(this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 选择商品
    chooseCommodity(scope) {
      this.$refs.shop.getList(scope.row.shopId, scope.$index);
      this.$refs.shop.dialog = true;
    },

    // 添加行
    addTableColumn() {
      let obj = {
        shopId: "",
        commodityId: "",
      };
      this.form.table.push(obj);
    },

    // 删除行
    deleteTableColumn(index) {
      this.form.table.splice(index, 1);
    },

    // 取消
    calcel() {
      Object.assign(this.$data.form, this.$options.data().form); // 还原form数据
      this.$refs.addForm.clearValidate(); // 移除表单验证
      this.show.dialog = false;
    },

    transMethod, // 支付方式
    transState, // 订单状态
  },
};
</script>
