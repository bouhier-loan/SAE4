<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";

const data = reactive({
  messages: [],
});

let messages = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages;

function humanizeData(data) {
  let response = []

  // For each message, add the username of the sender and the color of the sender
  data.forEach(message => {
    if (message.senderId === "system") {
      message.senderUsername = "system";
    } else {
      message.senderUsername = store.state.users.find(user => user.id === message.senderId).username;
      message.senderColor = store.state.users.find(user => user.id === message.senderId).color;
      message.isNotified = message.content.message.match(/@(\w+)/g)?.includes("@" + localStorage.getItem("username"));
    }

    /* Add a value `isFollowing` to each message */
    /* This value is true if the message is sent by the same user as the previous one and if the time between the two messages is less than 5 minute */
    let lastMessage = messages[messages.length - 1];
    message.isFollowing = !!(lastMessage && lastMessage.senderId === message.senderId && new Date(message.date).getTime() - new Date(lastMessage.date).getTime() < 300000);

    response.push(message);
  });
  return response
}

data.messages = humanizeData(messages);

// When the current conversation changes, update the messages
store.watch(() => store.state.currentConversation, () => {
  messages = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages;
  data.messages = humanizeData(messages);
});

// When the messages change, update the messages
store.watch(() => store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages, () => {
  messages = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation).messages;
  data.messages = humanizeData(messages);
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