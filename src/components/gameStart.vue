<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import { ref } from 'vue'
import gameStore from '~me/stores/gameStore'

const emit = defineEmits<{
  start: [isControlMode: boolean]
}>()

const clickStartGame = (isControlMode: boolean) => {
  emit('start', isControlMode)
}

const isGameOpenConfig = ref(false)

const toggleConfigDialog = () => {
  isGameOpenConfig.value = !isGameOpenConfig.value
}

const gameModeList = [
  { label: '一般', value: 'normal' },
  { label: '單淘汰', value: 'single-elimination' },
]
</script>

<template>
  <div class="gs">
    <div class="gs__container">
      <img class="gs__bombImg" src="@/assets/imgs/bomb.png" @dblclick="clickStartGame(true)" />
      <h1 class="gs__title">Ultimate Code</h1>
      <Button class="gs__startButton" label="Game Start" @click="clickStartGame(false)" />
    </div>

    <Button
      class="gs__configButton"
      icon="pi pi-cog"
      aria-label="game config"
      @click="toggleConfigDialog"
    />

    <Dialog
      v-model:visible="isGameOpenConfig"
      modal
      :closable="false"
      dismissableMask
      :style="{ 'min-width': '50rem' }"
    >
      <template #header>
        <p class="gs__configTitle">Game Config</p>
      </template>

      <div class="gc">
        <ul>
          <li class="gc__li" v-for="gameModeOption in gameModeList">
            <RadioButton
              v-model="gameStore.gameMode"
              :inputId="gameModeOption.label"
              name="gameMode"
              :value="gameModeOption.value"
            />
            <label :for="gameModeOption.label">{{ gameModeOption.label }}</label>
          </li>
        </ul>
      </div>
    </Dialog>
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
    zoom: var(--game-zoom);
  }

  &__bombImg {
    margin: 0 auto;
    display: block;
    width: 24rem;
  }

  &__title {
    text-align: center;
    margin: 0 auto;
    font-size: 6rem;
  }

  &__startButton {
    font-weight: bold;
  }

  &__configButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
    zoom: var(--game-zoom);
  }

  &__configTitle {
    font-weight: bold;
    font-size: 2rem;
    margin: 0;
    zoom: var(--game-zoom);
  }
}

.gc {
  zoom: var(--game-zoom);

  &__li {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 0;
  }
}
</style>
