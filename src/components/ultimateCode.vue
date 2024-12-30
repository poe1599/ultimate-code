<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import {
  ULTIMATE_CODE_RANGE_MIN,
  ULTIMATE_CODE_RANGE_MAX,
  getRandomCode,
  getNewCodeRange,
} from '~me/utils/ultimateCode'
import gameStore from '~me/stores/gameStore'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'

const props = withDefaults(defineProps<{ isControlMode?: boolean }>(), {
  isControlMode: false,
})

const emit = defineEmits<{
  end: []
}>()

const isDialogOpen = ref(false)
const dialogMode = ref<'win' | 'lose'>('win')
const dialogCallback = ref<Function>()

const currentSurvivePlayers = computed(() =>
  gameStore.value.players
    .filter((player) => gameStore.value.survivePlayers.some((i) => i.id === player.id))
    .map((player) => ({
      ...player,
      isPlaying: gameStore.value.survivePlayers[0].id === player.id,
    })),
)

const initUltimateCode = () => {
  gameStore.value.code = getRandomCode(ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX)
  gameStore.value.range = [ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX]
  clearNewCode()
}

const sendNewCode = () => {
  if (gameStore.value.newCode === null) return
  const min = gameStore.value.range[0]
  const max = gameStore.value.range[1]
  const newCode = Number(gameStore.value.newCode)
  if (newCode <= min || newCode >= max) return

  gameStore.value.range = getNewCodeRange(
    gameStore.value.code,
    gameStore.value.range,
    gameStore.value.newCode,
  )

  if (gameStore.value.newCode !== gameStore.value.code) {
    switchToNextPlayer()
    clearNewCode()
    return
  }

  chanel.postMessage('correct')
}

const clearNewCode = () => {
  gameStore.value.newCode = null
}

onMounted(() => {
  if (props.isControlMode) return
  initUltimateCode()
})

const chanel = new BroadcastChannel('ultimateCode')

chanel.onmessage = (event) => {
  if (event.data !== 'correct') return
  if (props.isControlMode) return
  if (gameStore.value.newCode !== gameStore.value.code) return
  whenCodeCorrect()
}

const switchToNextPlayer = () => {
  const lastPlayer = gameStore.value.survivePlayers.shift()
  if (lastPlayer) gameStore.value.survivePlayers.push(lastPlayer)
}

const whenCodeCorrect = () => {
  if (gameStore.value.newCode !== gameStore.value.code) return
  if (gameStore.value.gameMode === 'single-elimination') singleEliminationEnd()
  else if (gameStore.value.gameMode === 'normal') normalEnd()
}

const singleEliminationEnd = async () => {
  dialogMode.value = 'lose'
  await openDialog()

  gameStore.value.survivePlayers.shift()

  if (gameStore.value.survivePlayers.length === 1) {
    dialogMode.value = 'win'
    await openDialog()
    emit('end')
  }

  initUltimateCode()
}

const normalEnd = async () => {
  dialogMode.value = 'win'
  await openDialog()
  emit('end')
}

const openDialog = async () => {
  isDialogOpen.value = true
  await new Promise((resolve) => {
    dialogCallback.value = resolve
  })
}

const closeDialog = () => {
  if (!dialogCallback.value) return
  dialogCallback.value()
}
</script>

<template>
  <div class="game">
    <div class="game__container">
      <div class="game__codeRange">
        <span>{{ gameStore.range[0] }}</span> ~ <span>{{ gameStore.range[1] }}</span>
      </div>
      <div></div>
      <ul class="game__playerList">
        <li v-for="player in currentSurvivePlayers" :data-is-play="player.isPlaying">
          <Avatar size="large" :style="`background-color: var(${player.color});`" />
          <span>{{ player.name }}</span>
        </li>
      </ul>
      <div>
        <InputNumber
          class="game__input"
          v-model="gameStore.newCode"
          inputId="minmax"
          :min="gameStore.range[0]"
          :max="gameStore.range[1]"
          fluid
        />
        <div v-if="props.isControlMode">
          <Button class="game__sendButton" label="Send" @click="sendNewCode" />
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="isDialogOpen"
      modal
      :closable="false"
      dismissableMask
      :style="{ width: '25rem' }"
      @hide="closeDialog"
    >
      <div class="D-dialog">
        <h2>
          {{ `${gameStore.survivePlayers[0].name}` }}
          <br />
          <span>
            <template v-if="dialogMode === 'win'">You Win !</template>
            <template v-else-if="dialogMode === 'lose'">You Lose !</template>
          </span>
        </h2>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.game {
  width: 100%;
  height: 100%;
  position: relative;

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    zoom: var(--game-zoom);
  }

  &__mode {
    font-size: 4rem;
    font-weight: bold;
  }

  &__codeRange {
    font-size: 10rem;
    font-weight: bold;
  }

  &__playerList {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 2rem;
    margin: 1rem auto;

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      opacity: 0.3;
      zoom: 0.8;
      transition: all 0.3s;
      white-space: nowrap;
    }

    li[data-is-play='true'] {
      opacity: 1;
      zoom: 1.2;
    }
  }

  &__input {
    width: 20rem;

    :deep(.p-inputtext) {
      text-align: center;
      font-weight: bold;
      font-size: 4rem;
    }
  }

  &__sendButton {
    margin-top: 1rem;
  }
}

.D-dialog {
  text-align: center;

  h2 {
    font-size: 4rem;
    font-weight: bold;
  }
}
</style>
