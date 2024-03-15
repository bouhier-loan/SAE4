<script setup>
import router from "@/router/index.js";
import store from "@/store/store.js";
import MessageList from "@/components/messageList.vue";
import MessageBar from "@/components/messageBar.vue";
import ConversationList from "@/components/conversationList.vue";

if (!localStorage.getItem('token')) {
  router.push('/login');
}



async function getMessages() {
  let conversationId = store.state.currentConversation;

  if (!conversationId) {
    return;
  }

  // If the user is not logged in or not in the route /dev, stop the function
  if (!localStorage.getItem('token') || router.currentRoute.value.path !== "/dev") {
    clearInterval(getMessages)
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
        if (responseData.message === "Invalid token") {
          router.push('/login');
        }
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
        if (!responseData.messages) {
          return;
        }
        responseData.messages.forEach(message => {
          message.senderUsername = store.state.usernames[message.senderId];
          messages.push(message);
        });
        store.commit('updateCache', messages);
      })
      .catch(error => {
        console.error('Error:', error);
        clearInterval(getMessages)
      });
  store.commit('updateConversationId', conversationId);
}

/* Call getMessages() once and then every 5 seconds in the background */
getMessages();
setInterval(getMessages, 1000);
</script>

<template>
  <div class="app">
    <ConversationList></ConversationList>
    <hr>
    <div class="right">
      <MessageList/>
      <br>
      <MessageBar/>
    </div>
  </div>
</template>

<style scoped>
.app {
  background-color: var(--white-80);
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
}

hr {
  width: 1px;
  background-color: var(--success-60);
  border: none;
  margin: 0;
  padding: 0;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
</style>