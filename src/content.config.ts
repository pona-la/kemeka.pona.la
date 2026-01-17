import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { processCsv } from "./lib/csv";

const dictionarySchema = z.object({
  title: z.string(),
  definitions: z
    .array(
      z.object({
        tok: z.string(),
        eng: z.string(),
        pos: z.string(),
        enumeration: z.string(),
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
  notes: z.string().optional(),
});

// export const collections = {
//   content: defineCollection({
//     loader: glob({ base: "./content/", pattern: "**/*.{md,mdx}" }),
//     schema: contentSchema,
//   }),
// };

export const aboutSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const collections = {
  dictionary: defineCollection({
    loader: async () => {
      const data = processCsv();
      console.log(data.length);
      // console.log(data.find((row) => row.keyword == "chess"));
      // console.log("['" + data.map((row) => row.keyword).join("', '") + "']");
      return data.map((row) => ({
        id: row.keyword,
        title: row.keyword,
        definitions: row.definitions,
        notes: row.notes,
      }));
    },
    schema: dictionarySchema,
  }),
  content: defineCollection({
    loader: glob({ base: "./content/", pattern: "**/*.{md,mdx}" }),
    schema: aboutSchema,
  }),
};
