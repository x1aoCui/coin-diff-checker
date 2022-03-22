import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import userProfile from "../views/UserProfile.vue";
import Admin from "../views/Admin";
import store from "@/store";
import {users} from '../assets/users'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: userProfile

  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta:{
      requireAdmin : true
    }

  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to,from,next)=>{

  const user = store.state.user;

  if(!user){
    await store.dispatch('setUser',users['users'][0])
  }
  const isAdmin = true;
  const requireAdmin = to.matched.some(record => record.meta.requireAdmin);

  if  (requireAdmin && !isAdmin) next({name:'Home'});
  else next();
})

export default router
