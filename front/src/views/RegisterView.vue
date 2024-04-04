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
  <div class="container">
    <form @submit.prevent="register" class="register-form">
      <img src="../../public/icons/logo.png" alt="Logo" class="register-logo" />

      <h1>Créer un compte</h1>

      <div class="input-group">
        <input type="text" v-model="data.username" placeholder="Nom d'utilisateur" />
        <img src="../../public/icons/user.svg" alt="User" class="input-icon" />
      </div>
      <div class="input-group">
        <input type="password" v-model="data.password" placeholder="Mot de passe" />
        <img src="../../public/icons/lock-closed.svg" alt="Lock" class="input-icon" />
      </div>

      <button type="submit" class="register-btn">S'inscrire</button>

      <div class="login">
        <router-link to="/login" class="login-link">Connexion</router-link>
      </div>
    </form>
  </div>
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

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: #263238;
  border-radius: 8px;
  text-align: center;
  margin: 0 auto 1rem;
}

.register-logo {
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

.register-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #26a69a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #1e8875;
}

.login-link {
  color: #80cbc4;
  text-decoration: none;
  display: block;
  margin-top: 1rem;
}

.login-link:hover {
  text-decoration: underline;
}

.login {
  text-align: center;
  margin-top: 1rem;
}

</style>
