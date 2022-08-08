import { put } from './helpers/ApiRequestsHelper'

function getUserAddress () {
  return put('users/address')
}

export { getUserAddress }
