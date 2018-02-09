const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER(state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER(state) {
    state.main++
  },
  CHANGE_DOWNNUM(state) {
    state
  }
}

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
