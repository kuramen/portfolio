<script setup lang="ts">
const props = defineProps({
  start: { type: String, required: true },
  end: { type: String },
  tag: { type: String, default: 'div' }
})

const startDate = computed(() => new Date(props.start))
const endDate = computed(() => props.end ? new Date(props.end) : new Date())

const hasLessThanYear = computed(() => endDate.value.getFullYear() - startDate.value.getFullYear() < 1)

const startDateString = computed(() => {
  if (!hasLessThanYear.value) {
    return startDate.value.getFullYear()
  }
  return startDate.value.toLocaleDateString('en-US', { month: 'short' })
})

const endDateString = computed(() => {
  if (!props.end) {
    return 'Present'
  }
  if (!hasLessThanYear.value) {
    return endDate.value.getFullYear()
  }
  return endDate.value.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})
</script>

<template>
  <div class="time-range">
    <time :datetime="start">{{ startDateString }}</time>
    <time :datetime="end">{{ endDateString }}</time>
  </div>
</template>

<style scoped>
.time-range {
  display: grid;
  grid-template-columns: auto 0.8rem auto;
  grid-template-rows: 1fr;
  align-items: center;
  width: fit-content;
  grid-gap: 0.2rem;

  &:before {
    display: block;
    content: '';
    grid-column: 2;
    grid-row: 1;
    height: 1px;
    background-color: currentColor;
  }

  time {
    grid-column: 1;
    grid-row: 1;
    justify-self: end;

    &:last-child {
      grid-column: 3;
      justify-self: start;
    }
  }
}

time {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  text-transform: uppercase;
}
</style>
