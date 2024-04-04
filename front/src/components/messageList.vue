<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";

const data = reactive({
  messages: [],
});

function humanizeData(payload) {
  // For each message, add the username of the sender and the color of the sender
  payload.forEach(message => {
    if (message.senderId === "system") {
      message.senderUsername = "system";
    } else {
      message.senderUsername = store.state.users.find(user => user.id === message.senderId).username;
      message.senderColor = store.state.users.find(user => user.id === message.senderId).color;
      message.isNotified = message.content.message.match(/@(\w+)/g)?.includes("@" + localStorage.getItem("username"));
    }

    /* Add a value `isFollowing` to each message */
    /* This value is true if the message is sent by the same user as the previous one and if the time between the two messages is less than 5 minute */
    let lastMessage = data.messages[0];
    message.isFollowing = !!(lastMessage && lastMessage.senderId === message.senderId && new Date(message.date).getTime() - new Date(lastMessage.date).getTime() < 300000);

    /* Humanize the date */
    // If the message is sent today, only show the relative time
    if (new Date(message.date).toDateString() === new Date().toDateString()) {
      // If the message is sent today, only show the relative time (e.g. "Aujourd'hui à 14:30") without the seconds
      message.displayDate = "Aujourd'hui à " + new Date(message.date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).replace(':', 'h');
    } else {
      message.displayDate = "Le " + new Date(message.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) + " à " + new Date(message.date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }).replace(':', 'h');
    }

    data.messages.unshift(message);
  });
}

// When the current conversation changes, update the messages
store.watch(() => store.state.currentConversation, () => {
  data.messages = [];
  let messages = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages;
  humanizeData(messages);
});

// Every second, update the messages
setInterval(() => {
  let messages = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages;
  // Only add the new messages
  messages = messages.slice(data.messages.length);
  humanizeData(messages);
}, 1000);

</script>

<template>
  <div class="list">
    <span id="lastMessage"/>
    <Message v-for="message in data.messages" :key="message.id" :message="message"/>
  </div>
</template>

<style scoped>
.list {
  max-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}
</style>