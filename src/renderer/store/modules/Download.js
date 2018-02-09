const state = {
    newDownNum: 0
}

const mutations = {
    DECREMENT_DOWNLOAD_COUNTER(state) {
        state.newDownNum--
    },
    INCREMENT_DOWNLOAD_COUNTER(state) {
        state.newDownNum++
    },
    NUMCLEAR(state){
        state.newDownNum = 0;
    }
}

const actions = {
    clearLoadNum({ commit }) {
        commit('NUMCLEAR')
    },
    addLoadNum({commit}){
        commit('INCREMENT_DOWNLOAD_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}
