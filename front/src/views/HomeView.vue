<script setup>
import router from "@/router/index.js";
import {ref} from "vue";
import store from "@/store/store.js";

if (!localStorage.getItem('token')) {
  clearInterval("getMessages")
  router.push('/login');
}

let userId = ref(localStorage.getItem('userId'));

/* Reference the users ID and Username in the store */
fetch('http://localhost:8000/users/', {
  method: "GET",
  headers: {
    "Content-Type": "application"
  }
})
.then(response => response.json())
.then(data => {
  let usernames = {};
  data.users.forEach(user => {
    usernames[user.id] = user.displayName;
  });
  store.commit('updateUsersNames', usernames);
});
</script>

<template>
  <main>
    <h1>Home</h1>
    <h2>Welcome, {{ userId }}</h2>
    <br>
    <router-link to="/dev">Dev View</router-link>
  </main>
</template>
