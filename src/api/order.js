import request from '@/utils/request'

export function getOrderList(page, count) {
  return request({
    url: `api/order/1/${page}/${count}/`,
    method: 'get'
  })
}