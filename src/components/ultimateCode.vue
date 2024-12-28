<script setup lang="ts">
import { onMounted } from 'vue'
import {
  ULTIMATE_CODE_RANGE_MIN,
  ULTIMATE_CODE_RANGE_MAX,
  getRandomCode,
  getNewCodeRange,
} from '~me/utils/ultimateCode'
import gameStore from '~me/stores/gameStore'

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
  initUltimateCode()
})
</script>

<template>
  <div class="game">
    <div class="game__container">
      <div class="game__codeRange">
        <span>{{ gameStore.range[0] }}</span> ~ <span>{{ gameStore.range[1] }}</span>
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
  }

  &__codeRange {
    font-size: 12rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>
