# Google YouTube (`orbit google youtube` / `orbit google youtube-data`)

![YouTube](/docs/images/integrations/youtube.svg)

`orbit google youtube` provides a YouTube Data API v3 command family with vault-compatible credential resolution, multi-account context, and both API-key and OAuth modes.
`orbit google youtube-data` is an alias with identical behavior.

Related:
- [Integrations Overview](./INTEGRATIONS_OVERVIEW)
- [Providers](./PROVIDERS)

## Auth Modes
- `api-key`: public/read operations
- `oauth`: private/mutation operations (channel/video edits, uploads, subscriptions, comments, live, captions, thumbnails)

## Environment Model
- Supported environments: `prod`, `staging`, `dev`
- `test` is intentionally unsupported

## Credential Keys
Per-account defaults:
- `GOOGLE_<ACCOUNT>_YOUTUBE_API_KEY`
- `GOOGLE_<ACCOUNT>_YOUTUBE_CLIENT_ID`
- `GOOGLE_<ACCOUNT>_YOUTUBE_CLIENT_SECRET`
- `GOOGLE_<ACCOUNT>_YOUTUBE_REDIRECT_URI`
- `GOOGLE_<ACCOUNT>_YOUTUBE_ACCESS_TOKEN`
- `GOOGLE_<ACCOUNT>_YOUTUBE_REFRESH_TOKEN`

Per-account per-env overrides:
- `GOOGLE_<ACCOUNT>_PROD_YOUTUBE_API_KEY`
- `GOOGLE_<ACCOUNT>_STAGING_YOUTUBE_API_KEY`
- `GOOGLE_<ACCOUNT>_DEV_YOUTUBE_API_KEY`
- `GOOGLE_<ACCOUNT>_PROD_YOUTUBE_REFRESH_TOKEN`
- `GOOGLE_<ACCOUNT>_STAGING_YOUTUBE_REFRESH_TOKEN`
- `GOOGLE_<ACCOUNT>_DEV_YOUTUBE_REFRESH_TOKEN`

Global fallbacks:
- `GOOGLE_YOUTUBE_API_KEY`
- `GOOGLE_YOUTUBE_CLIENT_ID`
- `GOOGLE_YOUTUBE_CLIENT_SECRET`
- `GOOGLE_YOUTUBE_REDIRECT_URI`
- `GOOGLE_YOUTUBE_ACCESS_TOKEN`
- `GOOGLE_YOUTUBE_REFRESH_TOKEN`

OAuth login cache file:
- `~/.si/google/youtube/oauth_tokens.json`

## Core Commands
```bash
# auth/context
orbit google youtube auth status --account core --mode api-key
orbit google youtube auth login --account core --mode oauth
orbit google youtube auth logout --account core --mode oauth
orbit google youtube context list
orbit google youtube context current
orbit google youtube context use --account core --env prod --mode oauth
orbit google youtube doctor --account core --mode oauth

# discovery
orbit google youtube search list --query "engineering vlog" --type video
orbit google youtube support languages
orbit google youtube support regions
orbit google youtube support categories --region US

# resources
orbit google youtube channel list --id <channel_id>
orbit google youtube channel mine --mode oauth
orbit google youtube video list --id <video_id>
orbit google youtube video upload --mode oauth --file ./clip.mp4 --title "Demo" --privacy unlisted
orbit google youtube video rate --mode oauth --id <video_id> --rating like
orbit google youtube playlist create --mode oauth --title "Sandbox"
orbit google youtube playlist-item add --mode oauth --playlist-id <playlist_id> --video-id <video_id>
orbit google youtube subscription list --mode oauth --mine
orbit google youtube comment thread create --mode oauth --video-id <video_id> --text "Nice work"
orbit google youtube caption upload --mode oauth --video-id <video_id> --file ./captions.vtt --language en
orbit google youtube caption download --mode oauth --id <caption_id> --output ./captions.vtt
orbit google youtube thumbnail set --mode oauth --video-id <video_id> --file ./thumb.jpg
orbit google youtube live broadcast list --mode oauth
orbit google youtube live stream list --mode oauth
orbit google youtube live chat list --mode oauth --live-chat-id <chat_id>

# observability and fallback
orbit google youtube report usage --since 2026-02-08T00:00:00Z
orbit google youtube raw --method GET --path /youtube/v3/search --param part=id --param q=music
```

## Notes
- `--json` is strict JSON output.
- `--raw` prints raw response body.
- API and OAuth errors are normalized and redacted before printing.
- Video upload supports resumable mode by default (`--resumable=true`).
