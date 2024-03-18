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
  nbRows: 1,
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
    document.querySelector(".messageBar textarea").value = "";
    data.message = "";
    data.nbRows = 1;
    this.parent.$refs.lastMessage.scrollIntoView({ behavior: 'smooth' });
  })
}

// Auto resize the textarea, the maximum number of rows is 5
function autoResize() {
  const textarea = document.querySelector(".messageBar textarea");
  const nbRows = textarea.value.split("\n").length;
  data.nbRows = nbRows > 5 ? 5 : nbRows;
}
</script>

<template>
  <form class="messageBar" @submit="sendMessage">
    <textarea v-model="data.message" placeholder="Envoyer un message" @keydown.enter.exact.prevent="sendMessage" @keydown.shift.enter.exact.prevent="data.message += '\n'; autoResize" :rows="data.nbRows" @keyup="autoResize"/>
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

  textarea {
    flex: 1;
    color: var(--white-00);
    background-color: var(--white-70);
    border: none;
    resize: none;
    overflow: hidden;
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