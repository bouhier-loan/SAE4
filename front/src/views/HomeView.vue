<script setup>
import router from "@/router/index.js";
import ConversationVue from "@/views/ConversationVue.vue";

if (!localStorage.getItem('token')) {
  clearInterval("getMessages")
  router.push('/login');
}
</script>

<template>
<div class="home-vue">
  <div class="home">
    <div class="home-header">
      <img src="/icons/logo.png" alt="logo" class="logo">
      <div class="home-list">
        <div class="home-list-item">
          <img src="/icons/annotation.svg" alt="">
          Conversations
        </div>
        <div class="home-list-item">
          <img src="/icons/archive.svg" alt="">
          Projets
        </div>
      </div>
    </div>
  </div>
  <ConversationVue/>
</div>
</template>

<style scoped>
.home-vue {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background-color: var(--white-100);

  .home {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px 15px 50px 15px;
    justify-content: space-between;

    .home-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;

      .logo {
        width: 69px;
        height: 75px;
      }

      .home-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .home-list-item {
          display: flex;
          flex-direction: row;
          align-items: start;
          margin-bottom: 20px;
          color: var(--white-10);
          width: 100%;
          font-size: 18px;
          font-weight: bold;
          gap: 10px;
          cursor: pointer;

          img {
            width: 30px;
            height: 30px;
            filter: invert(1);
          }
        }
      }
    }
  }
}
</style>

