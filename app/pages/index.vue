<script setup lang="ts">
import useLandingPage from '~/utils/useLandingPage'

definePageMeta({
  layout: 'landing'
})

const { data: page } = await useLandingPage()

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
  <main class="landing">
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
            <NuxtLink
              v-if="technologies[technologie]"
              :href="technologies[technologie].link"
              target="_blank"
              external
            >
              <Icon :name="technologies[technologie].icon" />
              <span>{{ technologie }}</span>
            </NuxtLink>
            <p v-else>
              {{ technologie }}
            </p>
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
            <NuxtLink
              v-if="technologies[technologie]"
              :href="technologies[technologie].link"
              target="_blank"
              external
            >
              <Icon :name="technologies[technologie].icon" />
              <span>{{ technologie }}</span>
            </NuxtLink>
            <p v-else>
              {{ technologie }}
            </p>
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
  gap: 1rem;
  padding-block: 6rem 0;
}

article {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
  padding-inline: 1.2rem;
  padding-block: 1rem;
  box-sizing: border-box;
  border-radius: 0.4rem;

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

  .technologies {
    height: fit-content;
    justify-self: start;
  }

  &:hover {
    background-color: var(--color-light-1);
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
}

section.projects article {
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.2rem;
    background-color: var(--color-deep);
    border: 1px solid var(--color-light);
  }
}

ul.technologies {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;

  a,
  p {
    display: grid;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: -0.5px;
    font-variation-settings: 'wdth' 50;
    border-radius: 0.2rem;
    padding-inline: 0.5rem;
    padding-block: 0.35rem;
    color: var(--color);
    background-color:  var(--color-light-2);
  }

  a {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    border: none;

    &:hover {
      color: var(--color-light);
      background-color:  var(--color-light-3);
    }
  }
}

.resume-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  margin-block-start: 2rem;
  padding-inline-start: 1.2rem;

  span:not(.iconify) {
    display: block;
    width: fit-content;
  }

  &:hover {
    color: var(--color);
  }
}

@media (max-width: 1024px) {
  section {
    padding-block: 0;
    padding-inline: 0 !important;

    &:not(.projects):after {
      content: '';
      display: block;
      height: 4rem;
    }
  }

  article {
    margin-inline: -1rem;
    padding-inline: 1rem;
  }

  .resume-link {
    padding-inline-start: 0;
  }
}

@media (max-width: 640px) {
  section.experience article {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;

    aside {
      grid-row: 1;
      height: fit-content;
      margin-block-end: -0.5rem;
    }
  }

  section.projects article {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto auto;

    aside {
      grid-row: 4;
      height: fit-content;

      img {
        width: auto;
        height: 100%;
        max-height: 8rem;
      }
    }
  }
}
</style>

<style>
main.landing h3 {
  display: none;
}

@media (max-width: 1024px) {
  main.landing h3 {
    display: block;
    position: sticky;
    top: 0;
    border: none;
    color: var(--color-lighter);
    background-color: var(--background-color-transparent);
    padding-block: 1rem;
    margin-inline: -3rem;
    padding-inline: 3rem;
    backdrop-filter: blur(8px);
  }
}

@media(max-width: 768px) {
  main.landing h3 {
    margin-inline: -1.5rem;
    padding-inline: 1.5rem;
  }
}
</style>
