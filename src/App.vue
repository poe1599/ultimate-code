<script setup lang="ts">
import { ref } from 'vue'
import GameStart from '~me/components/gameStart.vue'
import UltimateCode from '~me/components/ultimateCode.vue'

/**
 * 01: Game Start
 * 02: Ultimate Code
 */
const pageCode = ref<'01' | '02'>('01')

const isControlMode = ref(false)

const startGame = (e: boolean) => {
  pageCode.value = '02'
  isControlMode.value = e
}
</script>

<template>
  <div class="layout">
    <GameStart v-if="pageCode === '01'" @start="startGame" />
    <UltimateCode v-else-if="pageCode === '02'" :isControlMode="isControlMode" />
  </div>
</template>

<style lang="css" src="~me/css/normalize.css"></style>
<style lang="scss">
.layout {
  width: 100%;
  height: 100vh;
  --p-button-label-font-weight: bold;
}

:root {
  --game-zoom: 1.5;
}
</style>
