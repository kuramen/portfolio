<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

const { data: page } = await useAsyncData(
  'landing-page',
  () => queryCollection('landing').first()
)

const { data: experiences } = await useAsyncData(
  'experiences',
  () => queryCollection('experiences').order('startDate', 'DESC').all()
)

const { data: projects } = await useAsyncData(
  'projects',
  () => queryCollection('projects').order('date', 'DESC').all()
)

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})

const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <main>
    <ContentRenderer
      v-if="page"
      id="about"
      :value="page"
      tag="section"
      class="about"
    />

    <section
      v-if="experiences"
      id="experience"
      class="experience"
    >
      <h3>Experience</h3>
      <article
        v-for="(experience, experienceIndex) in experiences"
        :key="experienceIndex"
      >
        <aside>
          <TimeRange
            class="time-range"
            :start="experience.startDate"
            :end="experience.endDate"
          />
        </aside>
        <h4>{{ experience.position }} · {{ experience.company }}</h4>
        <p>{{ experience.description }}</p>
        <ul class="technologies">
          <li
            v-for="(technologie, technologieIndex) in experience.technologies"
            :key="technologieIndex"
          >
            {{ technologie }}
          </li>
        </ul>
      </article>
      <NuxtLink
        v-if="page"
        :to="page.resume"
        class="resume-link"
        target="_blank"
        external
      >
        <span>View Full Résumé</span>
        <Icon name="ri:arrow-right-up-line" />
      </NuxtLink>
    </section>

    <section
      v-if="projects"
      id="projects"
      class="projects"
    >
      <h3>Projects</h3>
      <article
        v-for="(project, projectIndex) in projects"
        :key="projectIndex"
      >
        <aside>
          <NuxtImg
            :provider="runtimeConfig.imageProvider"
            :src="project.image.src"
            :alt="project.image.alt"
            width="200"
          />
        </aside>
        <h4>{{ project.title }}</h4>
        <p>{{ project.description }}</p>
        <ul class="technologies">
          <li
            v-for="(technologie, technologieIndex) in project.technologies"
            :key="technologieIndex"
          >
            {{ technologie }}
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<style scoped>
section {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  grid-gap: 1rem;
  padding-block: 6rem 0;
}

h3 {
  display: none;
}

article {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 1rem;
  padding-inline: 1.2rem;
  padding-block: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;

  h4 {
    font-size: 1rem;
  }

  p {
    font-size: 0.9rem;
    font-weight: 300;
  }

  .time-range {
    font-size: 0.8rem;
    font-weight: 300;
  }

  h4,
  p {
    display: block;
    line-height: 1.2em;
    height: fit-content;
  }

  aside {
    grid-row: 1 / span 3;
  }

  &:hover {
    background-color: var(--color-deep-transparent);
  }
}

section.about {
  padding-inline: 1.2rem;

  :global(p) {
    display: block;
    font-size: 1rem;
    line-height: 1.6em;
    font-weight: 400;
    height: fit-content;
  }

  :global(h3) {
    display: none;
  }
}

section.projects article {
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    background-color: var(--color-deep);
    border: 1px solid var(--color-light);
  }
}

ul.technologies {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  li {
    font-size: 0.8rem;
    font-weight: 300;
    border-radius: 10rem;
    padding-inline: 0.7rem;
    padding-block: 0.35rem;
    color: var(--color-light);
    background-color: var(--color-deep);
  }
}

.resume-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;

  span:not(.iconify) {
    display: block;
    width: fit-content;
  }

  &:hover {
    color: var(--color);
  }
}
</style>
