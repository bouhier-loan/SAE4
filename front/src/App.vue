<script setup>
import {RouterView} from 'vue-router'
import store from "@/store/store.js";

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
      });
      store.commit("updateUsernames", usernames);
    });
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
