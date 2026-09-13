/* Builds the live copy editor as a standalone page.
   Schema + current wording are embedded; the artifact database holds only
   what people change, which is exactly what copy.data.js overrides. */
import { writeFileSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { deck, meta, chapters } from '../src/content.js'
import { walk } from '../src/copy.js'

const schema = JSON.parse(execSync('node scripts/editor-schema.mjs', { encoding: 'utf8' }))
const defaults = Object.fromEntries(walk(deck, meta, chapters).map(f => [f.path, f.value]))
const tpl = readFileSync(new URL('./editor.template.html', import.meta.url), 'utf8')
const out = new URL('../editor.html', import.meta.url).pathname
writeFileSync(out, tpl.replace('"__DATA__"', JSON.stringify({ ...schema, defaults })))
const n = schema.groups.reduce((a, g) => a + g.fields.length, 0)
console.log(`wrote ${out} — ${schema.groups.length} groups, ${n} fields`)
