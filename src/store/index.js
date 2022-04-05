import { createStore } from 'vuex'
import axios from "axios";

export default createStore({
  state: {
    listNav:null
  },

  getters: {
  },
  //effect the state
  mutations: {
    SET_ListNav(state, listNavItems) {
      state.listNav = listNavItems;
    },
    async ADD_CoinValue(state, result) {
      let coinIdIndex = result.coinIdIndex;
      for (let i = 0; i < state.listNav.length; i++) {
        if (state.listNav[i].id == coinIdIndex) {
          state.listNav[i].item.push({
                id: result.id,
                name: result.name
              })
          console.log(state.listNav[i])
          //update json in mongodb
          await axios.post( 'http://localhost:3000/api/bucketListItems/uploadlistnav',
              state.listNav[i],
          ).then(function(){
            console.log('SUCCESS!!in state');

          })
              .catch(function(){
                console.log('FAILURE!!');
              });
        }
      }

    },
    async ADD_CoinType(state, result) {

      for (let i = 0; i < state.listNav.length; i++) {
        //check duplicate name
        if (state.listNav[i].name == result.name)  return false
      }
      let finalResult = {
        id: result.id,
        name: result.name,
        item:[]
      }
      state.listNav.push(finalResult)
      //update in mongodb
      await axios.post( 'http://localhost:3000/api/bucketListItems/addlistnav', finalResult,
      ).then(function(){
        console.log('SUCCESS!!');
      })
          .catch(function(){
            console.log('FAILURE!!');
          });
    }
  },
  //call from application
  actions: {
    setListNav({commit},listNavItems) {
      commit('SET_ListNav',listNavItems);
    }
  },

  modules: {

  }
})
