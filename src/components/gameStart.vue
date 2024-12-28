<script setup lang="ts">
import Button from 'primevue/button'

const emit = defineEmits<{
  start: [isControlMode: boolean]
}>()

const clickStartGame = (isControlMode: boolean) => {
  emit('start', isControlMode)
}
</script>

<template>
  <div class="gs">
    <div class="gs__container">
      <img class="gs__bombImg" src="@/assets/imgs/bomb.png" @dblclick="clickStartGame(true)" />
      <h1 class="gs__title">Ultimate Code</h1>
      <Button class="gs__startButton" label="Game Start" @click="clickStartGame(false)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gs {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid var(--p-surface-950);
  background-color: var(--p-surface-950);
  text-align: center;

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__bombImg {
    margin: 0 auto;
    width: 30rem;
    display: block;
  }

  &__title {
    font-size: 6rem;
    text-align: center;
    margin: 1rem auto 0;
  }

  &__startButton {
    margin: 1rem auto 0;
    zoom: 1.5;
  }
}
</style>
