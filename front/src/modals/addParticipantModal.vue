<script setup>
import store from "@/store/store.js";
import {ref} from "vue";
import BaseModal from "@/modals/baseModal.vue";

const props = defineProps({
  users: Array,
});

let listUsers = ref(props.users);
let search = ref("");

function close() {
  store.commit("showAddParticipantModal", false);
}

function searchBar() {
  listUsers.value = props.users.filter(user => user.username.toLowerCase().includes(search.value.toLowerCase()));
}

function addParticipant(user) {
  fetch(`http://localhost:8000/conversations/${store.state.currentConversation}/participants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      participantId: user.id,
    }),
  })

  /* Close the modal */
  store.commit("showAddParticipantModal", false);
}

</script>

<template>
  <BaseModal>
    <template #title>Ajouter un participant à la conversation</template>

    <template #body class="addParticipantModal-body">
      <input v-model="search" placeholder="Rechercher un participant" type="text" @keyup="searchBar" class="addParticipantModal-input"/>
      <div class="addParticipantModal-body-list">
        <div v-for="user in listUsers" :key="user.id" class="addParticipantModal-body-list-item"
             @click="addParticipant(user)">
          <div :style="{ backgroundColor: '#' + user.color }" class="color"></div>
          <div class="user">
            <span class="display-name">{{ user.displayName }}</span>
            <span class="username">@{{ user.username }}</span>
          </div>
        </div>
      </div>
      <div v-if="listUsers.length === 0" class="Error">
        Aucun utilisateur trouvé !
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.addParticipantModal-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--white-10);
  border-radius: 5px;
  font-size: 16px;
  color: var(--white-100);
}
.addParticipantModal-body-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .addParticipantModal-body-list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    background-color: var(--white-10);
    cursor: pointer;

    .color {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid var(--white-100);
    }

    .user {
      display: flex;
      flex-direction: row;
      align-items: end;
      justify-content: space-between;
      width: 100%;

      .display-name {
        font-size: 16px;
        color: var(--white-100);
      }

      .username {
        font-size: 14px;
        color: var(--white-60);
      }
    }

    &:hover {
      background-color: var(--white-40);
    }
  }
}

.Error {
  font-size: 16px;
  color: var(--error-20);
}
</style>