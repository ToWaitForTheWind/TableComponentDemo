import axios from '@/plugins/axios'

export const getUserList = queryParams => {
  return axios.get('http://csra.adl.io/range-user/api/admin/user/list', queryParams)
}
