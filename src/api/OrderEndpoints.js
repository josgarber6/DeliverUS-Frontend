import { get, post } from './helpers/ApiRequestsHelper'

function getMyOrders () {
  return get('orders')
}

function getOrderDetail (id) {
  return get(`orders/${id}`)
}

function createOrder (data) {
  return post('/orders')
}

export { getMyOrders, getOrderDetail, createOrder }
