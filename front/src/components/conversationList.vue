<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import router from "@/router/index.js";

let conversations;
let data = reactive({
  conversations: [],
});
fetch('http://localhost:8000/conversations', {
  method: "GET",
  headers: {
    "Content-Type": "application",
    "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem('token'),
  },
})
    .then(response => {
      return response.json();
    }
    )
    .then(responseData => {
      if (responseData.message === "Invalid token") {
        router.push('/login');
      }
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      }
      conversations = responseData.conversations;
      selectConversation(conversations[0].id);
      store.commit('updateConversations', conversations);
    })
    .catch(error => {
      console.error('Error:', error);
    });

function selectConversation(conversationId) {
  store.commit('updateConversationId', conversationId);
  router.push('/dev');
}

store.watch(() => store.state.conversations, (newValue) => {
  data.conversations = newValue;
});
</script>

<template>
  <div>
    <h1>Conversations</h1>
    <div v-for="conversation in data.conversations" :key="conversation.id" class="selector">
      <div @click="selectConversation(conversation.id)" class="item">
        <span>{{ conversation.name }}</span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.selector {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  margin-top: 1em;
}

.item {
  display: flex;
  flex-direction: row;
  gap: 0.1em;
  padding: 0.5em;
  cursor: pointer;
}
</style>