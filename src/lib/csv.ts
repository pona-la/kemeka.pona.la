import { parse } from "csv-parse/sync";
import fs from "fs";
import { marked } from "marked";

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

function replaceMdLinks(text: string) {
  const link_replacer = (_: any, text: string) =>
    `[${text}](/?q=${text.replaceAll(" ", "_")})`;
  return text.replaceAll(/\[([^\]]+)\](?!\()/g, link_replacer);
}

function mdInline(text: string) {
  return marked.parseInline(replaceMdLinks(text), { async: false });
}

function mdBlock(text: string) {
  return marked.parse(replaceMdLinks(text), { async: false });
}

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
      const note = notes.find((note) => note.keyword == row.keyword)?.notes;
      entries.set(row.keyword, {
        keyword: row.keyword,
        definitions: [],
        notes: note ? mdBlock(note) : undefined,
      });
    }

    // Add row to dictionary entry
    entries.get(row.keyword)!.definitions.push({
      tok: mdInline(row.tok),
      eng: mdInline(row.eng),
      pos: row.pos,
      enumeration: row.enumeration,
      examples: row.examples
        ? row.examples
            .trim()
            .split("\n")
            .map((def) => {
              const [tok, eng] = def.split(" | ").map(mdInline);
              return { tok, eng };
            })
        : undefined,
    });
  }

  // Convert map to array
  return Array.from(entries.values());
}
