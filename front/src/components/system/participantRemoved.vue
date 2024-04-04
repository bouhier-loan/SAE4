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
data.message.content.username = store.state.users.find(user => user.id === data.message.content.participantId).username;
</script>

<template>
<span class="system-message-participant-removed">
  <img src="/icons/arrow-left.svg" class="arrow-left" alt=""/>
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
  margin-bottom: 1em;
  padding: 0 3rem;

  .arrow-left {
    width: 1.5em;
    height: 1.5em;
    filter: invert(24%) sepia(98%) saturate(1654%) hue-rotate(339deg) brightness(93%) contrast(97%);
    margin-right: 0.5em
  }

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