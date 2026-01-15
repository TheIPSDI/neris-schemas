# NERIS JSON Schemas

[![CI](https://github.com/TheIPSDI/neris-schemas/actions/workflows/ci.yml/badge.svg)](https://github.com/TheIPSDI/neris-schemas/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@ipsdi/neris-schemas.svg)](https://www.npmjs.com/package/@ipsdi/neris-schemas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schema definitions for validating data against the [NERIS (National Emergency Response Information System)](https://github.com/ulfsri/neris-framework) specification.

## Installation

```bash
npm install @ipsdi/neris-schemas
```

## Usage

### Load schemas programmatically

```typescript
import { getSchema, getDepartmentPayloadSchema } from "@ipsdi/neris-schemas";

// Get any schema by name
const schema = getSchema("DepartmentPayload");

// Or use convenience functions
const departmentSchema = getDepartmentPayloadSchema();
```

### Validate with Ajv

```typescript
import Ajv from "ajv";
import { getDepartmentPayloadSchema } from "@ipsdi/neris-schemas";

const ajv = new Ajv();
const validate = ajv.compile(getDepartmentPayloadSchema());

const department = {
  fd_id: "12345",
  name: "Example Fire Department",
  // ...
};

if (validate(department)) {
  console.log("Valid NERIS department data");
} else {
  console.error(validate.errors);
}
```

### TypeScript types

```typescript
import type { DepartmentPayload, StationPayload } from "@ipsdi/neris-schemas/types";
```

### Direct schema import

```typescript
import departmentSchema from "@ipsdi/neris-schemas/v1/DepartmentPayload.json";
```

## Available Schemas

635 schemas are generated from the NERIS OpenAPI specification, including:

- `DepartmentPayload`, `CreateDepartmentPayload`, `DepartmentResponse`
- `StationPayload`, `CreateStationPayload`, `StationResponse`
- `IncidentPayload`, `CreateIncidentPayload`, `IncidentResponse`
- `FirePayload`, `MedicalPayload`, `DispatchPayload`
- Value types: `TypeDeptValue`, `TypeEntityValue`, `TypeUnitValue`, etc.

## Development

```bash
# Install dependencies
npm install

# Generate schemas from NERIS OpenAPI spec
npm run generate

# Generate TypeScript types
npm run generate:types

# Build package
npm run build

# Lint and typecheck
npm run lint
```

## License

MIT
