<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ULTIMATE_CODE_RANGE_MIN,
  ULTIMATE_CODE_RANGE_MAX,
  getRandomCode,
  getNewCodeRange,
} from '~me/utils/ultimateCode'

const code = ref<number>(0)
const range = ref<[number, number]>([ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX])

const newCode = ref<number | null>(null)

const initUltimateCode = () => {
  code.value = getRandomCode(ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX)
  range.value = [ULTIMATE_CODE_RANGE_MIN, ULTIMATE_CODE_RANGE_MAX]
  clearNewCode()
}

const sendNewCode = () => {
  if (newCode.value === null) return
  if (newCode.value === code.value) {
    alert('Correct!')
    clearNewCode()
    initUltimateCode()
    return
  }

  range.value = getNewCodeRange(code.value, range.value, newCode.value)
  clearNewCode()
}

const clearNewCode = () => {
  newCode.value = null
}

onMounted(() => {
  initUltimateCode()
})
</script>

<template>
  <div>
    <div>
      <span>{{ range[0] }}</span> ~ <span>{{ range[1] }}</span>
    </div>
    <div>{{ newCode }}</div>
    <input type="number" :min="range[0]" :max="range[1]" v-model="newCode" />
    <button @click="sendNewCode">Send</button>
  </div>
</template>

<style scoped></style>
