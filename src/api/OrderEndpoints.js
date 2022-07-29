import { get, post } from './helpers/ApiRequestsHelper'

function getMyOrders () {
  return get('/users')
}

function createOrder (data) {
  return post('/orders')
}

export { getMyOrders, createOrder }
