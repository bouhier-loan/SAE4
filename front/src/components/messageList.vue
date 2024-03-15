<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";

const messages = store.state.conversationCache;

store.watch(() => store.state.conversationCache, (newValue) => {
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

  data.messages = newValue;

  /* Humanize the date */
  for (let message of data.messages) {
    // If the message is sent today, only show the relative time
    if (new Date(message.date).toDateString() === new Date().toDateString()) {
      message.date = "Aujourd'hui à " + new Date(message.date).toLocaleTimeString();
    } else {
      message.date = new Date(message.date).toLocaleString();
    }
  }
});

const data = reactive({
  messages: messages,
});

</script>

<template>
  <div>
    <h1>Messages</h1>
        <Message v-for="message in data.messages" :key="message.id" :message="message"/>
  </div>
</template>

<style scoped>

</style>