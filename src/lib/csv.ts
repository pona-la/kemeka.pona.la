import { parse } from "csv-parse/sync";
import fs from "fs";

interface CsvDefs {
  "times asked": string;
  submitted: string;
  keyword: string;
  pos: string;
  enumeration: string;
  tok: string;
  eng: string;
  examples: string;
}
interface CsvNotes {
  submitted: string;
  keyword: string;
  notes: string;
}

interface Output {
  keyword: string;
  definitions: {
    tok: string;
    eng: string;
    pos: string;
    enumeration: string;
    examples?: {
      tok: string;
      eng: string;
    }[];
  }[];
  notes?: string;
}

const fromCsv = <T>(path: string) =>
  parse<T>(fs.readFileSync(path, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

export function processCsv() {
  // Parse CSV
  let notes = fromCsv<CsvNotes>("data/notes.csv");
  let defs = fromCsv<CsvDefs>("data/definitions.csv");
  defs = defs.filter(
    (row) => row.tok !== "" && row.eng !== "" && row.examples !== "",
  );

  const entries = new Map<string, Output>();

  for (const row of defs) {
    // Initialise dictionary entry
    if (!entries.has(row.keyword)) {
      entries.set(row.keyword, {
        keyword: row.keyword,
        definitions: [],
        notes: notes.find((note) => note.keyword == row.keyword)?.notes,
      });
    }

    // Add row to dictionary entry
    entries.get(row.keyword)!.definitions.push({
      tok: row.tok,
      eng: row.eng,
      pos: row.pos,
      enumeration: row.enumeration,
      examples: !row.examples
        ? undefined
        : row.examples
            .trim()
            .split("\n")
            .map((def) => ({
              tok: def.split(" | ")[0],
              eng: def.split(" | ")[1],
            })),
    });
  }

  // Convert map to array
  return Array.from(entries.values());
}
