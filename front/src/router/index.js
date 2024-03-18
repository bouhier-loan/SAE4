import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: '/', component: HomeView, name: 'home'},
    {path: '/login', component: LoginView, name: 'login'},
    {path: '/register', component: RegisterView, name: 'register'},
  ]
})

export default router
