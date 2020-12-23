import axios from '@/plugins/axios'

export const getUserList = queryParams => {
  return axios.get('https://vc.hotjar.io/sessions/1120304', queryParams)
}
