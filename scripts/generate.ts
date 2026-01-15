#!/usr/bin/env tsx
/**
 * NERIS Schema Generator
 *
 * Fetches the OpenAPI 3.1 spec and extracts schemas.
 * OpenAPI 3.1 schemas are JSON Schema draft 2020-12 compatible.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { parse as parseYaml } from "yaml";

const OPENAPI_URL =
  process.env.NERIS_OPENAPI_URL ||
  "https://api-test.neris.fsri.org/v1/openapi.yaml";

const OUTPUT_DIR = join(dirname(import.meta.dirname), "schemas", "v1");

// Convert OpenAPI $refs to local file refs
function convertRefs(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertRefs);
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" && typeof value === "string") {
      // #/components/schemas/Foo -> ./Foo.json
      result[key] = value.replace("#/components/schemas/", "./") + ".json";
    } else {
      result[key] = convertRefs(value);
    }
  }
  return result;
}

async function main() {
  console.log(`Fetching OpenAPI spec from ${OPENAPI_URL}...`);

  const response = await fetch(OPENAPI_URL);
  const yaml = await response.text();
  const spec = parseYaml(yaml);

  if (spec.info) {
    console.log(`OpenAPI ${spec.openapi} - ${spec.info.title} v${spec.info.version}`);
  }

  const schemas = spec.components?.schemas || {};
  const schemaNames = Object.keys(schemas);

  console.log(`Extracting ${schemaNames.length} schemas...`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const name of schemaNames) {
    const converted = convertRefs(schemas[name]) as Record<string, unknown>;
    const schema = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: `https://schemas.neris.fsri.org/v1/${name}.json`,
      ...converted,
    };

    writeFileSync(
      join(OUTPUT_DIR, `${name}.json`),
      JSON.stringify(schema, null, 2) + "\n"
    );
  }

  console.log(`Written ${schemaNames.length} schemas to ${OUTPUT_DIR}`);
}

main().catch(console.error);
