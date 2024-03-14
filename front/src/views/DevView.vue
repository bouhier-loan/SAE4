<script setup>
import router from "@/router/index.js";
import store from "@/store/store.js";
import MessageList from "@/components/messageList.vue";
import MessageBar from "@/components/messageBar.vue";

if (!localStorage.getItem('token')) {
  router.push('/login');
}

const conversationId = "cb64615c-d280-4546-8f6e-6e3971d574cc";

async function getMessages() {
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
          messages.push(message);
        });
        store.commit('updateCache', messages);
      });
  store.commit('updateConversationId', conversationId);
}

/* Call getMessages() once and then every 5 seconds in the background */
getMessages();
setInterval(getMessages, 1000);
</script>

<template>
  <div>
    <h1>Dev View</h1>
    <MessageList/>
    <br>
    <MessageBar/>
  </div>
</template>

<style scoped>

</style>