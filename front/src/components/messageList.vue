<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";

const props = defineProps({
   conversationId: {
     type: String,
     required: true,
   },
});

const data = reactive({
  messages: [],
});


// Get the messages of the conversation from the server
fetch('http://localhost:8000/conversations/' + props.conversationId + '/messages', {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": store.state.userId + " " + store.state.token,
  },
})
.then(response => response.json())
.then(responseData => {
  console.log(responseData);
  if (!responseData.messages) {
    return;
  }
  responseData.messages.forEach(message => {
    data.messages.push(message);
  });
});

async function getMessages() {
  fetch('http://localhost:8000/conversations/' + props.conversationId + '/messages', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": store.state.userId + " " + store.state.token,
    },
  })
  .then(response => response.json())
  .then(responseData => {
    console.log(responseData);
    if (!responseData.messages) {
      return;
    }
    data.messages = [];
    responseData.messages.forEach(message => {
      data.messages.push(message);
    });
  });
}
</script>

<template>
  <div>
    <h1>Messages</h1>
    <ul>
      <li v-for="message in data.messages" :key="message.id">
        {{ message.content.message }}
      </li>
    </ul>
  </div>

  <button @click="getMessages">Refresh</button>
</template>

<style scoped>

</style>