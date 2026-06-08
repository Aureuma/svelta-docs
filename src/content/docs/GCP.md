# GCP Command Guide (`orbit gcp`)

![Google Cloud](/docs/images/integrations/gcp.svg)

`orbit gcp` covers Google Cloud Service Usage, IAM, API keys, Gemini (Generative Language), and Vertex AI.

Related:
- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

## Auth and context

```bash
orbit gcp auth status --project <project_id>
orbit gcp context list
orbit gcp context current
orbit gcp context use --account core --project <project_id> --token-env GOOGLE_OAUTH_ACCESS_TOKEN --api-key-env GEMINI_API_KEY
orbit gcp doctor --project <project_id>
```

## Service Usage

```bash
orbit gcp service enable --name aiplatform.googleapis.com --project <project_id>
orbit gcp service disable --name generativelanguage.googleapis.com --project <project_id>
orbit gcp service get --name serviceusage.googleapis.com --project <project_id>
orbit gcp service list --project <project_id> --filter state:ENABLED
```

## IAM

```bash
orbit gcp iam service-account list --project <project_id>
orbit gcp iam service-account get <email> --project <project_id>
orbit gcp iam service-account create --project <project_id> --account-id app-bot --display-name "App Bot"
orbit gcp iam service-account-key list --project <project_id> --service-account <email>
orbit gcp iam policy get --project <project_id>
orbit gcp iam role list
```

## API keys

```bash
orbit gcp apikey list --project <project_id>
orbit gcp apikey get <key_id> --project <project_id>
orbit gcp apikey create --project <project_id> --display-name "gemini-client"
orbit gcp apikey update <key_id> --project <project_id> --display-name "gemini-client-v2"
orbit gcp apikey delete <key_id> --project <project_id> --force
```

## Gemini text and embeddings

```bash
orbit gcp gemini models list --api-key $GEMINI_API_KEY
orbit gcp gemini models get gemini-2.5-flash --api-key $GEMINI_API_KEY
orbit gcp gemini generate --api-key $GEMINI_API_KEY --model gemini-2.5-flash --prompt "Draft release notes"
orbit gcp gemini embed --api-key $GEMINI_API_KEY --model text-embedding-004 --text "search phrase"
orbit gcp gemini count-tokens --api-key $GEMINI_API_KEY --model gemini-2.5-flash --text "hello world"
orbit gcp gemini batch-embed --api-key $GEMINI_API_KEY --model text-embedding-004 --text "one" --text "two"
```

## Gemini image generation

```bash
orbit gcp gemini image generate \
  --api-key $GEMINI_API_KEY \
  --model gemini-2.5-flash-image \
  --prompt "Create a transparent PNG hero illustration for si CLI" \
  --transparent \
  --output assets/images/si-hero.png
```

Notes:

- Default image model is `gemini-2.5-flash-image`.
- Auth can come from `--api-key`, account-scoped `GCP_<ACCOUNT>_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_API_KEY`, or OAuth access token.

## Vertex AI

```bash
orbit gcp vertex model list --project <project_id> --location us-central1
orbit gcp vertex endpoint list --project <project_id> --location us-central1
orbit gcp vertex endpoint predict <endpoint_id> --project <project_id> --location us-central1 --instances-json '[{"content":"hello"}]'
orbit gcp vertex batch list --project <project_id> --location us-central1
orbit gcp vertex pipeline list --project <project_id> --location us-central1
orbit gcp vertex operation list --project <project_id> --location us-central1
```

## AI umbrella alias

```bash
orbit gcp ai gemini generate --api-key $GEMINI_API_KEY --prompt "hello"
orbit gcp ai vertex batch list --project <project_id> --location us-central1
```

## Raw escape hatches

```bash
orbit gcp raw --project <project_id> --method GET --path /v1/projects/<project_id>/services
orbit gcp gemini raw --api-key $GEMINI_API_KEY --method GET --path /v1beta/models
orbit gcp vertex raw --project <project_id> --location us-central1 --method GET --path /v1/projects/<project_id>/locations/us-central1/models
```
