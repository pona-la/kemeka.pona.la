import { parse } from "csv-parse/sync";
import fs from "fs";

interface CsvRow {
  submitted: string;
  keyword: string;
  tok: string;
  eng: string;
  examples: string;
}

interface Output {
  keyword: string;
  definitions: {
    tok: string;
    eng: string;
    examples?: {
      tok: string;
      eng: string;
    }[];
  }[];
}

export function processCsv() {
  // Read CSV file
  const fileContent = fs.readFileSync("data/definitions.csv", "utf-8");

  // Parse CSV into objects
  const records: CsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const filtered = records.filter((row) => row.tok !== "" && row.eng !== "");
  const grouped = new Map<string, Output>();

  for (const row of filtered) {
    if (!grouped.has(row.keyword)) {
      grouped.set(row.keyword, {
        keyword: row.keyword,
        definitions: [],
      });
    }

    grouped.get(row.keyword)!.definitions.push({
      tok: row.tok,
      eng: row.eng,
      examples: !row.examples
        ? undefined
        : row.examples.split("\n").map((def) => ({
            tok: def.split(" | ")[0],
            eng: def.split(" | ")[1],
          })),
    });
  }

  // Convert map to array
  return Array.from(grouped.values());
}
