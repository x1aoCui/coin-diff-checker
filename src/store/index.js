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
    async Delete_CoinValue(state, result) {
      let dictIndex = result;
      for (let i = 0; i < state.listNav.length; i++) {
        let items = state.listNav[i].item
        for(let j=0;j<items.length;j++){
          if(items[j].id==dictIndex){
            let index = items.indexOf(items[j])
            items.splice(index,1)
            //delete related coin pictures in db
            await axios.delete("http://localhost:3000/api/bucketListItems/dictIndex/"+dictIndex);
            //update listnav and just lazy use
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
      }
    },
    async Delete_CoinType(state, result) {
      let dictIndex = result;
      for (let i = 0; i < state.listNav.length; i++) {
        if(state.listNav[i].id==dictIndex){
          let listNav = state.listNav[i]
          let items = listNav.item
          //delete subDict one by one
          //call Delete_CoinValue to delete photos
          for(let j=0;j<items.length;j++){
            let subDictIndex = items[j].id;
            await axios.delete("http://localhost:3000/api/bucketListItems/dictIndex/"+subDictIndex);
          }
          // delete dict locally
          let index = state.listNav.indexOf(listNav)
          state.listNav.splice(index,1)
          //delete dict in db
          await axios.delete("http://localhost:3000/api/bucketListItems/listNav/"+dictIndex);

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
