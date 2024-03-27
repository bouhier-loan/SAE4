<script setup>
import BaseModal from "@/modals/baseModal.vue";
import {ref} from "vue";
import store from "@/store/store.js";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

let name = ref("");
let users = ref(props.users);
let search = ref("");
let error = ref("");

let addedUsers = ref([]);

function searchUser() {
  users.value = props.users.filter((user) => user.username.toLowerCase().includes(search.value.toLowerCase()));
}

function userClicked(user){
  if (addedUsers.value.includes(user)) {
    addedUsers.value = addedUsers.value.filter((u) => u !== user);
  } else {
    addedUsers.value.push(user);
  }
}

function createConversation() {
  console.log(name.value);
  console.log(addedUsers.value);
  if (name.value === "") {
    error.value = "Le nom de la conversation ne peut pas être vide";
    return;
  }

  if (addedUsers.value.length === 0) {
    error.value = "Vous devez ajouter au moins un participant";
    return;
  }

  addedUsers.value.push(props.users.find((user) => user.id === localStorage.getItem("userId")));
  let listParticipants = addedUsers.value.map((user) => user.id);
  fetch("http://localhost:8000/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("userId") + " " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      name: name.value,
      participants: listParticipants,
    }),
  })
  /* Close the modal */
  store.commit("showCreateConversationModal", false);
}
</script>

<template>
  <BaseModal>
    <template #title>Créer une nouvelle conversation</template>
    <template #body>
      <form class="createConversationModal-form" @submit.prevent="createConversation">
        <div>
          <label for="name" class="createConversationModal-label">Nom de la conversation</label>
          <input type="text" id="name" v-model="name" class="createConversationModal-input" placeholder="Nom de la conversation"/>
        </div>
        <div class="createConversationModal-userPicker">
          <span class="createConversationModal-label">Ajouter des participants</span>
          <input type="text" v-model="search" @keyup="searchUser" class="createConversationModal-input" placeholder="Rechercher un participant"/>
          <div v-for="user in users" :key="user.id" class="createConversationModal-userPicker-item" @click="userClicked(user)">
            <div :style="{ backgroundColor: '#' + user.color }" class="color"></div>
            <div class="user">
              <span class="display-name">{{ user.displayName }}</span>
              <span class="username">@{{ user.username }}</span>
            </div>
            <img v-if="addedUsers.includes(user)" class="added" src="/icons/check-circle.svg" alt="Added"/>
          </div>
        </div>

        <div class="createConversationModal-button-container">
          <button type="submit" class="createConversationModal-button">Créer <span class="createConversationModal-nbSelect">{{addedUsers.length}} utilisateurs sélectionnés</span> </button>
          <div v-if="error" class="Error">{{ error }}</div>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<style scoped>
.createConversationModal-form {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .createConversationModal-input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid var(--white-10);
    border-radius: 5px;
    font-size: 16px;
    color: var(--white-100);

    &::placeholder {
      color: var(--white-60);
    }

    &:focus {
      outline: none;
    }
  }

  .createConversationModal-label {
    margin-bottom: 5px;
    display: block;
    color: var(--white-00);
  }

  .createConversationModal-userPicker {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .createConversationModal-userPicker-item {
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

      .added {
        width: 20px;
        height: 20px;
      }
    }
  }

  .createConversationModal-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: var(--white-00);
    color: var(--white-100);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:hover {
      background-color: var(--white-40);
    }
  }

  .createConversationModal-nbSelect {
    font-size: 14px;
    color: var(--white-60);
  }

  .createConversationModal-button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .Error {
    font-size: 16px;
    color: var(--error-20);
  }
}


</style>