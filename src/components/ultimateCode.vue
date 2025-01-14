<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
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
import gsap from 'gsap'

const props = withDefaults(defineProps<{ isControlMode?: boolean }>(), {
  isControlMode: false,
})

const emit = defineEmits<{
  end: []
}>()

const visibleMin = ref({ number: ULTIMATE_CODE_RANGE_MIN })
const visibleMax = ref({ number: ULTIMATE_CODE_RANGE_MAX })
const durationSec = 1

const fixValue = (value: number) => {
  const n = value.toFixed(0)
  const defaultDig = 3
  return n.length < defaultDig ? '0'.repeat(defaultDig - n.length) + n : n
}

watch(
  () => gameStore.value.range,
  ([min, max]) => {
    gsap.to(visibleMin.value, { duration: durationSec, number: min })
    gsap.to(visibleMax.value, { duration: durationSec, number: max })
  },
  { immediate: true, deep: true },
)

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

const sendNewCode = async () => {
  if (gameStore.value.newCode === null) return
  const min = gameStore.value.range[0]
  const max = gameStore.value.range[1]
  const newCode = Number(gameStore.value.newCode)
  if (newCode <= min || newCode >= max) return

  await changeRange()

  if (gameStore.value.newCode !== gameStore.value.code) {
    switchToNextPlayer()
    clearNewCode()
    return
  }

  chanel.postMessage('correct')
}

const changeRange = async () => {
  if (gameStore.value.newCode === null) return

  gameStore.value.range = getNewCodeRange(
    gameStore.value.code,
    gameStore.value.range,
    gameStore.value.newCode,
  )

  if (gameStore.value.newCode !== gameStore.value.code) {
    await new Promise((resolve) => setTimeout(resolve, (durationSec + 0.1) * 1000))
  }
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
        <span>{{ fixValue(visibleMin.number) }}</span> ~
        <span>{{ fixValue(visibleMax.number) }}</span>
      </div>
      <div></div>
      <ul class="game__playerList">
        <li v-for="player in currentSurvivePlayers" :data-is-play="player.isPlaying">
          <Avatar
            :image="player.avatar"
            size="large"
            :style="`background-color: var(${player.color});`"
          />
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
          <Button
            class="game__sendButton"
            variant="outlined"
            label="送出密碼"
            @click="sendNewCode"
          />
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="isDialogOpen"
      modal
      :closable="false"
      dismissableMask
      :style="{ width: '48rem' }"
      @hide="closeDialog"
    >
      <div class="D-dialog" :class="{ [`D-dialog--${dialogMode}`]: true }">
        <h2>
          {{ `${gameStore.survivePlayers[0].name}` }}
          <br />
          <span class="D-dialog__result">
            <template v-if="dialogMode === 'win'">恭喜您獲得最終的勝利 !</template>
            <template v-else-if="dialogMode === 'lose'">淘汰 !</template>
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
    white-space: nowrap;
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
      zoom: 1.4;
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

  &--win &__result {
    color: var(--p-button-success-background);
  }

  &--lose &__result {
    color: var(--p-button-danger-background);
  }
}
</style>
