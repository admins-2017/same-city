import { SETTLEMENT_METHOD, ORDER_STATE } from "@/utils/constant";
// 支付方式
export function transMethod(method) {
  return SETTLEMENT_METHOD[method];
}
// 订单状态
export function transState(state) {
  return ORDER_STATE[state];
}

// 导出文件
export function exportFile(resp, fileName = "文件") {
  const blob = new Blob([resp], {
    //取响应回来的数据
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  const downloadElement = document.createElement("a");
  downloadElement.href = href;
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}
