<script setup>
const { data: projects } = await useAsyncData(
  'projects',
  () => queryCollection('projects').order('date', 'DESC').all()
)
</script>

<template>
  <div class="container projects">
    <header>
      <p class="breadcrumb">
        <Icon name="ri:arrow-left-line" />
        <NuxtLink to="/">Clément Brunie</NuxtLink>
      </p>
      <h1>All Projects</h1>
    </header>
    <main v-if="projects">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Project</th>
            <th>Made at</th>
            <th>Built with</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
          >
            <td>
              <time :datetime="project.date">{{ new Date(project.date).getFullYear() }}</time>
            </td>
            <td>
              <p class="title">
                {{ project.title }}
              </p>
              <NuxtLink
                v-if="project.repo ?? project.link"
                class="title link"
                :to=" project.repo ?? project.link"
                target="_blank"
                external
              >
                <span>{{ project.title }}</span>
                <Icon name="ri:arrow-right-up-line" />
              </NuxtLink>
            </td>
            <td>
              <p class="made-at">
                {{ project.madeAt }}
              </p>
            </td>
            <td>
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
                    <Icon
                      v-if="technologies[technologie].icon"
                      :name="technologies[technologie].icon"
                    />
                    <span>{{ technologie }}</span>
                  </NuxtLink>
                  <p v-else>
                    {{ technologie }}
                  </p>
                </li>
              </ul>
            </td>
            <td>
              <ul class="links">
                <li v-if="project.link">
                  <NuxtLink
                    class="link"
                    :to="project.link"
                    target="_blank"
                    external
                  >
                    <span>{{ project.link.replace('https://', '').replace('http://', '') }}</span>
                    <Icon name="ri:arrow-right-up-line" />
                  </NuxtLink>
                </li>
                <li v-if="project.repo">
                  <NuxtLink
                    class="link repo"
                    :to="project.repo"
                    target="_blank"
                    external
                  >
                    <Icon name="ri:github-fill" />
                    <span>{{ project.repo.replace('https://github.com/', '') }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto 1fr;
  padding-inline: 3rem;
  gap: 5rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
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

table {
  border-collapse: collapse;
  text-align: left;
  width: 100%;
  color: var(--color-light);
}

thead {
  position: sticky;
  top: 0;
  color: var(--color-lighter);
  background-color: var(--background-color-transparent);
  backdrop-filter: blur(8px);
}

tbody tr {
  border-top: 1px solid var(--color);
}

td {
  padding-block: 1rem;
  padding-inline-end: 1rem;
  font-size: 0.9rem;
}

th {
  padding-block: 1rem;
  padding-inline-end: 2rem;
  text-align: left;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 600;
}

time,
.made-at {
  font-size: 0.8rem;
  font-weight: 300;
  white-space: nowrap;
}

.technologies {
  min-width: 0;
  max-width: 25rem;
}

.links {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 0.5rem;
  align-items: center;
}

.link {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.2rem;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-light);
  transition: color 0.3s ease-in-out;
  width: fit-content;

  &:hover {
    color: var(--color-lighter);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.title {
  color: var(--color-lighter);
  white-space: nowrap;
  font-weight: 600;

  &.link {
    display: none;
    border: none;
    color: var(--color-lighter);

    &:hover {
      color: var(--color-light);
    }
  }
}

@media (max-width: 1024px) {
  tr td,
  tr th {
    &:nth-child(3),
    &:nth-child(4) {
     display: none;
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding-inline: 1.5rem;
    gap: 3rem;
  }

  header {
    padding-block-start: 3rem;
  }
}

@media (max-width: 640px) {
  tr td,
  tr th {
    &:nth-child(5) {
     display: none;
    }
  }

  header h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  .title {
    &:has( + .link) {
      display: none;
    }

    &.link {
      display: grid;
    }
  }
}
</style>
