import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const kitBin = join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "svelte-kit.cmd" : "svelte-kit",
);

if (!existsSync(kitBin)) {
  console.log("[prepare] skipping: local svelte-kit is not installed");
  process.exit(0);
}

const sync = spawnSync(kitBin, ["sync"], {
  stdio: "inherit",
  cwd: repoRoot,
});
process.exit(sync.status ?? 1);
