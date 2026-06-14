import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

if (!targetVersion) {
	console.error("npm_package_version is not set. Run via `npm version <patch|minor|major>`.");
	process.exit(1);
}

// Read manifest.json, update version, write back
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));
console.log(`manifest.json → version: ${targetVersion}`);

// Add new version entry to versions.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
console.log(`versions.json → ${targetVersion}: ${minAppVersion}`);
