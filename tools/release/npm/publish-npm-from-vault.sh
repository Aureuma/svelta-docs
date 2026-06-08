#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Publish the package using a package token resolved through Fort.

 Usage:
  tools/release/npm/publish-package-from-vault.sh \
    [--env-file <path>] \
    [--fort-repo <repo>] \
    [--fort-env <env>] \
    [--token-key <key>] \
    [--version <vX.Y.Z>] \
    [--repo-root <path>] \
    [--tag <dist-tag>] \
    [--dry-run]

Defaults:
  --env-file   Accepted for compatibility only; Fort is used instead
  --fort-repo  svelta-docs
  --fort-env   prod
  --token-key  NPM_TOKEN
  --repo-root  Auto-detected from script location
  --tag        latest

Notes:
  - The token key must be available through Fort for the selected repo/env.
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

env_file=""
fort_repo="svelta-docs"
fort_env="prod"
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
    --fort-repo)
      fort_repo="${2:-}"
      shift 2
      ;;
    --fort-env)
      fort_env="${2:-}"
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
require_cmd "${repo_root}/tools/release/npm/publish-package-package.sh"
require_cmd /home/shawn/Development/si/si
if [[ -n "${env_file}" ]]; then
  echo "warning: --env-file is ignored; Fort repo/env selection is used instead" >&2
fi

cmd=("${repo_root}/tools/release/npm/publish-package-package.sh" --repo-root "${repo_root}" --tag "${dist_tag}")
if [[ -n "${version}" ]]; then
  cmd+=(--version "${version}")
fi
if [[ "${dry_run}" -eq 1 ]]; then
  cmd+=(--dry-run)
fi

/home/shawn/Development/si/si fort run --repo "${fort_repo}" --env "${fort_env}" --mode env --keys "${token_key}" -- \
  bash -c '
    set -euo pipefail
    token_key="$1"
    shift
    token="${!token_key:-}"
    if [[ -z "${token}" ]]; then
      echo "error: missing ${token_key} in Fort environment" >&2
      exit 1
    fi
    export NODE_AUTH_TOKEN="${token}"
    "$@"
  ' _ "${token_key}" "${cmd[@]}"
