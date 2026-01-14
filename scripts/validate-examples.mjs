// scripts/validate-examples.mjs
import { readFile } from "node:fs/promises";
import { globby } from "globby";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const SCHEMA_PATH = new URL("../schema/edm.v0.4.schema.json", import.meta.url);

async function main() {
  const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf8"));

  const ajv = new Ajv({
    allErrors: true,
    strict: true,
    allowUnionTypes: true
  });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const files = await globby("examples/*.ddna.json");

  if (files.length === 0) {
    console.log("ℹ️  No example files found in examples/*.ddna.json");
    process.exit(0);
  }

  let failures = 0;

  for (const f of files) {
    const data = JSON.parse(await readFile(f, "utf8"));
    const ok = validate(data);
    if (ok) {
      console.log(`✅ Valid: ${f}`);
    } else {
      failures++;
      console.log(`❌ Invalid: ${f}`);
      console.log(
        ajv.errorsText(validate.errors, { separator: "\n  - " })
      );
    }
  }

  if (failures > 0) {
    console.error(`\n✖ ${failures} file(s) failed validation.`);
    process.exit(1);
  } else {
    console.log("\n All example files are valid against edm.v0.4.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
