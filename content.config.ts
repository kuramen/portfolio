import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'landing.md',
      schema: z.object({
        fullname: z.string(),
        title: z.string(),
        description: z.string(),
        resume: z.string().url(),
        socials: z.array(z.object({
          name: z.string(),
          url: z.string(),
          icon: z.string()
        }))
      })
    }),
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: createImageSchema(),
        technologies: z.array(z.string()),
        date: z.date()
      })
    }),
    experiences: defineCollection({
      type: 'data',
      source: 'experiences/*.md',
      schema: z.object({
        position: z.string().nonempty(),
        company: z.string().nonempty(),
        location: z.string().nonempty(),
        description: z.string().nonempty(),
        technologies: z.array(z.string()),
        startDate: z.date(),
        endDate: z.date().optional()
      })
    })
  }
})
