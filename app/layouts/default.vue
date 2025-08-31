<script setup lang="ts">
</script>

<template>
  <body>
    <slot />
  </body>
</template>

<style scoped>
body {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 1rem;
  padding-inline: 1rem;
}

:slotted(main) {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  gap: 1rem;
}
</style>
