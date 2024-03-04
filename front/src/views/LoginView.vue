<script setup>
import {reactive} from "vue";

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
  }).then((data) => {
    console.log(data);
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
</template>

<style scoped>

</style>