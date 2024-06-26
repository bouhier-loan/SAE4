<script setup>
import {defineProps, reactive} from 'vue'
import ParticipantAdded from "@/components/system/participantAdded.vue";
import ParticipantRemoved from "@/components/system/participantRemoved.vue";
import MessageDeleted from "@/components/system/messageDeleted.vue";
import ConversationUpdated from "@/components/system/conversationUpdated.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  }
});

/* Replace \n with <br> */
props.message.content.message = props.message.content.message.replace(/\n/g, '<br>');

/* Make @mentions bold */
props.message.content.message = props.message.content.message.replace(/@(\w+)/g, '<span style="font-weight: bold; color: var(--white-30)">@$1</span>');


const data = reactive({
  message: props.message
});

</script>

<template>
  <div v-if="data.message.senderId !== 'system'" :class="{isFollowing: data.message.isFollowing, isNotified: data.message.isNotified}"
       class="message">
    <div v-if="!data.message.isFollowing" class="header">
      <div class="userInfos">
        <div class="color" :style="{backgroundColor: '#' + data.message.senderColor}"></div>
        <span class="user">{{ data.message.senderUsername }}</span>
      </div>
      <span class="date">{{ data.message.displayDate.toString() }}</span>
    </div>

    <div class="content">
      <span class="text" v-html="data.message.content.message"></span>
      <span v-if="data.message.modified" class="modified">(modified)</span>
    </div>
  </div>
  <div class="system-message" v-else>
    <participant-added v-if="data.message.content.message=== 'PARTICIPANT_ADDED'" :class="{isNotified: data.message.isNotified}"
                       :message="data.message"/>
    <participant-removed v-else-if="data.message.content.message === 'PARTICIPANT_REMOVED'" :class="{isNotified: data.message.isNotified}"
                         :message="data.message"/>
    <message-deleted v-else-if="data.message.content.message === 'MESSAGE_DELETED'" :class="{isNotified: data.message.isNotified}"
                     :message="data.message"/>
    <ConversationUpdated message="data.message" v-else-if="data.message.content.message === 'CONVERSATION_UPDATED'" :class="{isNotified: data.message.isNotified}"
                         :message="data.message"/>
    <div v-else>
      ERROR: Unknown system message type '{{ data.message.content }}'
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  margin-top: 1em;
  padding: 0 3rem;
  --show-date: none;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;

    .userInfos {
      display: flex;
      align-items: center;
      gap: 0.5em;
      flex-direction: row;

      .color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--white-100);
      }

      .user {
        font-weight: bold;
        font-size: 18px;
        margin: 0;
        color: var(--white-00);
      }
    }

    .date {
      font-size: 0.7rem;
      color: var(--white-50);
      margin: 0;
      display: var(--show-date);
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

.message:hover {
  background-color: var(--white-90);
  --show-date: block;
}

.message.isFollowing {
  margin-top: 0;
}

.message.isNotified, .system-message .isNotified {
  background-color: rgba(159, 219, 239, 10%);
  border-left: 4px solid var(--cyan-40);
}

.message.isNotified:hover, .system-message .isNotified:hover {
  background-color: rgba(65, 173, 209, 10%);
  border-left: 4px solid var(--cyan-40);
}
</style>