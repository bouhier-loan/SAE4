<script setup>
import store from "@/store/store.js";
import {reactive} from "vue";
import Message from "@/components/message.vue";

const messages = store.state.conversationCache;
store.watch(() => store.state.conversationCache, (newValue) => {
  data.messages = newValue;
});

console.log(messages);
const data = reactive({
  messages: messages,
});


</script>

<template>
  <div>
    <h1>Messages</h1>
    <div v-for="message in data.messages" :key="message.id">
        <Message :message="message"/>
    </div>
  </div>
</template>

<style scoped>

</style>