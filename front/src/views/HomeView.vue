<script setup>
import router from "@/router/index.js";
import {reactive} from "vue";

if (!localStorage.getItem('token')) {
  clearInterval("getMessages")
  router.push('/login');
}

let userId = localStorage.getItem('userId');

/* Reference the users ID and Username in the store */
fetch('http://localhost:8000/users/', {
  method: "GET",
  headers: {
    "Content-Type": "application"
  }
})
.then(response => response.json())
.then(responseData => {
  let usernames = {};
  responseData.users.forEach(user => {
    usernames[user.id] = user.username;

    if (user.id === userId) {
      data.username = user.username;
    }
  });
  localStorage.setItem('userNames', usernames);
});

const data = reactive({
  userId: userId,
  username: localStorage.getItem('userNames')[userId],
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
