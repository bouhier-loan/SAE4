<script setup>
import {defineProps, reactive} from 'vue'
import store from '@/store/store.js'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});
const data = reactive({
  message: props.message,
  username: store.state.usersNames[props.message.senderId],
});
</script>

<template>
  <div class="message">
    <p>{{ data.username }}</p>
    <p>{{ data.message.content.message }}</p>
  </div>
</template>

<style scoped>

</style>