---
title: Vault
description: Dotenv secret encryption moved to its own repo and binary.
---

# Vault

Dotenv secret encryption is **no longer part of `si`**. It lives in its own
repository and ships as a standalone `vault` binary:

- Repo: [github.com/Aureuma/vault](https://github.com/Aureuma/vault)
- Docs: `docs/VAULT.md` in that repo

## What changed

| Before | Now |
| --- | --- |
| `si vault <cmd>` (alias `si creds`) | `vault <cmd>` |
| `encrypted:si-vault:<b64>` values | `encrypted:vault:<b64>` |
| `SI_VAULT_PUBLIC_KEY` header | `VAULT_PUBLIC_KEY` |
| `~/.si/vault/si-vault-keyring.json` | `~/.vault/keyring.json` |
| `SI_VAULT_KEYRING_FILE` | `VAULT_KEYRING_FILE` |

Legacy-format files are **refused**, not read; `vault migrate` relabels them
in place (without re-encrypting) and is the only code that understands the
old labels.

## What stayed in `si`

`si fort` — the wrapper over the [fort](https://github.com/Aureuma/fort)
policy API — is unchanged and remains the path for operator and workload
secret access. See [Fort](./FORT).
