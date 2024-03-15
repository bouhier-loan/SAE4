<script setup>
import router from "@/router/index.js";
import {reactive} from "vue";
import store from "@/store/store.js";

if (!localStorage.getItem('token')) {
  clearInterval("getMessages")
  router.push('/login');
}

let userId = localStorage.getItem('userId');

const data = reactive({
  userId: userId,
  username: store.state.usernames[userId],
});
</script>

<template>
  <main>
    <h1>Home</h1>
    <h2>Welcome, {{ data.username }}</h2>
    <br>
    <router-link to="/dev">Dev View</router-link>
  </main>
</template>
