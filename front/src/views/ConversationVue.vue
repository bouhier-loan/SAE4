<script setup>
import router from "@/router/index.js";
import MessageList from "@/components/messageList.vue";
import MessageBar from "@/components/messageBar.vue";
import ConversationList from "@/components/conversationList.vue";
import ParticipantsList from "@/components/participantsList.vue";
import ConversationCreate from "@/components/conversationCreate.vue";

if (!localStorage.getItem('token')) {
  router.push('/login');
}
</script>

<template>
  <div class="app">
    <div class="left">
      <ConversationList/>
      <ConversationCreate/>
    </div>
    <hr>
    <div class="middle">
      <MessageList/>
      <br>
      <MessageBar/>
    </div>
    <hr>
    <ParticipantsList/>
  </div>
</template>

<style scoped>
.app {
  background-color: var(--white-80);
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  margin-top: 15px;
  border-top-left-radius: 10px;
}

hr {
  width: 2px;
  background-color: var(--success-60);
  border: none;
  margin: 0;
  padding: 0;
}

.middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: end;
  padding-bottom: 1rem;
}

.left {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  background-color: var(--white-90);
  border-top-left-radius: 10px;
}
</style>