<template>
  <el-dialog
    title="采购单详情"
    :visible.sync="dialog"
    width="80%"
    append-to-body
  >
    <template slot="title"> <i class="el-icon-tickets" />采购单详情 </template>
    <div class="area">
      <el-form inline>
        <!-- 基本信息 -->
        <div class="area-title">基本信息</div>
        <div class="area-child">
          <el-form-item label="采购单号">
            <span>{{ info.orderNumber }}</span>
          </el-form-item>
          <el-form-item label="日期">
            <span>{{ info.orderDate }}</span>
          </el-form-item>
          <el-form-item label="客户名称">
            <span>{{ info.clientName }}</span>
          </el-form-item>
          <el-form-item label="订单总金额">
            <span>{{ info.orderTotalAmount }}</span>
          </el-form-item>
        </div>
        <!-- 支付信息 -->
        <div class="area-title">支付信息</div>
        <div class="area-child">
          <el-form-item label="折扣率">
            <span>{{ info.orderDiscountRate }}</span>
          </el-form-item>
          <el-form-item label="折后金额">
            <span>{{ info.orderAmountAfterDiscount }}</span>
          </el-form-item>
          <el-form-item label="实付款">
            <span>{{ info.orderActualPayment }}</span>
          </el-form-item>
          <el-form-item label="未付款">
            <span>{{ info.orderUnpaidAmount }}</span>
          </el-form-item>
          <el-form-item label="支付方式">
            <span>{{ transMethod(info.orderSettlementMethod) }}</span>
          </el-form-item>
          <el-form-item
            label="付款账号"
            v-if="info.orderSettlementMethod !== 1"
          >
            <span>{{ info.orderSettlementAccount }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span>{{ transState(info.orderStatus) }}</span>
          </el-form-item>
          <el-form-item label="销售人员">
            <span>{{ info.operatorUser }}</span>
          </el-form-item>
          <el-form-item v-if="info.orderSettlementMethod === 1" />
        </div>
        <!-- 商品详情 -->
        <div class="area-title">订单详情</div>
        <div class="area-child">
          <el-table :data="info.children" empty-text="-" border>
            <el-table-column label="#" type="index" />
            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.commodityName }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="编号">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.commodityNumber }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="规格">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.commodityUnit }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="出库店铺">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.shopName }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.unitPrice }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.orderDetailNumber }}</el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="总价">
              <template slot-scope="scope">
                <el-form-item>{{ scope.row.orderDetailPrice }}</el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 操作信息 -->
        <div class="area-title">操作信息</div>
        <div class="area-child">
          <el-form-item label="订单添加时间">
            <span>{{ info.orderInsertTime }}</span>
          </el-form-item>
          <el-form-item label="订单添加人员">
            <span>{{ info.insertUsername }}</span>
          </el-form-item>
          <el-form-item />
          <el-form-item />
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialog = false">关 闭</el-button>
      <el-button type="primary" @click="dialog = false">导 出</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { transMethod, transState } from "@/utils";
export default {
  data() {
    return {
      info: {},
      dialog: false,
    };
  },
  methods: {
    transMethod, // 支付方式
    transState, // 订单状态
  },
};
</script>
