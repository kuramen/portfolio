<script setup lang="ts">
const props = defineProps({
  toc: { type: Object, required: true }
})

const depth = computed(() => props.toc.depth ?? 3)
const links = computed(() => props.toc.links ?? [])
const $targets = ref<HTMLDivElement[]>([])

const options = {
  root: null,
  rootMargin: '-10% 0px -10% 0px',
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
}

const activeIds = reactive(new Set())

function onIntersection(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      activeIds.add(entry.target.id)
    } else {
      activeIds.delete(entry.target.id)
    }
  }
}

function updateTargets(depth) {
  const queries = []
  for (let i = 0; i < depth; i++) {
    queries.push(`h${i + 2}`)
  }
  $targets.value = Array.from(document.querySelectorAll(queries.join(', ')))
}

onMounted(() => {
  watch(depth, updateTargets, { immediate: true })
})

useIntersectionObserver($targets, onIntersection, options)
</script>

<template>
  <ul class="content-toc">
    <ContentTocItem
      v-for="link of links"
      :key="link.id"
      :link="link"
      :active-ids="activeIds"
    />
  </ul>
</template>

<style scoped>
ul {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  width: fit-content;
}
</style>
