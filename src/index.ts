/**
 * NERIS JSON Schemas
 *
 * JSON Schema definitions for validating NERIS data.
 * Generated from the NERIS OpenAPI 3.1 specification.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = join(__dirname, "..", "schemas", "v1");

/**
 * Load a schema by name
 */
export function getSchema(name: string): object {
  const path = join(schemasDir, `${name}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

/**
 * Base URL for schema $id references
 */
export const SCHEMA_BASE_URL = "https://schemas.neris.fsri.org/v1";

/**
 * Path to schemas directory
 */
export const schemasPath = schemasDir;

// Convenience exports for common schemas
export const getDepartmentPayloadSchema = () => getSchema("DepartmentPayload");
export const getCreateDepartmentPayloadSchema = () => getSchema("CreateDepartmentPayload");
export const getStationPayloadSchema = () => getSchema("StationPayload");
export const getIncidentPayloadSchema = () => getSchema("IncidentPayload");
export const getFirePayloadSchema = () => getSchema("FirePayload");
export const getMedicalPayloadSchema = () => getSchema("MedicalPayload");

export default {
  getSchema,
  schemasPath,
  SCHEMA_BASE_URL,
};
