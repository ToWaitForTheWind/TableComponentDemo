import { MUTATION_SIGN_IN, MUTATION_SIGN_OUT } from '../../mutation-types'

export default {
  [MUTATION_SIGN_IN] (state, payload) {
    state.isLogin = payload
  },
  [MUTATION_SIGN_OUT] (state, payload) {
    state.isLogin = payload
  }
}
