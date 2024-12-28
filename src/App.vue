<script setup lang="ts">
import GameStart from '~me/components/gameStart.vue'
import ultimateCode from '~me/components/ultimateCode.vue'
</script>

<template>
  <div class="layout">
    <GameStart />
    <ultimateCode />
  </div>
</template>

<style lang="css" src="~me/css/normalize.css"></style>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
}
</style>
