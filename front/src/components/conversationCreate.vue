<script setup>
import CreateConversationModal from "@/modals/createConversationModal.vue";
import {ref} from "vue";
import store from "@/store/store.js";

let showCreateConversationModal = ref(false);

const open = () => {
  store.commit('showCreateConversationModal', true);
  showCreateConversationModal.value = true;
};

const close = () => {
  store.commit('showCreateConversationModal', false);
  showCreateConversationModal.value = false;
};

store.watch(() => store.state.showCreateConversationModal, (newValue) => {
  showCreateConversationModal.value = newValue;
});

let users = ref([]);

store.watch(() => store.state.users, (newValue) => {
  /* Remove the current user from the list */
  newValue = newValue.filter((user) => user.id !== localStorage.getItem("userId"));
  users.value = newValue;
});

</script>

<template>
  <div class="conversationCreate-button" @click="open">
    <span class="conversationCreate-span">+ Nouvelle conversation</span>
  </div>

  <div v-if="showCreateConversationModal" class="modal-overlay" @click.self="close">
    <CreateConversationModal :users="users" class="conversationCreate-modal"/>
  </div>
</template>

<style scoped>
.conversationCreate-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: var(--white-40);
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem;

  &:hover {
    background-color: var(--white-50);
  }
}

.conversationCreate-span {
  color: var(--white-100);
}

.conversationCreate-modal {
  max-height: 80%;
  overflow-y: auto;
}

</style>