<script setup>
const props = defineProps({
  error: { type: Object, required: true }
})

const statusMessage = computed(() =>
  props.error.statusCode === 404
    ? 'This page could not be found'
    : 'An error occurred'
)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="container">
    <main>
      <h1>{{ error.statusCode }}</h1>
      <p>{{ statusMessage }}</p>
      <button @click="handleError">
        <Icon name="ri:arrow-left-line" />
        <span>Go back</span>
      </button>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
}

main {
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 1.2rem;

  &:before {
    content: '';
    grid-column: 2;
    grid-row: 1;
    width: 1px;
    height: 3rem;
    background-color: var(--color-deep);
  }
}

h1 {
  color: var(--color-lighter);
  font-size: 1.6em;
}

p {
  color: var(--color-light);
  font-size: 1em;
}

button {
  grid-column: 1 / span 3;
  border: none;
  outline: none;
  background: none;
  color: var(--color-light);
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  width: fit-content;
  gap: 0.5rem;
  font-size: 1em;
  justify-self: center;
  cursor: pointer;

  &:hover {
    color: var(--color-lighter);
  }
}
</style>
