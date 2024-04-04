<script setup>
import {reactive, ref} from "vue";
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

const activeClass = ref('');
function activateButtonAnimation() {
  activeClass.value = 'button-animate';
  setTimeout(() => activeClass.value = '', 2000);
}

</script>

<template>
    <div class="container">
      <form @submit.prevent="login" class="login-form">
        <img src="../../public/icons/logo.png" alt="Logo" class="login-logo" />

        <h1>Connexion</h1>

        <div class="input-group">
          <input type="text" v-model="data.username" placeholder="Nom d'utilisateur" />
          <img src="../../public/icons/user.svg" alt="User" class="input-icon" />
        </div>

        <div class="input-group">
          <input type="password" v-model="data.password" placeholder="Mot de passe" />
          <img src="../../public/icons/lock-closed.svg" alt="Lock" class="input-icon" />
        </div>

        <button :class="[activeClass]" @click="activateButtonAnimation" type="submit" class="login-btn">Login</button>
        <div class="register">
        <router-link to="/register" class="register-link">Créer un compte</router-link>
      </div>
      </form>
    </div>

  <br>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../../public/fond.png');
  background-size: cover;
  background-position: center;
  filter: shadow(0.2);

}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #263238;
  border-radius: 8px;
  text-align: center;
}

.login-logo {
  width: 120px;
  margin: 0 auto 1rem;
}

.input-group {
  position: relative;
  margin: 0 auto 1rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.5rem;
  border-radius: 4px;
  border: none;
  background: #37474f;
  color: white;
}

.input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  filter: invert(1);
}

h1 {
  color: white;
  font-weight: bold;
  margin: 0 auto 2rem;
}

.login-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #149414;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #145000;
}

.register-link {
  color: #80cbc4;
  text-decoration: none;
  display: block;
  margin-top: 1rem;
}

.register-link:hover {
  text-decoration: underline;
}

.register {
  text-align: center;
  margin-top: 1rem;
}

.login-btn, {
  position: relative;
  overflow: hidden; /* Ensures the background only shows within the button bounds */
  transition: background-color 0.4s; /* Smooth transition for color change */
}

.button-animate {
  animation: sweep-color 0.5s ease forwards;
}

@keyframes sweep-color {
  0% {
    background-size: 0 100%;
    background-image: linear-gradient(to right, #1e8875, #26a69a);
  }
  100% {
    background-size: 100% 100%;
    background-image: linear-gradient(to right, #1e8875, #26a69a);
  }
}

</style>