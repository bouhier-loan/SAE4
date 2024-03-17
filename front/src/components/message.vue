<script setup>
import {defineProps, reactive} from 'vue'

const props = defineProps({
  message: {
    type: {
      senderId: String,
      senderUsername: String,
      conversationId: String,
      content: {
        message: String,
      },
      modified: Boolean,
      createdAt: Date,
      isFollowing: Boolean,
    },
    required: true,
  }
});
console.log(localStorage.getItem('userNames'));
const data = reactive({
  message: props.message,
});
</script>

<template>
  <div class="message" :class="{isFollowing: data.message.isFollowing}">
    <div v-if="!data.message.isFollowing" class="header">
      <span class="user">{{ data.message.senderUsername }}</span>
      <span class="date">{{ data.message.date.toString() }}</span>
    </div>

    <div class="content">
      <span class="text" v-html="data.message.content.message.replace(/\n/g, '<br>')"></span>
      <span v-if="data.message.modified" class="modified">(modified)</span>
    </div>
  </div>
</template>

<style scoped>
.message:hover {
  background-color: var(--white-90);
}

.message.isFollowing {
  margin-top: 0;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  margin-top: 1em;
  padding: 0 3rem;

  .header {
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: 0.5em;

    .user {
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      color: var(--white-00);
    }

    .date {
      font-size: 0.7rem;
      color: var(--white-50);
      margin: 0;
    }
  }

  .content {
    display: flex;
    flex-direction: initial;
    align-items: end;
    gap: 0.2rem;

    .text {
      font-weight: normal;
      font-size: 16px;
      color: var(--white-40);
      margin: 0;
    }

    .modified {
      font-size: 0.7rem;
      color: var(--white-70);
      margin: 0;
    }
  }
}
</style>