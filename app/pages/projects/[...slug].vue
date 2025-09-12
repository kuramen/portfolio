<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(route.path, () =>
  queryCollection('projects').path(route.path).first()
)

if (!project.value) {
  throw createError({ statusCode: 404, fatal: true })
}

const { data: surroundingProjects } = await useAsyncData(`surround-${route.path}`, () =>
  queryCollectionItemSurroundings('projects', route.path)
    .order('date', 'DESC')
)

const dateString = computed(() => {
  const date = new Date(project.value.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
})

const previousProject = computed(() => surroundingProjects.value[0])
const nextProject = computed(() => surroundingProjects.value[1])
</script>

<template>
  <div class="container">
    <div class="container-inner">
      <header>
        <p class="breadcrumb">
          <Icon name="ri:arrow-left-line" />
          <NuxtLink to="/">Clément Brunie</NuxtLink>
          <span>/</span>
          <NuxtLink to="/projects">Projects</NuxtLink>
        </p>
        <h1>{{ project.title }}</h1>
        <p> {{ dateString }}</p>
      </header>
      <ContentRenderer
        v-if="project"
        :value="project"
        tag="main"
        class="markdown"
      />
      <footer>
        <NuxtLink
          v-if="previousProject"
          :to="previousProject.path"
          class="previous"
        >
          <article>
            <p>{{ previousProject.title }}</p>
            <Icon
              class="icon"
              name="ri:arrow-left-line"
            />
          </article>
        </NuxtLink>
        <NuxtLink
          v-if="nextProject"
          :to="nextProject.path"
          class="next"
        >
          <article>
            <p>{{ nextProject.title }}</p>
            <Icon
              class="icon"
              name="ri:arrow-right-line"
            />
          </article>
        </NuxtLink>
      </footer>
    </div>
    <aside>
      <ClientOnly>
        <ContentToc
          class="toc"
          :toc="project.body.toc"
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
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  a {
    border: none;
  }

  a.next {
    grid-column: 2;

    article .icon {
      grid-column: 2;
      justify-self: end;
    }
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
