/* ═══════════════════════════════════════════════════════════════════
   ALL COPY LIVES HERE. Edit this file to change the presentation.
   Nothing in render.js / main.js needs touching to swap words.

   *asterisks* make words italic.
   TODO() marks something only you can supply. Anything wrapped in it
   renders with a dashed amber outline on screen so gaps are obvious
   while you build — they disappear once you replace the text.
   ═══════════════════════════════════════════════════════════════════ */

export const TODO = t => ({ __todo: true, text: t })

export const meta = {
  masthead: 'Ten Thousand Hours',     // top of the opening and closing slides
  presenters: TODO('Presenter name(s)'),
  course: TODO('Class / course'),
  year: 'MMXXVI',
  scrollCue: 'Scroll',
  chapterLabel: 'Chapter',
}

/* Chapter skeleton — "Master" is Cole's chapter, not a prefix. */
export const chapters = [
  { id: 'ch-1', numeral: 'I',   title: 'Master',        sub: 'A person who did the hours' },
  { id: 'ch-2', numeral: 'II',  title: 'The Number',    sub: 'Where 10,000 came from' },
  { id: 'ch-3', numeral: 'III', title: 'The Separator', sub: 'Why the same hours diverge' },
  { id: 'ch-4', numeral: 'IV',  title: 'The Content',   sub: 'What actually filled them' },
]

export const deck = [

  /* ─── opening ────────────────────────────────────────────────── */
  {
    type: 'hero',
    id: 'hero',
    nav: 'Open',
    eyebrow: 'A presentation on mastery',
    countTo: 10000,
    unitLine: 'hours to master',
    sub: 'It is the most quoted number in self-improvement. It is also not what the research said.',
  },

  /* ─── I — MASTER ─────────────────────────────────────────────── */
  { type: 'chapter', id: 'ch-1', nav: 'I · Master' },

  {
    type: 'portrait',
    id: 'cole',
    nav: 'Cole',
    kicker: 'Exhibit the First',
    name: TODO('Cole — full name'),
    role: 'flute',
    photoCaption: 'Photograph of Cole',
    facts: [
      { k: 'Started', v: TODO('age / year') },
      { k: 'Years in', v: TODO('e.g. 11') },
      { k: 'Est. hours', v: TODO('e.g. 4,000') },
    ],
    note: 'She did not set out to do ten thousand hours. Nobody does. They just keep showing up.',
  },

  {
    type: 'dramatization',
    id: 'dramatization',
    nav: 'Origin story',
    kicker: 'Archival footage, absent',
    title: 'The origin story we do not have',
    sub: 'Cole has no video of the first time she picked up a flute. So this is a dramatization.',
    /* Prints on the wall — each develops in as you scroll.
       To use real photos: put them in /public/drama/ and set
       src: '/drama/1.jpg'. Until then a placeholder is drawn. */
    frames: [
      { title: 'Child, age seven, discovering woodwind', medium: 'Stock photograph', note: 'Dramatization', src: '' },
      { title: 'Not Cole', medium: 'Stock photograph', note: 'Licensed, 2019', src: '' },
      { title: 'A different child entirely', medium: 'Stock photograph', note: 'Also licensed', src: '' },
      { title: 'Woman, thirties, portraying “mother”', medium: 'Paid actor', note: 'Day rate undisclosed', src: '' },
      { title: 'Also not Cole', medium: 'Stock photograph', note: 'We checked', src: '' },
      { title: 'Flute', medium: 'Object', note: 'Verified accurate', verified: true, src: '' },
    ],
    disclaimer:
      'No footage of young Cole exists. These children are not Cole. ' +
      'They are not related to Cole. We are legally required to say that.',
  },

  {
    type: 'timeline',
    id: 'timeline',
    nav: 'Timeline',
    kicker: 'The record, as kept',
    title: 'What the hours looked like',
    totalLabel: 'Hours accumulated',
    /* `hours` accumulates on screen as you scroll through the track */
    stops: [
      { year: TODO('year'), hours: 120,  title: TODO('First lesson'),      body: TODO('One line about it.') },
      { year: TODO('year'), hours: 400,  title: TODO('Joined band'),       body: TODO('One line about it.') },
      { year: TODO('year'), hours: 900,  title: TODO('First solo'),        body: TODO('One line about it.') },
      { year: TODO('year'), hours: 1800, title: TODO('First audition'),    body: TODO('One line about it.') },
      { year: TODO('year'), hours: 3000, title: TODO('Milestone'),         body: TODO('One line about it.') },
      { year: TODO('year'), hours: 4200, title: TODO('Where she is now'),  body: TODO('One line about it.') },
    ],
  },

  {
    type: 'statement',
    id: 'cliffhanger',
    nav: 'Hold on',
    lines: ['Before we get to', 'what Cole learned,'],
    accentLines: ['we need to talk', 'about a number.'],
  },

  /* ─── II — THE NUMBER ────────────────────────────────────────── */
  { type: 'chapter', id: 'ch-2', nav: 'II · The Number' },

  {
    type: 'claim',
    id: 'outliers',
    nav: 'Outliers',
    kicker: 'Malcolm Gladwell, Outliers, 2008',
    big: '10,000',
    title: 'The magic number of greatness',
    body: 'Study the Beatles, Bill Gates, elite violinists — and you find the same figure. ' +
          'Roughly ten thousand hours of practice separates the great from everyone else.',
    footnote: 'This is the version everybody remembers.',
  },

  {
    type: 'correction',
    id: 'correction',
    nav: 'The correction',
    kicker: 'Anders Ericsson — the researcher Gladwell cited',
    strike: 'Ten thousand hours of practice.',
    replace: 'Ten thousand hours of *deliberate* practice.',
    body: 'Ericsson spent years objecting to the popular version. The hours were never the mechanism. ' +
          'What mattered was practice designed to fix what you are bad at — with feedback, at the edge of your ability.',
    kicker2: 'The number is a container. It says nothing about what you put in it.',
  },

  {
    type: 'exhibit',
    id: 'tyler',
    nav: 'Tyler',
    kicker: 'Exhibit the Second',
    name: 'Tyler',
    role: 'Rainbow Six Siege',
    countTo: 2500,
    unit: 'hours',
    quote: TODO("Tyler's exact quote — the “still trash” line, verbatim"),
    rank: TODO('actual rank'),
    rankLabel: 'Current rank',
    punch: 'Twenty-five percent of the way to mastery. Zero percent of the way to good.',
  },

  {
    type: 'statement',
    id: 'why',
    nav: 'Why?',
    lines: ['So why is Tyler'],
    accentLines: ['still bad at Siege?'],
    small: 'He has the hours. He does not have the thing the hours were supposed to contain.',
  },

  /* ─── III — THE SEPARATOR ────────────────────────────────────── */
  { type: 'chapter', id: 'ch-3', nav: 'III · The Separator' },

  {
    type: 'graph',
    id: 'graph',
    nav: 'The graph',
    kicker: 'Plate III — the whole argument',
    title: 'Same hours. *Different curves.*',
    axisX: 'Hours invested',
    axisY: 'Actual skill',
    curves: [
      { key: 'casual',  label: 'Casual',   desc: '"I might as well."' },
      { key: 'obsessed', label: 'Obsessed', desc: '"What else is there?"' },
    ],
    markers: [
      { key: 'casual',   at: 2500, label: 'Tyler',     note: '2,500 hrs · plateaued' },
      { key: 'obsessed', at: 4200, label: 'Cole',      note: 'still climbing' },
    ],
    gapLabel: 'This gap is the presentation',
    foot: 'Both of them showed up. Only one of them was practising.',
  },

  {
    type: 'spiral',
    id: 'spiral',
    nav: 'The questions',
    kicker: 'Marginalia — what obsession sounds like',
    title: 'The obsessed player does not just play more',
    sub: 'They interrogate everything. It starts reasonable.',
    questions: [
      'Which strategies actually work?',
      'Which ones only look like they work?',
      'What are the optimal peek angles?',
      'Which movement tech makes me harder to hit?',
      'Am I holding the wrong angles on defense?',
      'Is my sensitivity costing me flicks?',
      'Is my mouse polling rate too low?',
      'Is my monitor adding input lag?',
      'What temperature should my room be to lock in?',
      'Am I playing worse after 9pm?',
      'How far am I from the nearest server?',
      'Should I move house for better ping?',
    ],
    finalIndex: 11,
    beat: 'And that is the one that gives it away.',
  },

  {
    type: 'gated',
    id: 'gated',
    nav: 'The catch',
    kicker: 'Outliers — the part nobody quotes',
    title: 'Every question has an answer. The answers cost money.',
    body: 'Gladwell’s real argument was never about effort. It was about access — ' +
          'being born at the right time, near the right people, with the right door unlocked.',
    gates: [
      { q: 'A better monitor?',        cost: TODO('cost') },
      { q: 'A coach who reviews VOD?', cost: TODO('cost') },
      { q: 'Move closer to a server?', cost: TODO('cost') },
      { q: 'A flute that stays in tune?', cost: TODO('cost') },
      { q: 'A teacher, once a week, for eleven years?', cost: TODO('cost') },
      { q: 'Someone free to drive you there?', cost: 'Priceless / unbuyable' },
    ],
    examples: [
      { who: 'Bill Gates', what: 'a school with a computer terminal in 1968 — almost nobody had one' },
      { who: 'The Beatles', what: 'Hamburg: eight hours a night, seven nights a week, for two years' },
    ],
    punch: 'Obsession is the separator. *Resources are the ceiling.*',
  },

  /* ─── IV — THE CONTENT ───────────────────────────────────────── */
  { type: 'chapter', id: 'ch-4', nav: 'IV · The Content' },

  {
    type: 'takeaway',
    id: 'takeaway',
    nav: 'Cole',
    kicker: 'Back to Cole',
    lead: 'So we asked her what all that time actually taught her.',
    quote: TODO("Cole's takeaway — what she learned about learning. This is the line the whole deck lands on."),
    attribution: TODO('Cole — full name'),
  },

  {
    type: 'close',
    id: 'close',
    nav: 'End',
    lines: ['Hours are the', 'container.'],
    accent: 'You choose the content.',
  },
]
