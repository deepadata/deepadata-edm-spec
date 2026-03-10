// scripts/validate-examples.mjs
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "../schema");

// Base URL used in schemas' $id
const SCHEMA_BASE_URL = "https://deepadata.com/schemas/edm/v0.6.0";

// Profile schema mapping
const PROFILE_SCHEMAS = {
  essential: "edm.v0.6.essential.schema.json",
  extended: "edm.v0.6.extended.schema.json",
  full: "edm.v0.6.full.schema.json",
};

// Example files with their expected profile values
const EXAMPLES = [
  { file: "example-essential-profile.json", expectedProfile: "essential" },
  { file: "example-extended-profile.json", expectedProfile: "extended" },
  { file: "example-full-profile.json", expectedProfile: "full" },
];

async function loadFragments(ajv) {
  const fragmentsDir = join(SCHEMA_DIR, "fragments");
  const fragmentFiles = await readdir(fragmentsDir);

  for (const file of fragmentFiles) {
    if (file.endsWith(".json")) {
      const fragmentPath = join(fragmentsDir, file);
      const fragment = JSON.parse(await readFile(fragmentPath, "utf8"));
      // Register with absolute URI matching how schemas reference them
      const absoluteUri = `${SCHEMA_BASE_URL}/fragments/${file}`;
      ajv.addSchema(fragment, absoluteUri);
    }
  }
}

async function loadProfileSchemas(ajv) {
  const validators = {};

  for (const [profile, schemaFile] of Object.entries(PROFILE_SCHEMAS)) {
    const schemaPath = join(SCHEMA_DIR, schemaFile);
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    // Register with absolute URI
    const absoluteUri = `${SCHEMA_BASE_URL}/${schemaFile.replace('.json', '.schema.json').replace('.schema.schema', '.schema')}`;
    ajv.addSchema(schema, schema.$id || absoluteUri);
    validators[profile] = ajv.compile(schema);
  }

  return validators;
}

async function main() {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,  // Allow x_* extension keywords
    allowUnionTypes: true
  });
  addFormats(ajv);

  // Load fragment schemas first
  await loadFragments(ajv);

  // Load and compile profile-specific schemas
  const validators = await loadProfileSchemas(ajv);

  if (EXAMPLES.length === 0) {
    console.log("No example files configured.");
    process.exit(0);
  }

  let failures = 0;
  const examplesDir = join(__dirname, "../examples");

  for (const { file, expectedProfile } of EXAMPLES) {
    const filePath = join(examplesDir, file);
    const data = JSON.parse(await readFile(filePath, "utf8"));

    // Check meta.profile matches expected value first
    const actualProfile = data?.meta?.profile;
    if (actualProfile !== expectedProfile) {
      failures++;
      console.log(`Profile mismatch: ${file}`);
      console.log(`   Expected meta.profile: "${expectedProfile}"`);
      console.log(`   Actual meta.profile: "${actualProfile}"`);
      continue;
    }

    // Get the validator for this profile
    const validate = validators[actualProfile];
    if (!validate) {
      failures++;
      console.log(`No validator for profile: ${actualProfile} in ${file}`);
      continue;
    }

    // Validate against profile-specific schema
    const schemaValid = validate(data);

    if (!schemaValid) {
      failures++;
      console.log(`Schema invalid: ${file} (profile: ${actualProfile})`);
      console.log(
        ajv.errorsText(validate.errors, { separator: "\n  - " })
      );
      continue;
    }

    console.log(`Valid: ${file} (profile: ${actualProfile}, schema: ${PROFILE_SCHEMAS[actualProfile]})`);
  }

  if (failures > 0) {
    console.error(`\n${failures} file(s) failed validation.`);
    process.exit(1);
  } else {
    console.log("\nAll example files are valid against their profile-specific schemas.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
