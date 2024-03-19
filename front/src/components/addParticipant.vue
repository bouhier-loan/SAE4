<script setup>
import AddParticipantModal from "@/components/addParticipantModal.vue";
import {ref} from "vue";
import store from "@/store/store.js";


let showAddParticipantModal = ref(false);
let users = ref([])

const open = () => {
  const conversation = store.state.conversations.find((conversation) => conversation.id === store.state.currentConversation);
  users.value = store.state.users.filter((user) => !conversation.participants.includes(user.id));
  showAddParticipantModal.value = true;
  store.commit("showAddParticipantModal", true);
};

const close = () => {
  showAddParticipantModal.value = false;
  store.commit("showAddParticipantModal", false);
};

store.watch(
    (state) => state.showAddParticipantModal,
    (value) => {
      showAddParticipantModal.value = value;
    }
);
</script>

<template>
  <div class="addParticipant" @click="open">
    <img alt="add participant icon" src="/icons/user-add.svg"/>
    <span>Ajouter un participant</span>
  </div>
  <div v-if="showAddParticipantModal" class="addParticipantModal-overlay" @click.self="close">
    <AddParticipantModal :users="users"/>
  </div>
</template>

<style scoped>
.addParticipant {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    filter: invert(1);
  }

  span {
    width: 100%;
    font-size: 16px;
    color: var(--white-00);
    cursor: pointer;
  }
}

.addParticipantModal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 26, 42, 0.4);
}
</style>