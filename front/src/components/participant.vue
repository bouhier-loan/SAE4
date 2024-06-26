<script setup>
import {defineProps} from "vue";
import axios from "axios";
import store from "@/store/store.js";

const props = defineProps({
  user: {
    type: {
      id: Number,
      username: String,
      displayName: String,
      color: String,
    },
    required: true,
  },
  participantIsOwner: {
    type: Boolean,
    required: true,
  },
  userIsOwner: {
    type: Boolean,
    required: true,
  },
});

function kickParticipant() {
  axios.delete(`http://localhost:8000/conversations/${store.state.currentConversation}/participants/${props.user.id}`, {
    headers: {
      Authorization: localStorage.getItem("userId") + " " + localStorage.getItem('token'),
    },
  }).then(() => {
    // Remove the participant from the list
    store.commit("removeParticipant", props.user.id);
  }).catch((error) => {
    console.error(error);
  });
}
</script>

<template>
  <div class="user">
    <div class="global">
      <div class="color" :style="{ backgroundColor: '#' + user.color }"></div>
      <div class="infos">
        <span class="displayName">{{ user.displayName }}</span>
        <span class="username">@{{ user.username }}</span>
      </div>
    </div>
    <img v-if="participantIsOwner" alt="Conversation owner" class="owner" src="/icons/shield-check.svg"/>
    <span v-else-if="userIsOwner" class="kick" @click="kickParticipant">✗</span>
  </div>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 20px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  justify-content: space-between;

  font-size: 18px;
  color: var(--white-90);

  &:hover {
    background-color: var(--white-80);
    color: var(--white-60);
  }

  .global {
    display: flex;
    align-items: center;
    gap: 10px;

    .color {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid var(--white-100);
    }

    .infos {
      display: flex;
      flex-direction: column;

      .displayName {
        font-weight: bold;
        font-size: 18px;
        color: var(--white-00);
        line-height: 22px;
      }

      .username {
        font-size: 14px;
        color: var(--white-40);
        line-height: 22px;
      }
    }
  }

  .owner {
    width: 30px;
    height: 30px;
    filter: invert(1);
  }

  .kick:hover {
    color: var(--white-40);
  }
}
</style>