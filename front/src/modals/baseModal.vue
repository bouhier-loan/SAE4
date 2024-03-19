<template>
  <div class="baseModal">
    <div class="baseModal-header">
      <span><slot name="title"/></span>
      <img alt="close icon" src="/icons/x.svg" @click="close"/>
    </div>
    <main class="baseModal-body">
      <slot name="body"/>
    </main>
  </div>
</template>

<style scoped>
.baseModal {
  display: flex;
  flex-direction: column;
  width: 40%;
  max-height: 60%;
  background-color: var(--white-80);
  border-radius: 5px;

  .baseModal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 15px;
    border-bottom: 1px solid var(--white-10);

    span {
      font-size: 20px;
      color: var(--white-00);
    }

    img {
      width: 20px;
      height: 20px;
      cursor: pointer;
      filter: invert(1);
    }
  }

  .baseModal-body {
    display: flex;
    flex-direction: column;
    padding: 20px 15px;
    gap: 20px;
    overflow-y: auto;
  }
}
</style>