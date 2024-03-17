<script setup>
import {reactive} from "vue";
import store from "@/store/store.js";
import router from "@/router/index.js";

// The conversation ID
let conversationId = store.state.currentConversation;
store.watch(() => store.state.currentConversation, (newValue) => {
  conversationId = newValue;
});

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
      "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      conversationId: conversationId,
      content: {
        message: data.message,
      }})
  })
  .then(response => response.json())
  .then(data => {
    if (!data.token) {
      console.log("Invalid token");
      localStorage.setItem("token", null);
      router.push('/login');
    }
    localStorage.setItem("token", data.token);

    // Clear the input
    document.querySelector(".messageBar input").value = "";
    this.$refs.lastMessage.scrollIntoView({ behavior: 'smooth' });
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
  background-color: var(--white-70);
  border-radius: 0.5rem;
  width: 80%;
  align-self: center;

  input {
    flex: 1;
    color: var(--white-00);
    background-color: var(--white-70);
    border: none;
    resize: none;
    height: 2rem;
    font: var(--18-sb);

    &::placeholder {
      color: var(--white-00);
    }

    &:focus {
      outline: none;
    }
  }
  
  button {
    background-color: var(--white-70);
    border: none;
    cursor: pointer;
    justify-content: center;
    display: flex;
    img {
      width: 1.75rem;
      height: 1.75rem;
      fill: var(--white-100);
    }
  }
}
</style>