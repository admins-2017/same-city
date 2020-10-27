import request from '@/utils/request'

export function getOrderList() {
  return request({
    url: 'api/order/1/1/10/',
    method: 'get'
  })
}
   
