<script setup>
import {defineProps, reactive} from 'vue'

const props = defineProps({
  message: {
    type: {
      senderId: String,
      conversationId: String,
      content: {
        message: String,
      },
      modified: Boolean,
      createdAt: Date
    },
    required: true,
  },
});
console.log(localStorage.getItem('userNames'));
const data = reactive({
  message: props.message,
  username: localStorage.getItem('userNames')[props.message.senderId]
});
</script>

<template>
  <div class="message">
    <p style="font-weight: bold">{{ data.username }}</p>
    <p>{{ data.message.content.message }}</p>
  </div>
</template>

<style scoped>

</style>