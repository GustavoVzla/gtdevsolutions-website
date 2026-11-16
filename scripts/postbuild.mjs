// Standalone output does not include public/ or .next/static: copy them next to server.js.
import { cpSync, existsSync } from "node:fs";

const standalone = ".next/standalone";
if (!existsSync(`${standalone}/server.js`)) {
  console.error("postbuild: .next/standalone/server.js not found (is output: 'standalone' set?)");
  process.exit(1);
}
cpSync("public", `${standalone}/public`, { recursive: true });
cpSync(".next/static", `${standalone}/.next/static`, { recursive: true });
console.log("postbuild: copied public/ and .next/static into .next/standalone/");
