<script setup>
import {defineProps, reactive} from "vue";

let props = defineProps({
  conversation: {
    type: {
      id: Number,
      name: String,
      color: String,
      participants: Array,
    },
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: false,
    default: false,
  }
});

let data = reactive({
  conversation: props.conversation,
});
</script>

<template>
  <div class="conversation" :class="{isSelected: props.isSelected}">
    <div class="color" :style="{ backgroundColor: '#' + data.conversation.color }"></div>
    <div class="infos">
      <span class="name">{{ data.conversation.name }}</span>
      <span class="participants">{{ data.conversation.participants.length }} participants</span>
    </div>
  </div>
</template>

<style scoped>
.conversation.isSelected {
  background-color: var(--white-80);
}

.conversation {
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

    .name {
      font-weight: bold;
      font-size: 18px;
      color: var(--white-00);
      line-height: 22px;
    }

    .participants {
      font-size: 14px;
      color: var(--white-40);
      line-height: 22px;
    }
  }
}
</style>