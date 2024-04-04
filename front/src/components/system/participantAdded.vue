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

data.message.content.username = store.state.users.find(participant => participant.id === data.message.content.participantId).username;
</script>

<template>
<span class="system-message-participant-added">
  <img src="/icons/arrow-right.svg" class="arrow-right" alt=""/>
  <span class="user">@{{ message.content.username }}</span>
  <span class="text"> a été ajouté la conversation !</span>
</span>
</template>

<style scoped>
.system-message-participant-added {
  display: flex;
  align-items: center;
  gap: 0.1em;
  margin-top: 1em;
  margin-bottom: 1em;
  padding: 0 3rem;

  .arrow-right {
    width: 1.5em;
    height: 1.5em;
    filter: invert(54%) sepia(45%) saturate(492%) hue-rotate(94deg) brightness(89%) contrast(89%);
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