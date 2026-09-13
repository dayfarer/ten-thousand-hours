/* Emits the editor's schema: which slides exist, which fields each one
   offers, and a human label for both. Values are NOT included — those
   live in the artifact database, seeded separately. */
import { deck, meta, chapters } from '../src/content.js'
import { walk } from '../src/copy.js'

const LABEL = {
  eyebrow: 'Top-right line', sub: 'Subtitle', unitLine: 'Under the number', numeral: 'Numeral',
  kicker: 'Small label above', kicker2: 'Pull quote', title: 'Headline',
  body: 'Body text', footnote: 'Footnote', name: 'Name', role: 'Line under the name',
  photoCaption: 'Photo caption', note: 'Paragraph underneath', lead: 'Lead-in',
  quote: 'Quote', attribution: 'Signed', punch: 'Closing line', foot: 'Line underneath',
  strike: 'Crossed-out line', replace: 'Replacement line', big: 'Big number',
  small: 'Small print', beat: 'Line under the questions', disclaimer: 'Disclaimer',
  totalLabel: 'Counter label', axisX: 'Bottom axis', axisY: 'Side axis',
  masthead: 'Site title', presenters: 'Presenters', course: 'Class', year: 'Year',
  scrollCue: 'Scroll prompt', chapterLabel: 'Word above chapter numbers',
  k: 'Label', v: 'Value', q: 'Question', cost: 'Price', who: 'Name', what: 'Detail',
  label: 'Label', desc: 'Quote', medium: 'Type', lines: 'Line', accentLines: 'Line (green)',
  accent: 'Last line (green)', questions: 'Question', items: 'Item',
}
/* Always-roomy fields. Short ones like a fact's value get sized by their
   own length instead, so "7" does not sit in a seven-line box. */
const LONG = new Set(['body', 'note', 'quote', 'sub', 'disclaimer', 'punch', 'foot',
                      'beat', 'what', 'kicker2', 'lead', 'small'])

const nice = path => {
  const parts = path.split('.')
  const last = parts[parts.length - 1]
  const n = parts.find(p => /^\d+$/.test(p))
  const base = LABEL[last] || LABEL[parts[parts.length - 2]] || last
  return n != null && !LABEL[last] ? `${base} ${+n + 1}` : n != null ? `${base} ${+n + 1}` : base
}

const groups = []
const push = (id, label) => { groups.push({ id, label, fields: [] }); return groups[groups.length - 1] }
const g = new Map()
g.set('meta', push('meta', 'On every slide'))
g.set('chapters', push('chapters', 'Chapter titles'))
deck.forEach((s, i) => g.set(s.id, push(s.id, `${String(i + 1).padStart(2, '0')} · ${s.nav}`)))

for (const f of walk(deck, meta, chapters)) {
  const root = f.path.split('.')[0]
  const grp = g.get(root)
  if (!grp) continue
  grp.fields.push({
    path: f.path,
    key: f.path.replace(/\./g, '__'),        // db keys cannot carry dots
    label: nice(f.path),
    long: LONG.has(f.path.split('.').pop()),
    todo: f.todo || null,
  })
}
console.log(JSON.stringify({ groups: groups.filter(x => x.fields.length) }))
