<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";

const messages = store.state.conversationMessages;

store.watch(() => store.state.conversationMessages, (newValue) => {
  /* Add a value `isFollowing` to each message */
  let firstMessage = true;
  for (let message of newValue) {
    if (firstMessage) {
      message.isFollowing = false;
      firstMessage = false;
    } else {
      let diffMs = new Date(message.date).getTime() - new Date(newValue[newValue.indexOf(message) - 1].date).getTime();
      let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
      message.isFollowing = message.senderId === newValue[newValue.indexOf(message) - 1].senderId && diffMins < 5;
    }
  }

  let wasEmpty = data.messages.length === 0;

  data.messages = newValue;

  /* Humanize the date */
  for (let message of data.messages) {
    // If the message is sent today, only show the relative time
    if (new Date(message.date).toDateString() === new Date().toDateString()) {
      // If the message is sent today, only show the relative time (e.g. "Aujourd'hui à 14:30") without the seconds
      message.date = "Aujourd'hui à " + new Date(message.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}).replace(':', 'h');
    } else {
      message.date = "Le " + new Date(message.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'}) + " à " + new Date(message.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}).replace(':', 'h');
    }
  }

  if (wasEmpty) {
    let lastMessage = document.querySelector('[id="lastMessage"]');
    if (lastMessage) {
      lastMessage.scrollIntoView({behavior: "smooth", block: "end"});
    }
  }
});

const data = reactive({
  messages: messages,
});
</script>

<template>
  <div class="list">
        <Message v-for="message in data.messages" :key="message.id" :message="message"/>
        <span id="lastMessage"/>
  </div>
</template>

<style scoped>
.list {
  max-height: 100vh;
  overflow-y: auto;
}
</style>