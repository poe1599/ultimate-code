<script setup lang="ts">
import Button from 'primevue/button'
import { ref } from 'vue'
import gameStore from '~me/stores/gameStore'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'
import { shuffle, cloneDeep } from 'lodash-es'

const emit = defineEmits<{
  next: []
}>()

const randomColors = shuffle(gameStore.value.playerColors)

const name = ref('')

const deletePlayer = (id: string) => {
  const index = gameStore.value.players.findIndex((p) => p.id === id)
  gameStore.value.players.splice(index, 1)
}

const clickAddPlayer = () => {
  gameStore.value.players.push({
    name: name.value,
    id: name.value,
    color: randomColors[gameStore.value.players.length],
  })
  name.value = ''
}

const clickClearPlayer = () => {
  gameStore.value.players = []
  gameStore.value.survivePlayers = []
  name.value = ''
}

const clickShuffle = () => {
  gameStore.value.players = shuffle(gameStore.value.players)
  gameStore.value.survivePlayers = cloneDeep(gameStore.value.players)
}

const clickStart = () => {
  gameStore.value.survivePlayers = cloneDeep(gameStore.value.players)
  emit('next')
}

const clickContinue = () => {
  if (!gameStore.value.survivePlayers.length) return
  emit('next')
}
</script>

<template>
  <div class="gp">
    <div class="gp__container">
      <ul class="gp__playerList">
        <li v-for="player in gameStore.players">
          <Avatar
            label=""
            class="mr-2"
            size="large"
            :style="`background-color: var(${player.color});`"
            @dblclick="deletePlayer(player.id)"
          />
          <span>{{ player.name }}</span>
        </li>
      </ul>
      <div>
        <InputText type="text" v-model="name" />
      </div>
      <div class="gp__buttons">
        <Button class="gp__button" variant="outlined" label="Add" @click="clickAddPlayer" />
        <Button class="gp__button" variant="outlined" label="Clear" @click="clickClearPlayer" />
        <Button class="gp__button" variant="outlined" label="Shuffle" @click="clickShuffle" />
        <Button class="gp__button" variant="outlined" label="Start" @click="clickStart" />
        <Button class="gp__button" variant="outlined" label="Continue" @click="clickContinue" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gp {
  width: 100%;
  height: 100%;
  position: relative;

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    zoom: var(--game-zoom);
    text-align: center;
  }

  &__playerList {
    min-height: 5rem;
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 2rem;

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      white-space: nowrap;
    }
  }

  &__buttons {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
}
</style>
