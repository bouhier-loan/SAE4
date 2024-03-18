<script setup>
import {reactive} from "vue";
import router from "@/router/index.js";

const data = reactive({
  username: "",
  password: "",
});

async function login() {
  console.log(JSON.stringify(data));
  fetch('http://127.0.0.1:8000/users/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
      .then(response => {return response.json()})
      .then(dataResponse => {
        // If the login is successful, save the token in the local storage
        if (dataResponse.token) {
          // Save the token in the local storage
          localStorage.setItem("token", dataResponse.token);
          localStorage.setItem("userId", dataResponse.userId);
          localStorage.setItem("username", data.username);

          // Redirect to the home page
          router.push("/");
        } else {
          // If the login is not successful, show an error message
          alert("Invalid credentials");
        }
    });
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="text" v-model="data.username" />
      <input type="password" v-model="data.password" />
      <button type="submit">Login</button>
    </form>
  </div>
  <br>
  <h2>Don't have an account? <router-link to="/register">Register</router-link></h2>
</template>

<style scoped>

</style>