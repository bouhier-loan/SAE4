import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: '/', component: HomeView},
    {path: '/login', component: LoginView},
    {path: '/register', component: RegisterView}
  ]
})

export default router
