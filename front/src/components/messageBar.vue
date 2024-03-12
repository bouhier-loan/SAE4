<script setup>
import {reactive} from "vue";
import store from "@/store/store.js";

// The parameters the component needs
const conversationId = defineProps({conversationId: String})

// The input data
const data = reactive({
  message: "",
});

// Send a message in the conversation
async function sendMessage() {
  fetch('http://127.0.0.1:8000/messages', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: store.state.userId,
      token: store.state.token,
      conversationId: conversationId,
      content: {
        message: data.message,
      }})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
}
</script>

<template>
  <form class="messageBar" @submit="sendMessage">
    <input type="text" v-model="data.message" />
    <button type="submit">Send</button>
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
  }
}
</style>