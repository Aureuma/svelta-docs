const userAgent = process.env.npm_config_user_agent ?? "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("error: this repo is managed with pnpm; use `corepack pnpm install`.");
  process.exit(1);
}
