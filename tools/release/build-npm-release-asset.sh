#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Build one package release archive via pnpm pack.

Usage:
  tools/release/build-npm-release-asset.sh \
    --version <vX.Y.Z> \
    --package-dir <path> \
    [--out-dir <path>] \
    [--repo-root <path>]

Example:
  tools/release/build-npm-release-asset.sh \
    --version v0.1.0 \
    --package-dir . \
    --out-dir dist
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
repo_root_default="$(cd "${script_dir}/../.." && pwd)"

version=""
package_dir=""
out_dir=""
repo_root="${repo_root_default}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      version="${2:-}"
      shift 2
      ;;
    --package-dir)
      package_dir="${2:-}"
      shift 2
      ;;
    --out-dir)
      out_dir="${2:-}"
      shift 2
      ;;
    --repo-root)
      repo_root="${2:-}"
      shift 2
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

[[ -n "${version}" ]] || die "--version is required"
[[ -n "${package_dir}" ]] || die "--package-dir is required"
if [[ "${version}" != v* ]]; then
  die "--version must include the v prefix (example: v0.1.0)"
fi

require_cmd pnpm
require_cmd node

cd "${repo_root}"
if [[ -z "${out_dir}" ]]; then
  out_dir="${repo_root}/dist"
fi
if [[ "${out_dir}" != /* ]]; then
  out_dir="${repo_root}/${out_dir}"
fi
mkdir -p "${out_dir}"

pkg_dir_abs="${repo_root}/${package_dir}"
pkg_json="${pkg_dir_abs}/package.json"
[[ -f "${pkg_json}" ]] || die "package.json not found at ${pkg_json}"

version_nov="${version#v}"
pkg_version="$(node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); process.stdout.write(String(pkg.version || ''));" "${pkg_json}")"
[[ -n "${pkg_version}" ]] || die "failed to resolve version from ${pkg_json}"
if [[ "${pkg_version}" != "${version_nov}" ]]; then
  die "${pkg_json} has version ${pkg_version}, expected ${version_nov}"
fi

pkg_name="$(node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); process.stdout.write(String(pkg.name || ''));" "${pkg_json}")"
[[ -n "${pkg_name}" ]] || die "failed to resolve package name from ${pkg_json}"
filename="$(echo "${pkg_name}" | sed 's|^@||; s|/|-|g')-${pkg_version}.tgz"
rm -f "${out_dir}/${filename}"

cd "${pkg_dir_abs}"
pnpm pack --pack-destination "${out_dir}" >/dev/null

asset_path="${out_dir}/${filename}"
[[ -f "${asset_path}" ]] || die "expected pnpm pack output missing: ${asset_path}"

echo "created ${asset_path}"
