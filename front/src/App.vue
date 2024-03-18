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
      let users = responseData.users;
      store.commit("updateUsers", users);
    });
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
