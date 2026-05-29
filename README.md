# sts2-image-versions

Versioned reference data for *Slay the Spire 2* game images. Currrently only cards but soon to hopefully include potions and relics—as they appear in each game patch. The card images are reconstructed from the game itself and are not exact duplicates. I have done my best to make them as close as possible so that content creators can use them for their videos and streams.

**sts2-image-versions** keeps a durable, browsable history so anyone can look up *which image belonged to which game version*, without digging through local extract folders or old VODs.

## What this is for: content creators, wiki authors, historical interests as STS2 evolves

### Reference by game version

When art, names, or card text change between patches, tools and wikis need a stable source of truth per version. Each top-level folder (for example `v0.103.2/`) is a snapshot aligned to a specific STS2 build. You can diff folders across versions, pin a tool to a release, or link documentation to an exact patch.

Content types are organized the same way the extract pipeline does—starting with **cards**, and expanding to **potions**, **relics**, and other item kinds as they are published here.

### Content creator overlay

This repo also backs a **content-creation overlay** for STS2 streamers and video creators that is current in development. During live streams or recordings, the overlay can show card art, names, descriptions, and related details on screen so viewers can read them **after** the moment has passed—useful when gameplay moves quickly and chat-only explanations disappear.

The overlay is meant to complement gameplay, not replace it: persistent, accurate visuals tied to the same versioned data this repository stores.

## Repository layout

```
v<game-version>/
  cards/           # Card metadata and references (as published)
  ...
```

- **Version folders** — Named after the game build (e.g. `v0.103.2/`). Add a new folder when a new patch is extracted and validated.
- **Images** — Full asset trees may be omitted from git where they are large or regenerated; see `.gitignore`. Metadata still records canonical paths and cache-busting query parameters for icons as produced by the extract pipeline.

Some paths are intentionally excluded from version control (sample cards, deprecated entries, and other non-shipping content). See `.gitignore` for the current rules.

## Relationship to sts2-image-extract

| Repository | Role |
|------------|------|
| **sts2-image-versions** (this repo) | Published, version-tagged snapshots for the community, overlays, and downstream tools. |

Typical flow: run or update the extract project for a new patch → copy or publish the resulting tree into a new `v*` folder here → commit so consumers can pin to that tag or folder.

## Who might use this

- **Content creators** — Overlays, panels, and “last seen card” style widgets for streams and YouTube.
- **Tool and wiki authors** — Stable URLs and metadata per patch.
- **Researchers and dataminers** — Compare how icons and text changed between versions.
- **Viewers** — Indirectly, via creators and sites that reference this data.

## Disclaimer

*Slay the Spire 2* and related trademarks are property of Mega Crit Games. This project is a fan/community resource and is **not** affiliated with or endorsed by Mega Crit. Use game assets and data in line with applicable terms and fair-use norms for your use case.

## Contributing

If you maintain the extract pipeline or overlay: open issues or pull requests for missing versions, incorrect metadata, or `.gitignore` adjustments. When adding a version, prefer a single folder per game build and a short note in the PR describing the patch source (build number or release date).
