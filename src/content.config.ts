import { defineCollection, z } from "astro:content";
import { processCsv } from "./lib/csv";

const contentSchema = z.object({
  title: z.string(),
  definitions: z
    .array(
      z.object({
        tok: z.string(),
        eng: z.string(),
        examples: z
          .array(
            z.object({
              tok: z.string(),
              eng: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

// export const collections = {
//   content: defineCollection({
//     loader: glob({ base: "./content/", pattern: "**/*.{md,mdx}" }),
//     schema: contentSchema,
//   }),
// };

export const collections = {
  content: defineCollection({
    loader: async () => {
      const data = processCsv();
      console.log(data);
      return data.map((row) => ({
        id: row.keyword,
        title: row.keyword,
        definitions: row.definitions,
      }));
    },
    schema: contentSchema,
  }),
};
