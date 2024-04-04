<script setup>
import Participant from "@/components/participant.vue";
import store from "@/store/store.js";
import {reactive} from "vue";
import AddParticipant from "@/components/addParticipant.vue";

let participants;
let data = reactive({
  participants: [],
  owner: null,
  userId: localStorage.getItem("userId"),
});
let conv = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation);

store.watch(() => store.state.currentConversation, (newValue) => {
  conv = store.state.conversations.find(conversation => conversation.id === newValue);
  if (conv) {
    let participantsIds = conv.participants;
    participants = store.state.users.filter(user => participantsIds.includes(user.id));
    data.participants = participants;
    data.owner = conv.ownerId;
  }
});

setInterval(() => {
  let conv = store.state.conversations.find(conversation => conversation.id === store.state.currentConversation);
  if (conv) {
    let participantsIds = conv.participants;
    participants = store.state.users.filter(user => participantsIds.includes(user.id));
    data.participants = participants;
    data.owner = conv.ownerId;
  }
}, 1000)

function copyToClipboard(payload) {
  navigator.clipboard.writeText(payload)
}
</script>

<template>
  <div class="component">
    <div class="title">
      <img alt="conversation icon" src="/icons/user-group.svg"/>
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
    <AddParticipant v-if="data.userId === data.owner"/>
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
  height: 100%;
}
</style>