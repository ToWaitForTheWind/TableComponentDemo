import { ACTION_SIGN_OUT, ACTION_SIGN_IN } from '../../action-types'
import { MUTATION_SIGN_IN, MUTATION_SIGN_OUT } from '../../mutation-types'

export default {
  [ACTION_SIGN_OUT] ({ commit, state }, payload) {
    commit(MUTATION_SIGN_OUT, false)
  },
  [ACTION_SIGN_IN] ({ commit, state }, payload) {
    commit(MUTATION_SIGN_IN, true)
  }
}
