<script setup>
import Participant from "@/components/participant.vue";
import store from "@/store/store.js";
import {reactive} from "vue";

let participants;
let data = reactive({
  participants: [],
  owner: null,
  userId: localStorage.getItem("userId"),
});

store.watch(() => store.state.currentConversation, (newValue) => {
  store.state.conversations.forEach(conversation => {
    if (conversation.id === newValue) {
      let participantsIds = conversation.participants;
      participants = store.state.users.filter(user => participantsIds.includes(user.id));
      data.participants = participants;
      data.owner = conversation.ownerId;
    }
  })
});

store.state.conversations.forEach(conversation => {
  if (conversation.id === store.state.currentConversation) {
    let participantsIds = conversation.participants;
    participants = store.state.users.filter(user => participantsIds.includes(user.id));
    data.participants = participants;
    data.owner = conversation.ownerId;
  }
})

function copyToClipboard(payload) {
  navigator.clipboard.writeText(payload)
}
</script>

<template>
  <div class="component">
    <div class="title">
      <img src="/icons/users.svg" alt="conversation icon"/>
      <span>Participants</span>
    </div>
    <div class="list">
      <Participant v-for="participant in data.participants"
                   :key="participant.id"
                   :user="participant"
                   :participant-is-owner="participant.id === data.owner"
                   :user-is-owner="data.userId === data.owner"
                   @click="copyToClipboard('@' + participant.username)"
      />
    </div>
  </div>

</template>

<style scoped>
.component {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  background-color: var(--white-90);
}

.title {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
    filter: invert(1);
  }

  span {
    font-size: 24px;
    color: var(--white-00);
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>