import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null
  },

  getters: {


  },
  //effect the state
  mutations: {
    SET_USER(state,user){
      state.user = user;
    }
  }
  ,
  //call from application
  actions: {
    setUser({commit},user) {
      commit('SET_USER',user);
    }
  },

  modules: {

  }
})
