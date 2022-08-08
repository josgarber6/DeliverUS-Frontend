import { get, post } from './helpers/ApiRequestsHelper'

function getMyOrders () {
  return get('orders')
}

function getOrderDetail (id) {
  return get(`orders/${id}`)
}

function create (data) {
  return post('orders', data)
}

export { getMyOrders, getOrderDetail, create }
