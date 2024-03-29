<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";
import router from "@/router/index.js";

const messages = [];
let currentConversation = store.state.currentConversation;
const data = reactive({
  messages: messages,
});
/*
 * 0 - Disabled
 * 1 - Waiting for next fetch
 * 2 - Scroll to bottom
 */
let scrollState = 0

async function getMessages() {
  let conversationId = store.state.currentConversation;
  let messages = [];
  let firstMessage = data.messages.length === 0;

  if (!conversationId || !store.state.fetchMessages) {
    return;

  }
  if (conversationId !== currentConversation) {
    data.messages = [];
    currentConversation = conversationId;
    console.log("Conversation changed")
  }

  // If the user is not logged in or not in the route /dev, stop the function
  if (!localStorage.getItem('token') || router.currentRoute.value.path !== "/") {
    store.commit('updateFetchMessages', false);
    return;
  }

  let url_end = !firstMessage ? "/fetch" : "";
  fetch('http://localhost:8000/conversations/' + conversationId + '/messages' + url_end, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem('token'),
    }
  })
      .then(response => response.json())
      .then(responseData => {
        //console.log(responseData)
        if (responseData.message === "Unauthorized") {
          localStorage.removeItem("token");
          router.push('/login');
        }
        if (!responseData.messages) {
          return;
        }
        responseData.messages.forEach(message => {

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

          messages.push(message);
        });

        /* Humanize the date */
        messages.forEach(message => {
          // If the message is sent today, only show the relative time
          if (new Date(message.date).toDateString() === new Date().toDateString()) {
            // If the message is sent today, only show the relative time (e.g. "Aujourd'hui à 14:30") without the seconds
            message.date = "Aujourd'hui à " + new Date(message.date).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }).replace(':', 'h');
          } else {
            message.date = "Le " + new Date(message.date).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) + " à " + new Date(message.date).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }).replace(':', 'h');
          }
        });

        if (firstMessage) {
          data.messages = messages;
          scrollState = 1;
          console.log("First message")
        } else {
          data.messages = data.messages.concat(messages);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        store.commit('updateFetchMessages', false);
      });
  store.commit('updateConversationId', conversationId);

  if (scrollState === 2) {
    let lastMessage = document.getElementById("lastMessage");
    lastMessage.scrollIntoView(
        {
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        }
    );
    scrollState = 0;
  } else if (scrollState === 1) {
    scrollState = 2;
  }
}

/* Call getMessages() once and then every second in the background */
getMessages();
setInterval(getMessages, 1000);
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