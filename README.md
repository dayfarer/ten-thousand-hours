# Ten Thousand Hours

Scroll presentation on mastery and the 10,000-hour rule (*Outliers*, ch. 1–3).
Live: https://ten-thousand-hours.bongakiddo.workers.dev

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. Arrow keys / space step through slides.

## Deploy

Hosted on Cloudflare Workers (static assets, config in `wrangler.toml`).

```bash
npm run deploy
```

Builds `dist/` and uploads it. Needs `npx wrangler login` on the Cloudflare account once.

## Where things live

| To change | Edit |
|---|---|
| Any words on any slide | The live editor (below), or `src/content.js` directly (`*asterisks*` = italics, `TODO()` = blank to fill) |
| Slide layouts | `src/render.js` |
| Colours, fonts, grain | `src/style.css` (`--grain` sets grain strength) |
| Scroll, transitions, animation | `src/main.js` |
| One-page-per-scroll behaviour | `src/gate.js` |

`deck-text.docx` is a fill-in copy of every line of text, for writing copy outside the code.
It is generated from `src/content.js`, so regenerate it rather than editing it in place:

```bash
npm run deck-doc
```

Fill in the highlighted cells, send the file back, and the answers get applied to `src/content.js`.

## Editing the words without touching code

Everyone on the team can edit every line of the site from one page:

```bash
npm run editor      # rebuilds editor.html from the current deck
```

Claude publishes `editor.html` as an artifact. Edits save live for the whole
group and land in the artifact's database — nothing is written to the repo
until someone asks Claude to **pull the copy**, which runs:

```bash
npm run pull-copy <dir>   # database export -> src/copy.data.js
```

`copy.data.js` maps field paths (`cole.name`, `gated.gates.2.q`) to
replacements. `content.js` keeps the default wording and applies those
overrides on top, so an empty box in the editor means "leave it as it is"
and a stale path is ignored rather than breaking the build.

## Assignment checklist

- [x] Section 1 — one major lesson from *Outliers* (ch. 1–3)
- [ ] Section 2 — connect it to the LinkedIn Learning module "Developing Leadership Mindsets"
- [x] Section 3 — how it applies to food insecurity and/or community service
- [x] Section 4 — a professional brand statement for the group as student leaders
