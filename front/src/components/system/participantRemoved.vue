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
console.log(data.message);
data.message.content.username = store.state.users.find(user => user.id === data.message.content.participantId).username;
</script>

<template>
<span class="system-message-participant-removed">
  <span class="user">@{{ data.message.content.username }}</span>
  <span class="text"> a quitté la conversation !</span>
</span>
</template>

<style scoped>
.system-message-participant-removed {
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