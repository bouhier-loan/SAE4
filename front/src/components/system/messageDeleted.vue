<script setup>
import {defineProps, reactive} from 'vue'
import store from "@/store/store.js";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  }
});


const data = reactive({
  message: props.message
});

data.message.content.username = store.state.participants.find(participant => participant.id === data.message.content.senderId).username;
</script>

<template>
<span class="system-message-deleted">
  <span class="user">@{{ message.content.username }}</span>
  <span class="text"> - Message supprimé !</span>
</span>
</template>

<style scoped>
.system-message-deleted {
  display: flex;
  align-items: center;
  gap: 0.1em;
  margin-top: 1em;
  padding: 0 3rem;

  .user {
    font-weight: bold;
    color: var(--white-30);
    margin: 0;
  }

  .text {
    color: var(--white-40);
    margin: 0;
  }
}

</style>