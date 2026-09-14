/* ═══════════════════════════════════════════════════════════════════
   Text overrides.

   content.js holds the deck's structure and its default wording. This
   file is what lets that wording be edited without touching code: every
   editable string has a stable path (`cole.name`, `gated.gates.2.q`),
   and copy.json maps any of those paths to a replacement.

   The live editor writes copy.json. Anything it does not mention keeps
   whatever content.js says, so a half-filled copy.json is safe.
   ═══════════════════════════════════════════════════════════════════ */

const isTodo = v => v && typeof v === 'object' && v.__todo
/* Fields that are structure, not prose — never offered for editing. */
const SKIP = new Set(['type', 'id', 'nav', 'key', 'at', 'src', 'photo', 'photoAlt', 'countTo',
                      'hours', 'finalIndex', 'verified', 'long'])

/** Every editable string, as { path, value, todo }. Roots are the slide
    ids plus `meta`, so a path always starts with something addressable. */
export function walk (deck, meta, chapters) {
  const out = []
  const visit = (node, path) => {
    for (const [k, v] of Object.entries(node)) {
      if (SKIP.has(k)) continue
      const p = path ? `${path}.${k}` : k
      if (isTodo(v)) out.push({ path: p, value: '', todo: v.text })
      else if (typeof v === 'string') out.push({ path: p, value: v, todo: null })
      else if (Array.isArray(v)) v.forEach((x, i) => {
        if (typeof x === 'string') out.push({ path: `${p}.${i}`, value: x, todo: null })
        else if (x && typeof x === 'object') visit(x, `${p}.${i}`)
      })
      else if (v && typeof v === 'object') visit(v, p)
    }
  }
  if (meta) visit(meta, 'meta')
  if (chapters) chapters.forEach((c, i) => visit(c, `chapters.${i}`))
  for (const s of deck) visit(s, s.id)
  return out
}

/** Writes overrides back onto the deck, in place, by path. */
export function applyOverrides (deck, overrides, meta, chapters) {
  if (!overrides) return deck
  const byId = Object.fromEntries(deck.map(s => [s.id, s]))
  if (meta) byId.meta = meta
  if (chapters) byId.chapters = chapters
  for (const [path, value] of Object.entries(overrides)) {
    if (typeof value !== 'string' || !value.trim()) continue   // blank = leave the default alone
    const [id, ...rest] = path.split('.')
    let node = byId[id]
    if (!node) continue
    const last = rest.pop()
    for (const seg of rest) { node = node?.[seg]; if (!node) break }
    // a stale path can land on a string or a missing branch — skip it rather
    // than throw, or one outdated row in the editor takes the whole site down
    if (last != null && node && typeof node === 'object' && last in node) node[last] = value
  }
  return deck
}
