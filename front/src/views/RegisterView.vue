<script setup>
import {reactive} from "vue";

const data = reactive({
  username: "",
  password: "",
});

async function register() {
  console.log(JSON.stringify(data));
  fetch('http://127.0.0.1/users/register', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((data) => {
    console.log(data);
  });
}
</script>

<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input type="text" v-model="data.username" />
      <input type="password" v-model="data.password" />
      <button type="submit">Register</button>
    </form>
  </div>
  <br>
  <h2>Already have an account? <router-link to="/login">Login</router-link></h2>
</template>

<style scoped>

</style>