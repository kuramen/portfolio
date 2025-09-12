<script setup lang="ts">
defineProps({
  link: { type: Object, required: true },
  activeIds: { type: Set, required: true },
  depth: { type: Number, default: 0 }
})
</script>

<template>
  <li>
    <a
      :href="`#${link.id}`"
      :style="{ '--depth': depth }"
      :class="{ active: activeIds.has(link.id) }"
    >
      {{ link.text }}
    </a>
    <ul v-if="link.children?.length">
      <ContentTocItem
        v-for="child of link.children"
        :key="child.id"
        :link="child"
        :active-ids="activeIds"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>

<style scoped>
li,
ul {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: auto;
  grid-auto-flow: row;
}

a {
  border: none;
  color: var(--color);
  font-size: 0.9rem;
  font-weight: 400;
  padding-block: 0.5rem;
  padding-inline-start: calc(var(--depth) * 0.5rem + 1rem);
  border-inline-start: 1px solid var(--color-deep);

  &:hover,
  &.active  {
    color: var(--color-lighter);
  }

  &.active {
    border-color: var(--color-lighter);
  }
}
</style>
