<script setup>
import router from "@/router/index.js";
import store from "@/store/store.js";
import MessageList from "@/components/messageList.vue";
import MessageBar from "@/components/messageBar.vue";
import ConversationList from "@/components/conversationList.vue";
import ParticipantsList from "@/components/participantsList.vue";
import ConversationCreate from "@/components/conversationCreate.vue";

if (!localStorage.getItem('token')) {
  router.push('/login');
}

async function getMessages() {
  let conversationId = store.state.currentConversation;

  if (!conversationId) {
    return;
  }

  if (!store.state.fetchMessages) {
    return;
  }

  // If the user is not logged in or not in the route /dev, stop the function
  if (!localStorage.getItem('token') || router.currentRoute.value.path !== "/") {
    store.commit('updateFetchMessages', false);
    return;
  }
  let messages = [];
  fetch('http://localhost:8000/conversations/' + conversationId + '/messages', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem('token'),
    },
  })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData)
        if (responseData.message === "Unauthorized") {
          localStorage.removeItem("token");
          router.push('/login');
        }
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
        if (!responseData.messages) {
          return;
        }
        responseData.messages.forEach(message => {
          message.senderUsername = store.state.users.find(user => user.id === message.senderId).username;
          message.senderColor = store.state.users.find(user => user.id === message.senderId).color;
          message.isNotified = message.content.message.match(/@(\w+)/g)?.includes("@" + localStorage.getItem("username"));

          messages.push(message);
        });
        store.commit('updateCache', messages);
      })
      .catch(error => {
        console.error('Error:', error);
        store.commit('updateFetchMessages', false);
      });
  store.commit('updateConversationId', conversationId);
}

/* Call getMessages() once and then every second in the background */
getMessages();
setInterval(getMessages, 1000);
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