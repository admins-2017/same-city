<template>
  <el-dialog
    title="新增采购单"
    width="80%"
    ref="dialogRef"
    :visible.sync="show.dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <template slot="title"> <i class="el-icon-plus" />新增采购单 </template>
    <div class="area" v-loading="show.load">
      <el-form :model="form" :rules="rules.form" ref="addForm" inline>
        <!-- 订单类型 -->
        <div class="area-title">订单类型</div>
        <div class="area-child">
          <el-form-item label="订单类型" class="long">
            <el-radio-group v-model="form.orderStatus" size="small">
              <el-radio
                v-for="item in list.type"
                :key="item.key"
                :label="item.key"
                border
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 基本信息 -->
        <div class="area-title">基本信息</div>
        <div class="area-child">
          <el-form-item label="销售单号" prop="orderNumber">
            <el-input
              v-model="form.orderNumber"
              placeholder="请输入销售单号"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="客户" prop="clientId">
            <el-select v-model="form.clientId" placeholder="请选择客户">
              <el-option
                v-for="item in list.clients"
                :key="item.clientId"
                :label="item.clientName"
                :value="item.clientId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售人员" prop="orderOperatorUser">
            <el-select
              v-model="form.orderOperatorUser"
              placeholder="请选择销售人员"
            >
              <el-option
                v-for="item in list.users"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间" prop="orderDate">
            <el-date-picker
              v-model="form.orderDate"
              type="datetime"
              placeholder="请选择下单时间"
              value-format="yyyy-MM-dd HH:mm:ss"
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
          <el-table :data="form.details" empty-text="-" border>
            <el-table-column label="#" type="index" />
            <el-table-column label="商铺">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'details.' + scope.$index + '.shopId'"
                  :rules="rules.details.shopId"
                >
                  <el-select
                    v-model="scope.row.shopId"
                    placeholder="请选择商铺"
                    @change="changeShop(scope.$index)"
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
                  :prop="'details.' + scope.$index + '.commodityName'"
                  :rules="rules.details.commodityName"
                >
                  <el-input
                    v-model="scope.row.commodityName"
                    :placeholder="
                      scope.row.shopId === '' ? '请先选择商铺' : '请选择商品'
                    "
                    suffix-icon="el-icon-arrow-down"
                    readonly
                    @focus="chooseCommodity(scope)"
                    :disabled="scope.row.shopId === ''"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'details.' + scope.$index + '.orderDetailNumber'"
                  :rules="rules.details.orderDetailNumber"
                >
                  <el-input
                    v-model.number="scope.row.orderDetailNumber"
                    placeholder="请输入数量"
                    @change="calcTotalAmt"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'details.' + scope.$index + '.orderDetailPrice'"
                  :rules="rules.details.orderDetailPrice"
                >
                  <el-input
                    v-model="scope.row.orderDetailPrice"
                    placeholder="请输入价格"
                    type="number"
                    min="0.00"
                    @change="calcTotalAmt"
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
                  @click="form.details.splice(scope.$index, 1)"
                  v-if="scope.$index !== 0"
                  >移除</el-button
                >
                <i class="el-icon-tickets" v-else />
              </template>
            </el-table-column>
          </el-table>
          <div>
            <i class="el-icon-money" />金额总计：{{ form.orderTotalAmount }} 元
          </div>
        </div>
        <!-- 支付信息 -->
        <div class="area-title">支付信息</div>
        <div class="area-child">
          <el-form-item label="折扣率" prop="orderDiscountRate">
            <el-input
              v-model="form.orderDiscountRate"
              placeholder="请输入折扣率"
              type="number"
              min="0.00"
            ></el-input>
          </el-form-item>
          <el-form-item label="折后金额">
            <span>{{ form.orderAmountAfterDiscount }}</span>
          </el-form-item>
          <el-form-item label="本单实付" prop="orderActualPayment">
            <el-input
              v-model="form.orderActualPayment"
              placeholder="请输入本单实付"
              type="number"
              min="0.00"
            ></el-input>
          </el-form-item>
          <el-form-item label="本单未付" prop="orderUnpaidAmount">
            <span>{{ form.orderUnpaidAmount }}</span>
          </el-form-item>
          <el-form-item label="支付方式" prop="orderSettlementMethod">
            <el-select
              v-model="form.orderSettlementMethod"
              placeholder="请选择支付方式"
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
          <!-- 支付方式为 1-现金 时不显示结算账号 -->
          <el-form-item
            label="结算账户"
            prop="orderSettlementAccount"
            v-if="[2, 3, 4, 5].includes(form.orderSettlementMethod)"
          >
            <el-input
              v-model="form.orderSettlementAccount"
              placeholder="请选择结算账户"
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
      <el-button type="primary" @click="add" :loading="show.load"
        >确 定</el-button
      >
    </span>
    <!-- 商品列表 -->
    <shop ref="shop" />
  </el-dialog>
</template>

<script>
import { initOrder, addOrder } from "@/api/order"; // 新增采购订单-初始化订单
import { transMethod, transState } from "@/utils"; // 字典转换
import { SETTLEMENT_METHOD_LIST, ORDER_STATE_LIST } from "@/utils/constant.js"; // 支付方式列表
import { detailsRule, formRule } from "@/rule/order.js"; // 验证规则
import shop from "./shop"; // 组件-新增
export default {
  components: {
    shop,
  },
  data() {
    return {
      show: {
        dialog: false,
        load: false,
      },
      list: {
        clients: [],
        shops: [],
        methods: SETTLEMENT_METHOD_LIST,
        type: ORDER_STATE_LIST,
      },
      form: {
        orderNumber: "", // 采购单号
        clientId: "", // 客户
        orderOperatorUser: "", // 销售人员
        orderDate: "", // 下单时间
        orderDiscountRate: "", // 折扣率
        orderAmountAfterDiscount: "-", // 折后金额
        orderActualPayment: "", // 本单实付
        orderUnpaidAmount: "-", // 本单未付
        orderSettlementMethod: "", // 支付方式
        orderSettlementAccount: "", // 结算账户
        orderRemarks: "", // 备注
        details: [
          {
            shopId: "",
            commodityId: "",
            commodityName: "",
            orderDetailNumber: "",
            orderDetailPrice: "",
          },
        ], // 明细
        orderTotalAmount: 0, // 合计金额
        orderStatus: 1, // 销售单状态(1 销售 2 退货 3 作废 )
      },
      rules: {
        form: formRule,
        details: detailsRule,
      },
    };
  },
  methods: {
    // 初始化订单
    init() {
      initOrder()
        .then((resp) => {
          this.form.orderNumber = resp.orderNumber;
          this.list.clients = resp.clients;
          this.list.shops = resp.shops;
          this.list.users = resp.users;
          this.show.dialog = true;
          this.$parent.load.add = false;
        })
        .catch(() => {
          this.$parent.load.add = false;
          this.show.dialog = true;
          this.$message.error("初始化订单失败，请稍后重试");
        });
    },

    // 新增
    add() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.show.load = true;
          addOrder(this.form)
            .then((resp) => {
              console.log(resp);
              this.show.load = false;
              this.$notify.success({
                title: "新增成功",
              });
              this.calcel();
              this.$parent.getList(1);
            })
            .catch(() => {
              this.show.load = false;
              this.$notify.error({
                title: "新增失败",
                message: "请稍后重试",
              });
              this.calcel();
            });
        } else {
          this.$nextTick(() => {
            document
              .getElementsByClassName("el-dialog__wrapper")
              .item(1).scrollTop =
              document
                .getElementsByClassName("is-error")
                .item(0)
                .getBoundingClientRect().top - 100;
          });
          return false;
        }
      });
    },

    // 选择商品
    chooseCommodity(scope) {
      if (this.$refs.shop.shopId !== scope.row.shopId) {
        this.$refs.shop.getList(scope.row.shopId, scope.$index);
      }
      this.$refs.shop.dialog = true;
    },

    // 改变商铺清空已选商品
    changeShop(i) {
      console.log(this.form.details[i]);
      this.form.details[i].commodityName = "";
      this.form.details[i].commodityId = "";
      this.form.details[i].orderDetailNumber = "";
      this.form.details[i].orderDetailPrice = "";
    },

    // 计算总金额
    calcTotalAmt() {
      this.form.orderTotalAmount = 0;
      this.form.details.forEach((d) => {
        this.form.orderTotalAmount += d.orderDetailNumber * d.orderDetailPrice;
      });
    },

    // 添加行
    addTableColumn() {
      let obj = {
        shopId: "",
        commodityId: "",
        commodityName: "",
        orderDetailNumber: "",
        orderDetailPrice: "",
      };
      this.form.details.push(obj);
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
  watch: {
    "form.details"() {
      this.calcTotalAmt();
    },
    "form.orderDiscountRate"(val) {
      this.form.orderAmountAfterDiscount = this.form.orderTotalAmount * val;
    },
    "form.orderActualPayment"(val) {
      this.form.orderUnpaidAmount = this.form.orderAmountAfterDiscount - val;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  border-radius: 5px;
  + div {
    width: 100%;
    font-size: 12px;
    padding-top: 10px;
    text-align: right;
    i {
      margin-right: 5px;
    }
  }
}
.long {
  width: unset !important;
}
.el-radio {
  margin-right: 10px;
}
</style>
