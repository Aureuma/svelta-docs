#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Publish the package to npmjs with pnpm.

Usage:
  tools/release/npm/publish-npm-package.sh \
    [--version <vX.Y.Z>] \
    [--repo-root <path>] \
    [--tag <dist-tag>] \
    [--dry-run]

Defaults:
  --repo-root  Auto-detected from script location
  --tag        latest

Notes:
  - Requires NODE_AUTH_TOKEN or NPM_TOKEN in the environment.
  - Use --dry-run to validate packaging without publishing.
USAGE
}

die() {
  echo "error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing required command: $1"
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root_default="$(cd "${script_dir}/../../.." && pwd)"

repo_root="${repo_root_default}"
version=""
dist_tag="latest"
dry_run=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root)
      repo_root="${2:-}"
      shift 2
      ;;
    --version)
      version="${2:-}"
      shift 2
      ;;
    --tag)
      dist_tag="${2:-}"
      shift 2
      ;;
    --dry-run)
      dry_run=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

require_cmd corepack
require_cmd node

cd "${repo_root}"
[[ -f package.json ]] || die "package.json not found in repo root: ${repo_root}"

pkg_name="$(node -p 'require("./package.json").name')"
pkg_version="$(node -p 'require("./package.json").version')"
[[ -n "${pkg_name}" ]] || die "failed to resolve package name"
[[ -n "${pkg_version}" ]] || die "failed to resolve package version"

if [[ -n "${version}" ]]; then
  [[ "${version}" == v* ]] || die "--version must include the v prefix (example: v0.1.0)"
  expected_version="${version#v}"
  [[ "${expected_version}" == "${pkg_version}" ]] || die "package.json has version ${pkg_version}, expected ${expected_version}"
fi

token="${NODE_AUTH_TOKEN:-${NPM_TOKEN:-}}"
if [[ -z "${token}" ]]; then
  if [[ "${dry_run}" -eq 0 ]]; then
    die "NODE_AUTH_TOKEN or NPM_TOKEN must be set"
  fi
  echo "warning: running dry-run without npm token" >&2
fi

cmd=(corepack pnpm publish --access public --tag "${dist_tag}" --no-git-checks)
if [[ "${dry_run}" -eq 1 ]]; then
  cmd+=(--dry-run)
fi

echo "publishing ${pkg_name}@${pkg_version}"
if [[ "${dry_run}" -eq 1 ]]; then
  echo "mode: dry-run"
fi

"${cmd[@]}"
