<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import router from "@/router/index.js";
import Conversation from "@/components/conversation.vue";

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
      if (responseData.message === "Unauthorized") {
        localStorage.removeItem("token");
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
  router.push('/');
}

store.watch(() => store.state.conversations, (newValue) => {
  newValue.sort((a, b) => {
    return a.lastUpdated < b.lastUpdated ? 1 : -1;
  });
  data.conversations = newValue;
});
</script>

<template>
  <div class="component">
    <div class="title">
      <img src="/icons/annotation.svg" alt="conversation icon"/>
      <span>Conversations</span>
    </div>
    <div class="list">
      <Conversation @click="selectConversation(conversation.id)" v-for="conversation in data.conversations" :key="conversation.id" :conversation="conversation" :isSelected="conversation.id === store.state.currentConversation"/>
    </div>
  </div>

</template>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  background-color: var(--white-90);
  border-top-left-radius: 10px;
}

.title {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
    filter: invert(1);
  }

  span {
    font-size: 24px;
    color: var(--white-00);
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>