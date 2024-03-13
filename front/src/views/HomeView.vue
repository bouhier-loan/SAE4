<script setup>
import MessageBar from "@/components/messageBar.vue";
import store from "@/store/store.js";
import router from "@/router/index.js";

if (!store.state.token) {
  router.push("/login")
}
</script>

<template>
  <main>
    <h1>Home</h1>
    <h2>Welcome, {{ store.state.userId }}</h2>
    <br>
    <MessageBar conversationId="cb64615c-d280-4546-8f6e-6e3971d574cc"></MessageBar>
  </main>
</template>
