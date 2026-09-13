/* Generates deck-text.docx — a fill-in copy of every editable line in the deck.
   Reads src/content.js, so the document can never drift from the site.

     npm run deck-doc

   Fill the right-hand column in Word, send it back, and the answers map
   straight onto src/content.js by their labels. */

import { writeFileSync } from 'node:fs'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, WidthType, ShadingType, BorderStyle, AlignmentType, PageBreak,
} from 'docx'
import { deck, chapters, meta } from '../src/content.js'

const isTodo = v => v && typeof v === 'object' && v.__todo
const LABEL_W = 3100, VALUE_W = 6260, TABLE_W = LABEL_W + VALUE_W

/* ── one row: human label on the left, the text to edit on the right ── */
const row = (label, value) => {
  const blank = isTodo(value)
  const text = blank ? `[FILL IN: ${value.text}]` : String(value ?? '')
  return new TableRow({
    children: [
      new TableCell({
        width: { size: LABEL_W, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 19, color: '555555' })] })],
      }),
      new TableCell({
        width: { size: VALUE_W, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        shading: blank ? { type: ShadingType.CLEAR, fill: 'FFF3C4' } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text, size: 21, bold: blank, color: blank ? '8A6100' : '000000' })],
        })],
      }),
    ],
  })
}

const table = rows => new Table({
  columnWidths: [LABEL_W, VALUE_W],
  width: { size: TABLE_W, type: WidthType.DXA },
  borders: {
    top:   { style: BorderStyle.SINGLE, size: 2, color: 'D8D4CA' },
    bottom:{ style: BorderStyle.SINGLE, size: 2, color: 'D8D4CA' },
    left:  { style: BorderStyle.SINGLE, size: 2, color: 'D8D4CA' },
    right: { style: BorderStyle.SINGLE, size: 2, color: 'D8D4CA' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E8E5DD' },
    insideVertical:   { style: BorderStyle.SINGLE, size: 2, color: 'E8E5DD' },
  },
  rows,
})

const h  = (text, level) => new Paragraph({ text, heading: level, spacing: { before: 320, after: 140 } })
const p  = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120 },
  children: [new TextRun({ text, size: opts.size ?? 21, italics: opts.italics, color: opts.color, bold: opts.bold })],
})
const note = text => p(text, { size: 18, italics: true, color: '777777' })

/* ── per-slide labels, phrased for a human rather than a key path ── */
const ord = n => String(n).padStart(2, '0')

function rowsFor (s) {
  const r = []
  const push = (l, v) => r.push(row(l, v))
  switch (s.type) {
    case 'hero':
      push('Top right', s.eyebrow)
      push('Big number (counts up to)', s.countTo.toLocaleString('en-US'))
      push('Under the number', s.unitLine)
      push('Subtitle', s.sub)
      break
    case 'chapter': {
      const c = chapters.find(x => x.id === s.id)
      push('Chapter number', c.numeral); push('Chapter title', c.title); push('Chapter subtitle', c.sub)
      break
    }
    case 'portrait':
      push('Label above name', s.kicker); push('Name', s.name)
      push('Line under the name', s.role)
      if ('photo' in s) push('Photo file (in public/)', s.photo)
      push('Photo caption', s.photoCaption)
      s.facts.forEach((f, i) => { push(`Fact ${i + 1} label`, f.k); push(`Fact ${i + 1} value`, f.v) })
      push('Quote under the facts', s.note)
      break
    case 'dramatization':
      push('Label above headline', s.kicker); push('Headline', s.title); push('Subtitle', s.sub)
      s.frames.forEach((f, i) => {
        push(`Photo ${i + 1} caption`, f.title); push(`Photo ${i + 1} type`, f.medium); push(`Photo ${i + 1} note`, f.note)
      })
      push('Disclaimer under the wall', s.disclaimer)
      break
    case 'timeline':
      push('Label above headline', s.kicker); push('Headline', s.title); push('Counter label', s.totalLabel)
      s.stops.forEach((t, i) => {
        push(`Stop ${i + 1} year`, t.year); push(`Stop ${i + 1} hours (number)`, t.hours)
        push(`Stop ${i + 1} title`, t.title); push(`Stop ${i + 1} one line`, t.body)
      })
      break
    case 'statement':
      s.lines.forEach((l, i) => push(`Line ${i + 1}`, l))
      s.accentLines.forEach((l, i) => push(`Line ${s.lines.length + i + 1} (green italic)`, l))
      if (s.small) push('Small print underneath', s.small)
      break
    case 'claim':
      push('Source line', s.kicker); push('Big number', s.big); push('Headline', s.title)
      push('Body', s.body); push('Footnote', s.footnote)
      break
    case 'correction':
      push('Source line', s.kicker); push('Crossed-out line', s.strike); push('Replacement line', s.replace)
      push('Body', s.body); push('Pull quote', s.kicker2)
      break
    case 'exhibit':
      push('Label above name', s.kicker); push('Name', s.name); push('Game (under the name)', s.role)
      push('Big number (counts up to)', s.countTo.toLocaleString('en-US')); push('Word after the number', s.unit)
      push('Punchline', s.punch); push('Rank box label', s.rankLabel); push('Rank', s.rank); push('Quote', s.quote)
      break
    case 'graph':
      push('Label above headline', s.kicker); push('Headline', s.title)
      s.curves.forEach((c, i) => { push(`Legend ${i + 1} name`, c.label); push(`Legend ${i + 1} quote`, c.desc) })
      s.markers.forEach((m, i) => { push(`Dot ${i + 1} name`, m.label); push(`Dot ${i + 1} note`, m.note) })
      push('Label on the gap between the lines', s.gapLabel)
      push('Bottom axis label', s.axisX); push('Side axis label', s.axisY)
      push('Line under the graph', s.foot)
      break
    case 'spiral':
      push('Label above headline', s.kicker); push('Headline', s.title); push('Subtitle', s.sub)
      s.questions.forEach((q, i) => push(`Question ${i + 1}`, q))
      push('Line under the final question', s.beat)
      break
    case 'gated':
      push('Label above headline', s.kicker); push('Headline', s.title)
      s.gates.forEach((g, i) => { push(`Cost ${i + 1} question`, g.q); push(`Cost ${i + 1} price`, g.cost) })
      push('Paragraph beside the costs', s.body)
      s.examples.forEach((e, i) => { push(`Example ${i + 1} who`, e.who); push(`Example ${i + 1} what`, e.what) })
      push('Closing line', s.punch)
      break
    case 'takeaway':
      push('Label at the top', s.kicker); push('Lead-in', s.lead)
      push('Cole’s quote', s.quote); push('Signed', s.attribution)
      break
    case 'close':
      s.lines.forEach((l, i) => push(`Line ${i + 1}`, l))
      push(`Line ${s.lines.length + 1} (green italic)`, s.accent)
      break
  }
  return r
}

/* Slide types are reused (two `gated`, two `takeaway`, two `portrait`), so the
   heading comes from each slide's own nav label rather than its type. */
const titleFor = (s, i) => s.type === 'chapter'
  ? `Slide ${ord(i + 1)} — Chapter ${chapters.find(c => c.id === s.id).numeral}`
  : `Slide ${ord(i + 1)} — ${s.nav}`

/* Every content-bearing key each slide type puts in the document. Anything a
   slide carries that is not listed here is copy that would silently never
   reach the page, so it is reported and appended rather than dropped. */
const STRUCTURAL = ['type', 'id', 'nav']
const HANDLED = {
  hero: ['eyebrow', 'countTo', 'unitLine', 'sub'],
  chapter: [],
  portrait: ['kicker', 'name', 'role', 'photo', 'photoCaption', 'facts', 'note'],
  dramatization: ['kicker', 'title', 'sub', 'frames', 'disclaimer'],
  timeline: ['kicker', 'title', 'totalLabel', 'stops'],
  statement: ['lines', 'accentLines', 'small'],
  claim: ['kicker', 'big', 'title', 'body', 'footnote'],
  correction: ['kicker', 'strike', 'replace', 'body', 'kicker2'],
  exhibit: ['kicker', 'name', 'role', 'countTo', 'unit', 'punch', 'rankLabel', 'rank', 'quote'],
  graph: ['kicker', 'title', 'curves', 'markers', 'gapLabel', 'axisX', 'axisY', 'foot'],
  spiral: ['kicker', 'title', 'sub', 'questions', 'finalIndex', 'beat'],
  gated: ['kicker', 'title', 'gates', 'body', 'examples', 'punch'],
  takeaway: ['kicker', 'lead', 'quote', 'attribution'],
  close: ['lines', 'accent'],
}
const unhandledKeys = s => Object.keys(s)
  .filter(k => !STRUCTURAL.includes(k) && !(HANDLED[s.type] ?? []).includes(k))

/* ── count what is still unfilled, so the top of the doc says so ── */
let blanks = 0
const countBlanks = o => {
  for (const v of Object.values(o)) {
    if (isTodo(v)) blanks++
    else if (Array.isArray(v)) v.forEach(x => x && typeof x === 'object' && countBlanks(x))
    else if (v && typeof v === 'object') countBlanks(v)
  }
}
countBlanks(meta); deck.forEach(countBlanks)

/* ── assemble ── */
const children = [
  new Paragraph({ text: 'Ten Thousand Hours', heading: HeadingLevel.TITLE }),
  p('Every word on every slide. Edit the right-hand column, then send this file back.', { size: 22 }),
  p(`${blanks} highlighted blanks still need real information.`, { size: 22, bold: true, color: '8A6100' }),
  new Paragraph({ spacing: { after: 200 }, children: [] }),
  p('Keep the left-hand labels exactly as they are — that is how each line finds its way back to the right slide.', { size: 20 }),
  p('Wrap words in *asterisks* to make them italic.', { size: 20 }),
  p('Want more or fewer photos, timeline stops, questions or costs? Add or delete rows and the layout will be reworked to match.', { size: 20 }),
  p('Slide numbers match the counter in the bottom-left corner of the site.', { size: 20, after: 300 }),

  h('On every slide', HeadingLevel.HEADING_1),
  table([
    row('Title (first and last slide)', meta.masthead),
    row('Presenter(s)', meta.presenters),
    row('Class', meta.course),
    row('Year', meta.year),
    row('Scroll prompt', meta.scrollCue),
    row('Word above each chapter number', meta.chapterLabel),
    row('Running-hours label (right edge)', 'Hours'),
  ]),
]

const missed = []
deck.forEach((s, i) => {
  children.push(h(titleFor(s, i), HeadingLevel.HEADING_1))
  const rows = rowsFor(s)
  for (const k of unhandledKeys(s)) {
    missed.push(`${s.id}.${k}`)
    if (typeof s[k] !== 'object') rows.push(row(k, s[k]))
  }
  children.push(table(rows))
  if (s.type === 'chapter') children.push(note(`The list beside it shows all ${chapters.length} chapter titles automatically.`))
  if (s.type === 'timeline') children.push(note('The counter climbs as you scroll and ends on the last stop’s hours — that should be Cole’s total.'))
  if (s.type === 'dramatization') children.push(note('“Plate I, II…” numbers are added automatically; the last photo is the flute punchline.'))
  if (s.type === 'spiral') children.push(note('The last question is the punchline — it ends up alone on screen.'))
  if (s.type === 'exhibit') children.push(note('The quote is signed with his name automatically.'))
})

/* Sections 1 and 3-5 have slides. Section 2 has none, so it gets drafting
   space here; these rows are notes, not a slide, until they come back filled. */
children.push(new Paragraph({ children: [new PageBreak()] }))
children.push(h('Section 2 — the slide that does not exist yet', HeadingLevel.HEADING_1))
children.push(p('The assignment asks you to connect the Outliers lesson to the LinkedIn Learning module “Developing Leadership Mindsets”. Nothing in the deck does that yet — it is the only section without slides.', { size: 21 }))
children.push(p('Rough notes are enough. Send them back and they get built into a chapter that sits between the argument and the food-security section.', { size: 21, after: 200 }))
children.push(table([
  row('Which mindset from the module you are using', '[FILL IN]'),
  row('How it connects to hours vs. deliberate practice', '[FILL IN]'),
  row('A line from the module worth putting on screen', '[FILL IN]'),
  row('Where it shows up in your own group', '[FILL IN]'),
]))
children.push(note('Delete any row you do not want and the slide gets built around what is left.'))

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 52, bold: true, font: 'Georgia' }, paragraph: { spacing: { after: 160 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Georgia', color: '2A2A2A' },
        paragraph: { spacing: { before: 360, after: 140 } } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children,
  }],
})

const out = new URL('../deck-text.docx', import.meta.url).pathname
Packer.toBuffer(doc).then(buf => {
  writeFileSync(out, buf)
  console.log(`wrote ${out} — ${deck.length} slides, ${blanks} blanks`)
  if (missed.length) {
    console.warn(`\n${missed.length} field(s) not in the label map — add them to HANDLED and rowsFor():`)
    missed.forEach(m => console.warn('  ' + m))
  }
})
