<script setup>
import {defineProps, reactive} from "vue";

let props = defineProps({
  user: {
    type: {
      id: Number,
      username: String,
      displayName: String,
      color: String,
    },
    required: true,
  }
});

let data = reactive({
  user: props.user,
});
</script>

<template>
  <div class="user">
    <div class="color" :style="{ backgroundColor: '#' + data.user.color }"></div>
    <div class="infos">
      <span class="displayName">{{ data.user.displayName }}</span>
      <span class="username">@{{ data.user.username }}</span>
    </div>
  </div>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 10px;
  cursor: pointer;
  border-radius: 5px;

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
</style>