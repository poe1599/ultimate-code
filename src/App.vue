<script setup lang="ts">
import { ref } from 'vue'
import GameStart from '~me/components/gameStart.vue'
import UltimateCode from '~me/components/ultimateCode.vue'
import GamePlayer from '~me/components/gamePlayer.vue'

/**
 * 01: Game Start
 * 02: Game Player
 * 03: Ultimate Code
 */
const pageCode = ref<'01' | '02' | '03'>('01')

const isControlMode = ref(false)

const toSetPlayers = (e: boolean) => {
  isControlMode.value = e
  pageCode.value = isControlMode.value ? '03' : '02'
}

const toStartGame = () => {
  pageCode.value = '03'
}
</script>

<template>
  <div class="layout">
    <GameStart v-if="pageCode === '01'" @start="toSetPlayers" />
    <GamePlayer v-else-if="pageCode === '02'" @next="toStartGame" />
    <UltimateCode v-else-if="pageCode === '03'" :isControlMode="isControlMode" />
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
