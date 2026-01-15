#!/usr/bin/env tsx
/**
 * Generate TypeScript types from JSON schemas
 *
 * This script compiles all schemas into a single combined schema to avoid
 * duplicate type definitions when schemas reference shared types.
 */

import { compile } from "json-schema-to-typescript";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const SCHEMAS_DIR = join(dirname(import.meta.dirname), "schemas", "v1");
const OUTPUT_FILE = join(dirname(import.meta.dirname), "dist", "types.d.ts");

async function main() {
  console.log("Generating TypeScript types from JSON schemas...");

  // Ensure dist directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Load all schemas into a combined schema with $defs
  const schemaFiles = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".json"));
  const definitions: Record<string, unknown> = {};

  for (const file of schemaFiles) {
    const name = file.replace(".json", "");
    const schemaPath = join(SCHEMAS_DIR, file);
    try {
      const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
      // Remove $schema and $id as they'll be in the combined schema
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { $schema, $id, ...rest } = schema;
      definitions[name] = rest;
    } catch (err) {
      console.warn(`  Skipping ${file}: ${(err as Error).message}`);
    }
  }

  // Create a combined schema with all definitions
  const combinedSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://schemas.neris.fsri.org/v1/all.json",
    $defs: definitions,
  };

  // Convert internal $refs from ./Name.json to #/$defs/Name
  const schemaStr = JSON.stringify(combinedSchema).replace(
    /"\$ref"\s*:\s*"\.\/([^"]+)\.json"/g,
    '"$ref": "#/$defs/$1"'
  );
  const resolvedSchema = JSON.parse(schemaStr);

  // Compile the combined schema
  const ts = await compile(resolvedSchema, "NERIS", {
    bannerComment: "",
    additionalProperties: false,
    unreachableDefinitions: true,
  });

  // Add header and write
  const output = [
    "// Auto-generated TypeScript types from NERIS JSON Schemas",
    "// Do not edit manually",
    "",
    ts,
  ].join("\n");

  writeFileSync(OUTPUT_FILE, output);
  console.log(`Written types to ${OUTPUT_FILE}`);
  console.log(`Generated types for ${Object.keys(definitions).length} schemas`);
}

main().catch(console.error);
