<script setup lang="ts">
const { data: page } = await useAsyncData(
  'landing',
  () => queryCollection('landing').first()
)

const { data: footer } = await useAsyncData(
  'footer',
  () => queryCollection('footer').first()
)

const { data: experiences } = await useAsyncData(
  'experiences',
  () => queryCollection('experiences')
    .order('startDate', 'DESC')
    .all()
)

const { data: _projects } = await useAsyncData(
  'preview-projects',
  () => queryCollection('projects')
    .where('preview', 'IS NOT NULL')
    .order('date', 'DESC')
    .limit(page.value.projectLimit + 1)
    .all()
)

const hasMoreProjects = computed(() => (_projects.value?.length ?? 0) > page.value.projectLimit)
const projects = computed(() => hasMoreProjects.value
  ? _projects.value?.slice(0, page.value.projectLimit)
  : _projects.value
)

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})

const $aboutSection = useTemplateRef('about-section')
const $experienceSection = useTemplateRef('experience-section')
const $projectsSection = useTemplateRef('projects-section')

const $targets = computed<HTMLDivElement[]>(() => {
  const targets: HTMLDivElement[] = []
  if ($aboutSection.value) {
    targets.push($aboutSection.value)
  }
  if ($experienceSection.value) {
    targets.push($experienceSection.value as HTMLDivElement)
  }
  if ($projectsSection.value) {
    targets.push($projectsSection.value as HTMLDivElement)
  }
  return targets
})

const observerOptions = {
  root: null,
  rootMargin: '-10% 0px -10% 0px',
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
}

const intersectionRatios = reactive<Record<string, number>>({
  about: 0,
  experience: 0,
  projects: 0
})

const activeNav = computed((oldKey) => {
  let key = 'about'
  let intersectionRatio = 0
  for (const id in intersectionRatios) {
    const _intersectionRatio = intersectionRatios[id]
    if (_intersectionRatio === undefined || _intersectionRatio <= intersectionRatio) {
      continue
    }
    key = id
    intersectionRatio = _intersectionRatio
  }
  if (key === oldKey) {
    return oldKey
  }
  return key
})

const onIntersection = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const id = entry.target.id
    intersectionRatios[id] = entry.intersectionRatio
  }
}

useIntersectionObserver($targets, onIntersection, observerOptions)
</script>

<template>
  <div
    v-if="page"
    class="container landing"
  >
    <header>
      <h1>
        <a href="#about">{{ page.fullname }}</a>
      </h1>
      <h2>{{ page.title }}</h2>
      <p>{{ page.description }}</p>
      <nav>
        <ul>
          <li>
            <a
              href="#about"
              :class="{ active: activeNav === 'about' }"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              :class="{ active: activeNav === 'experience' }"
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#projects"
              :class="{ active: activeNav === 'projects' }"
            >
              Project
            </a>
          </li>
        </ul>
      </nav>
      <ul>
        <li
          v-for="social in page.socials"
          :key="social.name"
          :title="social.name"
        >
          <NuxtLink
            :to="social.url"
            target="_blank"
          >
            <Icon :name="social.icon" />
          </nuxtlink>
        </li>
      </ul>
    </header>
    <main class="landing">
      <ContentRenderer
        v-if="page"
        id="about"
        ref="about-section"
        :value="page"
        tag="section"
        class="about"
      />

      <section
        v-if="experiences"
        id="experience"
        ref="experience-section"
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
          class="more-link"
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
        ref="projects-section"
        class="projects"
      >
        <h3>Projects</h3>
        <article
          v-for="(project, projectIndex) in projects"
          :key="projectIndex"
        >
          <aside>
            <NuxtImg
              :src="project.preview.image.src"
              :alt="project.preview.image.alt"
              width="200"
            />
          </aside>
          <h4>{{ project.title }}</h4>
          <p>{{ project.preview.description }}</p>
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
        <NuxtLink
          v-if="hasMoreProjects"
          to="/projects"
          class="more-link"
        >
          <span>View Full Project Archive</span>
          <Icon name="ri:arrow-right-line" />
        </NuxtLink>
      </section>
    </main>
    <ContentRenderer
      v-if="footer"
      :value="footer"
      tag="footer"
    />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  grid-template-rows: auto auto;
  padding-inline: 3rem 1.8rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

header {
  grid-row: 1 / span 2;
  position: sticky;
  top: 0;
  display: grid;
  grid-template-rows: repeat(3, auto) 1fr auto;
  gap: 1rem;
  height: 100vh;
  min-height: 0;
  padding-block: 6rem;
  box-sizing: border-box;

  p {
    display: block;
    line-height: 1.6em;
    height: fit-content;
    max-width: 20rem;
  }
}

header > ul {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;

  li,
  a {
    display: block;
    height: 1em;
  }
}

nav > ul {
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-rows: 1fr;
  grid-auto-flow: row;
  gap: 2rem;
  margin-block-start: 5rem;

}

main {
  display: grid;
  grid-template-rows: auto;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  gap: 0;
  padding-block: 0 6rem;
}

a {
  border: none;
  color: inherit;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
}

h2 {
  font-size: 1.3rem;
}

p {
  font-size: 1rem;
}

h1,
h2 {
  display: block;
  line-height: 1.2em;
  height: fit-content;
}

nav li a {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  align-items: center;
  color: var(--color);
  text-transform: uppercase;
  width: fit-content;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1rem;

  &:before {
    content: "";
    display: block;
    width: 2rem;
    height: 1px;
    background-color: var(--color);
    transition: width 0.1s ease-in-out;
  }

  &:hover,
  &.active {
    color: var(--color-lighter);

    &:before {
      width: 3.5rem;
      background-color: var(--color-lighter);
    }
  }
}

header > ul li {
  &:hover {
    color: var(--color-lighter);
  }
}

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
    width: 100%;
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

.more-link {
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
  .container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 4rem;
    padding-inline: 0;
    --padding-inline: 3rem;
  }

  header {
    position: relative;
    height: fit-content;
    min-height: unset;
    padding-block: 4rem 0;
    padding-inline: var(--padding-inline);
  }

  main {
    padding-block: 0;
  }

  nav {
    display: none;
  }

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
    margin-inline:  calc(var(--padding-inline) - 1rem);
    padding-inline: 1rem;
  }

  .more-link {
    padding-inline-start: var(--padding-inline);
  }
}

@media(max-width: 768px) {
  .container {
    --padding-inline: 1.5rem;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  h2 {
    font-size: 1.1rem;
  }

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

.container.landing footer {
  padding-block: 0 6rem;
  padding-inline-start: 1.2rem;
  max-width: 19rem;

  p {
    font-size: 0.8rem;
    display: block;
    line-height: 1.6em;
    height: fit-content;
  }
}

@media (max-width: 1024px) {
  .container.landing footer {
    padding-block: 0 4rem;
    padding-inline: var(--padding-inline)
  }

  section.about p {
    padding-inline: var(--padding-inline);
  }

  main.landing h3 {
    display: block;
    position: sticky;
    top: 0;
    border: none;
    color: var(--color-lighter);
    background-color: var(--background-color-transparent);
    padding-block: 1rem;
    margin-inline: 0.5rem;
    padding-inline: calc(var(--padding-inline) - 0.5rem);
    z-index: 1;
    backdrop-filter: blur(8px);
  }
}
</style>
