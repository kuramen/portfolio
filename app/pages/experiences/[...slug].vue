<script setup lang="ts">
const route = useRoute()

const { data: experience } = await useAsyncData(route.path, () =>
  queryCollection('experiences').path(route.path).first()
)

if (!experience.value) {
  throw createError({ statusCode: 404, fatal: true })
}

const { data: projects } = await useAsyncData(`${route.path}-projects`, () =>
  queryCollection('projects', route.path)
    .where('madeAt', '=', experience.value.company)
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div class="container">
    <div class="container-inner">
      <header>
        <p class="breadcrumb">
          <Icon name="ri:arrow-left-line" />
          <NuxtLink to="/">Clément Brunie</NuxtLink>
        </p>
        <h1>{{ experience.position }}</h1>
        <TimeRange
          class="time-range"
          :start="experience.startDate"
          :end="experience.endDate"
        />
      </header>
      <ContentRenderer
        v-if="experience"
        :value="experience"
        tag="main"
        class="markdown"
      />
      <footer>
        <NuxtLink
          v-for="project of projects"
          :key="project.id"
          :to="experience.path + project.path"
        >
          <article>
            <p>{{ project.title }}</p>
          </article>
        </NuxtLink>
      </footer>
    </div>
    <aside>
      <ClientOnly>
        <ContentToc
          class="toc"
          :toc="experience.body.toc"
        />
      </ClientOnly>
    </aside>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block-end: 3rem;
}

.container-inner {
  grid-column: 2;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 5rem;
  max-width: 600px;
}

main {
  line-height: 1.6;
  color: var(--color-light);
}

header {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
  padding-block-start: 6rem;

  h1 {
    color: var(--color-lighter);
    font-size: 2.8rem;
    font-weight: bold;
  }
}

aside {
  grid-row: 1 / span2;
  grid-column: 3;
  padding-block: 6rem;
  padding-inline: 1rem;
}

footer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-auto-rows: 1fr;
  gap: 1rem;

  a {
    border: none;
  }

  article {
    border: 1px solid var(--color-deep);
    border-radius: 0.5rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;

    &:hover {
      border-color: var(--color);
    }

    p {
      grid-column: 1 / span 2;
    }

    .icon {
      font-size: 1.5rem;
    }
  }
}

footer article {
  padding-block: 1rem;
}

.toc {
  position: sticky;
  top: 6rem;
  margin-inline: auto;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    padding-inline: 3rem;
  }

  .container-inner {
    grid-column: 1;
    width: fit-content;
    margin-inline: auto;
  }

  main,
  header {
    grid-column: 1;
  }

  aside {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    gap: 3rem;
    padding-inline: 1.5rem;
  }

  header {
    padding-block-start: 3rem;
  }
}
</style>
