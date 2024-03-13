<script setup>
import {reactive} from "vue";
import store from "@/store/store.js";
import router from "@/router/index.js";

// The parameters the component needs
const props = defineProps({conversationId: {type: String, required: true,}})

// The input data
const data = reactive({
  message: "",
});

// Send a message in the conversation
async function sendMessage() {
  if (data.message === "") {
    return;
  }

  fetch('http://127.0.0.1:8000/messages', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: store.state.userId,
      token: store.state.token,
      conversationId: props.conversationId,
      content: {
        message: data.message,
      }})
  })
  .then(response => response.json())
  .then(data => {
    if (!data.token) {
      store.commit("setToken", null);
      router.push('/login');
    }
    store.commit("setToken", data.token);

    // Clear the input
    document.querySelector(".messageBar input").value = "";
  })
}
</script>

<template>
  <form class="messageBar" @submit="sendMessage">
    <input type="text" v-model="data.message" placeholder="Envoyer un message"/>
    <button type="submit"><img src="/icons/arrow-circle-right.svg" alt="send"></button>
  </form>
</template>

<style scoped>
.messageBar {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: var(--Neutral-60);
  border-radius: 0.5rem;
  input {
    flex: 1;
    color: var(--Neutral-White);
    background-color: var(--Neutral-60);
    border: none;

    &::placeholder {
      color: var(--Neutral-White);
    }

    &:focus {
      outline: none;
    }
  }
  
  button {
    background-color: var(--Neutral-60);
    border: none;
    cursor: pointer;
    justify-content: center;
    display: flex;
    img {
      width: 2rem;
      height: 2rem;
      fill: var(--Neutral-White);
    }
  }
}
</style>