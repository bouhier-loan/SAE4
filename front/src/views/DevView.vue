<script setup>
import router from "@/router/index.js";
import store from "@/store/store.js";
import MessageList from "@/components/messageList.vue";
import MessageBar from "@/components/messageBar.vue";

if (!store.state.token) {
  router.push('/login');
}

</script>

<template>
  <div>
    <h1>Dev View</h1>
    <MessageList conversationId="cb64615c-d280-4546-8f6e-6e3971d574cc"/>
    <br>
    <MessageBar conversationId="cb64615c-d280-4546-8f6e-6e3971d574cc"/>
  </div>
</template>

<style scoped>

</style>