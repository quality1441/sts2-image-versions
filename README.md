# sts2-image-versions

Versioned reference data for *Slay the Spire 2* game images and attributes. Images are reconstructed from the game itself and are not exact duplicates. I have done my best to make images as close as possible so that content creators can use them for their videos and streams.

**sts2-image-versions** keeps a durable, browsable history so anyone can look up *which image belonged to which game version*, without digging through local extract folders or old VODs.

## Who this is for: 
myself first but also .... other content creators, wiki authors, or people with an interest in the historical evolution of STS2.

## My plan

Maintain a copy of assets with the meta-data of those assets for each stable release. 

I do not plan to capture beta builds. Why? It takes a considerable amount of time to do capture each version.

### Reference by game version

When art, names, or card text change between patches, tools and wikis need a stable source of truth per version. Each top-level folder (for example `v0.103.2/`) is a snapshot aligned to a specific STS2 build. You can diff folders across versions, pin a tool to a release, or link documentation to an exact patch.

Content types are organized starting with **cards**, and expanding to **potions**, **relics**, and other item kinds as they are published here.

### Content creator overlay

This repo also backs a [**content-creation overlay**](https://github.com/quality1441/sts2-stream-overlay) for STS2 streamers and video creators that is under development. During live streams or recordings, the overlay can show card art, names, descriptions, and related details on screen so viewers can read them **after** the moment has passed, extremely useful when gameplay moves quickly and chat-only explanations disappear. 

I have been creating sts2 videos as time permits and been slowed by the editting effort involved. I like to display each item (card, relic, potion) on the screen _after_ the selection has been made in a larger format for the viewer to see the details. The [**content-creation overlay**](https://github.com/quality1441/sts2-stream-overlay) I am working on will do that automatically while i play the game, saving me multiple hours of editing per video.

The overlay is meant to complement gameplay, not replace it: persistent, accurate visuals tied to the same versioned data this repository stores.

## Repository layout

```
v<game-version>/
  cards/           # Card metadata and references
  potions/         # Potion metadata and references
  relics/          # Relics metadata and references
  item-index.json  # Catalog of all images in the set. Consumed by [Stream Overlay](https://github.com/quality1441/sts2-stream-overlay) project.
  ...
```

- **Version folders** — Named after the game build (e.g. `v0.103.2/`). Add a new folder when a new patch is extracted and validated.
- **Images** — Combined card art is stored as **WebP** under `cards/`, `potions/`, and `relics/`.
  
## Who might use this

- **Content creators** — Overlays, panels, and “last seen card” style widgets for streams and YouTube.
- **Tool and wiki authors** — Stable URLs and metadata per patch.
- **Researchers and dataminers** — Compare how icons and text changed between versions.
- **Viewers** — Indirectly, via creators and sites that reference this data.

## Disclaimer

*Slay the Spire 2* and related trademarks are property of Mega Crit Games. This project is a fan/community resource and is **not** affiliated with or endorsed by Mega Crit. Use game assets and data in line with applicable terms and fair-use norms for your use case.

## Contributing

I am not looking for collaborators at this time but if you have suggestions, please feel free to share.
