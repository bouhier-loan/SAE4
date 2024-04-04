<script setup>
import router from "@/router/index.js";
import ConversationVue from "@/views/ConversationVue.vue";
import axios from "axios";
import store from "@/store/store.js";

if (!localStorage.getItem('token')) {
  clearInterval("getMessages")
  router.push('/login');
}

let userId = localStorage.getItem('userId');
/* Fetch the server status */
let first_fetch = true

function fetchServerStatus() {
  axios.get('http://localhost:8000/status', {
    params: {fetch: !first_fetch},
    headers: {
      Authorization: `${localStorage.getItem('userId')} ${localStorage.getItem('token')}`
    }
  })
  .then(response => {
    if (first_fetch) {
      first_fetch = false
      console.log("Server is up and running")
      console.log(response.data)
    }

    if (response.status === 401) {
      clearInterval("getMessages")
      clearInterval("fetchServerStatus")
      router.push('/login');
    }

    // Users
    let users = response.data.users;
    if (users !== store.state.users) {
      store.commit("updateUsers", users);
    }

    // Conversations
    let conversations = response.data.conversations;
    store.commit("updateCurrentConversation", conversations[0].id)
    conversations.forEach(conversation => {
      store.commit("updateConversation", conversation);
    })
  })

  store.commit("updateView", true);
}

fetchServerStatus()
setInterval(fetchServerStatus, 1000)
</script>

<template>
<div class="home-vue">
  <div class="home">
    <div class="home-header">
      <div class="home-logo">
        <img src="/icons/logo.png" alt="logo">
        <span class="home-title">Harmony</span>
        <span class="home-subtitle">By Eros</span>
      </div>
      <div class="home-list">
        <div class="home-list-item">
          <img src="/icons/annotation.svg" alt="">
          Conversations
        </div>
        <div class="home-list-item">
          <img src="/icons/archive.svg" alt="">
          Projets
        </div>
      </div>
    </div>
  </div>
  <ConversationVue/>
</div>
</template>

<style scoped>
.home-vue {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background-color: var(--white-100);

  .home {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 15px 50px 15px;
    justify-content: space-between;

    .home-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;

      .home-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .home-title {
          color: var(--white-10);
          font-size: 24px;
          font-family: "Itim", cursive;
          font-weight: 400;
          font-style: normal;
          line-height: 26px;
        }

        .home-subtitle {
          color: var(--white-40);
          font-size: 16px;
          font-family: "Itim", cursive;
          font-weight: 400;
          font-style: normal;
        }

        img {
          width: 69px;
          height: 75px;
        }
      }

      .home-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .home-list-item {
          display: flex;
          flex-direction: row;
          align-items: start;
          margin-bottom: 20px;
          color: var(--white-10);
          width: 100%;
          font-size: 18px;
          font-weight: bold;
          gap: 10px;
          cursor: pointer;

          img {
            width: 30px;
            height: 30px;
            filter: invert(1);
          }
        }
      }
    }
  }
}
</style>

