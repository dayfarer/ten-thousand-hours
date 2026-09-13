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
      push('Instrument (italic, after the name)', s.role); push('Photo caption', s.photoCaption)
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

const TITLES = {
  hero: 'Opening', portrait: 'Meet Cole', dramatization: 'The origin story (photo wall)',
  timeline: 'Cole’s timeline', statement: 'Big statement', claim: 'The 10,000-hour claim',
  correction: 'The correction', exhibit: 'Meet Tyler', graph: 'The graph',
  spiral: 'The question spiral', gated: 'The catch', takeaway: 'Cole’s takeaway', close: 'Closing',
}
const titleFor = (s, i) => s.type === 'chapter'
  ? `Slide ${ord(i + 1)} — Chapter ${chapters.find(c => c.id === s.id).numeral}`
  : `Slide ${ord(i + 1)} — ${TITLES[s.type] ?? s.type}`

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

deck.forEach((s, i) => {
  children.push(h(titleFor(s, i), HeadingLevel.HEADING_1))
  children.push(table(rowsFor(s)))
  if (s.type === 'chapter') children.push(note('The list beside it shows all four chapter titles automatically.'))
  if (s.type === 'timeline') children.push(note('The counter climbs as you scroll and ends on the last stop’s hours — that should be Cole’s total.'))
  if (s.type === 'dramatization') children.push(note('“Plate I, II…” numbers are added automatically; the last photo is the flute punchline.'))
  if (s.type === 'spiral') children.push(note('The last question is the punchline — it ends up alone on screen.'))
  if (s.type === 'exhibit') children.push(note('The quote is signed with his name automatically.'))
})

/* The assignment asks for four sections; the deck currently only builds the
   first. Space for the other three, so they can be drafted in the same pass. */
children.push(new Paragraph({ children: [new PageBreak()] }))
children.push(h('Slides that do not exist yet', HeadingLevel.HEADING_1))
p('')
children.push(p('The README checklist lists four sections. The deck covers Section 1. If the rubric wants the other three, sketch them here — rough notes are enough, they can be turned into real slides.', { size: 21 }))
children.push(table([
  row('Section 2 — “Developing Leadership Mindsets”: the connection', '[FILL IN]'),
  row('Section 2 — anything specific from the module to quote', '[FILL IN]'),
  row('Section 3 — how this applies to food insecurity / community service', '[FILL IN]'),
  row('Section 3 — a concrete example or number worth putting on screen', '[FILL IN]'),
  row('Section 4 — professional brand statement for the group', '[FILL IN]'),
]))
children.push(note('These rows are plain text, not slides yet — send back whatever you have and the slides get built around it.'))

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
})
