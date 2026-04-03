#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Build pnpm release archives and checksums.

Usage:
  tools/release/build-npm-release-assets.sh \
    [--version <vX.Y.Z>] \
    [--out-dir <path>] \
    [--repo-root <path>]

Defaults:
  --version   Parsed from package.json
  --out-dir   <repo-root>/dist
  --repo-root Auto-detected from script location
USAGE
}

die() {
  echo "error: $*" >&2
  exit 1
}

checksum_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1"
    return 0
  fi
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1"
    return 0
  fi
  die "missing checksum command: need sha256sum or shasum"
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root_default="$(cd "${script_dir}/../.." && pwd)"

version=""
out_dir=""
repo_root="${repo_root_default}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      version="${2:-}"
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

cd "${repo_root}"
[[ -f "package.json" ]] || die "package.json not found (bad --repo-root?)"

if [[ -z "${version}" ]]; then
  version="$(node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); process.stdout.write('v' + String(pkg.version || ''));")"
fi
[[ -n "${version}" ]] || die "failed to resolve version from package.json"
if [[ "${version}" != v* ]]; then
  die "resolved version must include v prefix, got: ${version}"
fi

if [[ -z "${out_dir}" ]]; then
  out_dir="${repo_root}/dist"
fi
mkdir -p "${out_dir}"

packages=(
  "."
)

for package_dir in "${packages[@]}"; do
  tools/release/build-npm-release-asset.sh \
    --version "${version}" \
    --package-dir "${package_dir}" \
    --out-dir "${out_dir}" \
    --repo-root "${repo_root}"
done

version_nov="${version#v}"
expected_files=(
  "aureuma-svelta-docs-${version_nov}.tgz"
)

for f in "${expected_files[@]}"; do
  [[ -f "${out_dir}/${f}" ]] || die "missing expected release archive: ${out_dir}/${f}"
done

checksums_path="${out_dir}/checksums.txt"
(
  cd "${out_dir}"
  : > checksums.txt
  for f in "${expected_files[@]}"; do
    checksum_file "${f}" >> checksums.txt
  done
)

echo "created release archives:"
for f in "${expected_files[@]}"; do
  echo "  - ${out_dir}/${f}"
done
echo "created checksums:"
echo "  - ${checksums_path}"
