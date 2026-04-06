#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Publish the package using an npm token resolved through SI Vault.

Usage:
  tools/release/npm/publish-npm-from-vault.sh \
    [--env-file <path>] \
    [--token-key <key>] \
    [--version <vX.Y.Z>] \
    [--repo-root <path>] \
    [--tag <dist-tag>] \
    [--dry-run]

Defaults:
  --env-file   /home/shawn/Development/safe/svelta-docs/.env.prod
  --token-key  NPM_TOKEN
  --repo-root  Auto-detected from script location
  --tag        latest

Notes:
  - The env file should contain an encrypted SI Vault entry for the token key.
  - This script never prints the token value.
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

env_file="/home/shawn/Development/safe/svelta-docs/.env.prod"
token_key="NPM_TOKEN"
repo_root="${repo_root_default}"
version=""
dist_tag="latest"
dry_run=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      env_file="${2:-}"
      shift 2
      ;;
    --token-key)
      token_key="${2:-}"
      shift 2
      ;;
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
require_cmd bash
require_cmd "${repo_root}/tools/release/npm/publish-npm-package.sh"
require_cmd /home/shawn/Development/si/si
[[ -f "${env_file}" ]] || die "vault env file not found: ${env_file}"

cmd=("${repo_root}/tools/release/npm/publish-npm-package.sh" --repo-root "${repo_root}" --tag "${dist_tag}")
if [[ -n "${version}" ]]; then
  cmd+=(--version "${version}")
fi
if [[ "${dry_run}" -eq 1 ]]; then
  cmd+=(--dry-run)
fi

/home/shawn/Development/si/si vault run --env-file "${env_file}" -- \
  bash -c '
    set -euo pipefail
    token_key="$1"
    shift
    token="${!token_key:-}"
    if [[ -z "${token}" ]]; then
      echo "error: missing ${token_key} in vault environment" >&2
      exit 1
    fi
    export NODE_AUTH_TOKEN="${token}"
    "$@"
  ' _ "${token_key}" "${cmd[@]}"
