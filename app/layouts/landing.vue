<script setup lang="ts">
import useLandingPage from '~/utils/useLandingPage'

const { data: page } = await useLandingPage()

const { data: footer } = await useAsyncData(
  'footer',
  () => queryCollection('footer').first()
)

const targets = ref<HTMLDivElement[]>([])

onMounted(() => {
  const $about = document.getElementById('about')
  const $experience = document.getElementById('experience')
  const $projects = document.getElementById('projects')
  if ($about) {
    targets.value.push($about as HTMLDivElement)
  }
  if ($experience) {
    targets.value.push($experience as HTMLDivElement)
  }
  if ($projects) {
    targets.value.push($projects as HTMLDivElement)
  }
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

const activeNav = computed(() => {
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
  return key
})

const onIntersection = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const id = entry.target.id
    intersectionRatios[id] = entry.intersectionRatio
  }
}

useIntersectionObserver(targets, onIntersection, observerOptions)
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
    <slot />
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

:slotted(main) {
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

p {
  display: block;
  line-height: 1.6em;
  height: fit-content;
  max-width: 20rem;
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

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 4rem;
    padding-inline: 3rem;
  }

  header {
    position: relative;
    height: fit-content;
    min-height: unset;
    padding-block: 4rem 0;
  }

  :slotted(main) {
    padding-block: 0;
  }

  nav {
    display: none;
  }
}

@media(max-width: 768px) {
  .container {
    padding-inline: 1.5rem;
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
}
</style>

<style>
.container.landing footer {
  padding-block: 0 6rem;

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
  }
}
</style>
