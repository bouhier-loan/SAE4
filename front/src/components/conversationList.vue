<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import router from "@/router/index.js";
import Conversation from "@/components/conversation.vue";

let conversations = store.state.conversations;
let data = reactive({
  conversations: [],
});

function selectConversation(conversationId) {
  store.commit('updateCurrentConversation', conversationId);
  store.commit('updateFetchMessages', true);
  router.push('/');
}

store.watch(() => store.state.conversations, (newValue) => {
  newValue.sort((a, b) => {
    return a.lastUpdated < b.lastUpdated ? 1 : -1;
  });
  data.conversations = newValue;
});

store.watch(() => store.state.currentConversation, () => {
  data.conversations = store.state.conversations;
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