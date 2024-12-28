<script setup lang="ts">
import { onMounted } from 'vue'
import {
  ULTIMATE_CODE_RANGE_MIN,
  ULTIMATE_CODE_RANGE_MAX,
  getRandomCode,
  getNewCodeRange,
} from '~me/utils/ultimateCode'
import gameStore from '~me/stores/gameStore'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = withDefaults(defineProps<{ isControlMode?: boolean }>(), {
  isControlMode: false,
})

const initUltimateCode = () => {
  gameStore.value.code = getRandomCode(ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX)
  gameStore.value.range = [ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX]
  clearNewCode()
}

const sendNewCode = () => {
  if (gameStore.value.newCode === null) return
  if (gameStore.value.newCode === gameStore.value.code) {
    alert('Correct!')
    clearNewCode()
    initUltimateCode()
    return
  }

  gameStore.value.range = getNewCodeRange(
    gameStore.value.code,
    gameStore.value.range,
    gameStore.value.newCode,
  )
  clearNewCode()
}

const clearNewCode = () => {
  gameStore.value.newCode = null
}

onMounted(() => {
  if (props.isControlMode) return
  initUltimateCode()
})
</script>

<template>
  <div class="game">
    <div class="game__container">
      <div v-if="props.isControlMode" class="game__mode">Control Mode</div>
      <div class="game__codeRange">
        <span>{{ gameStore.range[0] }}</span> ~ <span>{{ gameStore.range[1] }}</span>
      </div>
      <div v-if="props.isControlMode">
        <InputNumber
          class="game__input"
          v-model="gameStore.newCode"
          inputId="minmax"
          :min="gameStore.range[0]"
          :max="gameStore.range[1]"
          fluid
        />
        <div>
          <Button class="game__sendButton" label="Send" @click="sendNewCode" />
        </div>
      </div>
    </div>
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
    padding: 1rem;
    text-align: center;
  }

  &__mode {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__codeRange {
    font-size: 12rem;
    font-weight: bold;
  }

  &__input,
  &__sendButton {
    zoom: 5;
  }

  &__sendButton {
    margin-top: 1rem;
  }
}
</style>
