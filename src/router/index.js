import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/store";
import axios from "axios";


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async ()=>{

  const listNav = store.state.listNav;
  if(!listNav){
    const res = await axios.get("http://localhost:3000/api/bucketListItems/getlistnav",
        {})
    await store.dispatch('setListNav',res.data)
  }
})

export default router
