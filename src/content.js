/* ═══════════════════════════════════════════════════════════════════
   ALL COPY LIVES HERE. Edit this file to change the presentation.
   Nothing in render.js / main.js needs touching to swap words.

   *asterisks* make words italic.
   TODO() marks something only you can supply. Anything wrapped in it
   renders with a dashed amber outline on screen so gaps are obvious
   while you build — they disappear once you replace the text.

   ONE LESSON: hours do not teach you, feedback does — and feedback is
   bought. Every chapter is one section of the assignment, in order.

   Everything attributed to Cole is quoted from what she actually wrote
   in the group chat. Do not smooth her wording out; the register is
   the point.
   ═══════════════════════════════════════════════════════════════════ */

import { applyOverrides } from './copy.js'
import overrides from './copy.data.js'

export const TODO = t => ({ __todo: true, text: t })

export const meta = {
  masthead: 'Ten Thousand Hours',     // top of the opening and closing slides
  presenters: 'Collin, Bryan, Bonga, Eduard, and Cole',
  course: 'Power of Food',
  year: 'MMXXVI',
  scrollCue: 'Scroll',
  chapterLabel: 'Chapter',
}

/* Four chapters, four sections of the assignment. */
export const chapters = [
  { id: 'ch-1', numeral: 'I',   title: 'The Lesson',  sub: 'Section 1 — one lesson from Outliers' },
  { id: 'ch-2', numeral: 'II',  title: 'The Mindset', sub: 'Section 2 — Developing Leadership Mindsets' },
  { id: 'ch-3', numeral: 'III', title: 'The Table',   sub: 'Section 3 — food insecurity' },
  { id: 'ch-4', numeral: 'IV',  title: 'The Brand',   sub: 'Section 4 — who we are becoming' },
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
    sub: 'It is the most quoted number in self-improvement. It is also the wrong unit.',
  },

  /* ═══ I — THE LESSON · Section 1 ═════════════════════════════ */
  { type: 'chapter', id: 'ch-1', nav: 'I · The Lesson' },

  {
    type: 'claim',
    id: 'outliers',
    nav: 'The claim',
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
    replace: 'Ten thousand hours of *being corrected*.',
    body: 'Ericsson spent years objecting to the popular version. The hours were never the mechanism. ' +
          'What mattered was practice at the edge of your ability with someone telling you, immediately, ' +
          'what you just got wrong. Take the feedback out and the hours do nothing.',
    kicker2: 'The hours are a container. Feedback is what has to be inside them.',
  },

  {
    type: 'statement',
    id: 'slope',
    nav: 'Duration vs slope',
    lines: ['The rule counts hours.', 'Hours are a duration.'],
    accentLines: ['Skill is a slope.'],
    small: 'Everything after this slide is about the second one.',
  },

  {
    type: 'portrait',
    id: 'cole',
    nav: 'Cole',
    kicker: 'Exhibit the First — a rising slope',
    name: 'Cole',
    role: 'flute',
    photo: '/cole.jpg',
    photoCaption: 'Photograph of Cole',
    facts: [
      { k: 'Started', v: 'Age 11, 6th grade' },
      { k: 'Years in', v: '7' },
      { k: 'Est. hours', v: '4,200' },
      { k: 'Corrected by a teacher', v: 'Every week' },
    ],
    note: 'She owns two flutes and has named them both — Stephanie and Serenity. One is “made from your ' +
          'basic metals used in cheap jewelry.” The other has a sterling silver headjoint, shaped to her ' +
          'own mouth. *Eight hundred dollars, and ten thousand.*',
  },

  /* The booklet is the single best piece of evidence in the project:
     deliberate practice as a physical object, with the feedback loop
     printed into the instructions. */
  {
    type: 'plate',
    id: 'scales',
    nav: 'The booklet',
    kicker: 'Plate II — deliberate practice, as printed',
    title: 'This is what filled the hours',
    photo: '/scales-page.jpg',
    photoCaption: 'Flute Scale Studies · organized by Mr. Bryan McCall II',
    items: [
      { k: 'Section 1', v: 'Long Tones — “hold the note until the director signals you to the next note”' },
      { k: 'Section 2', v: 'FBA Style' },
      { k: 'Section 3', v: 'Thirds' },
      { k: 'Section 4', v: 'Clark Flexibilities' },
      { k: 'Section 5', v: 'Articulation — slur two, tongue two; tongue all; slur up, tongue down' },
      { k: 'Section 6', v: 'Tonguing — four sixteenths and a quarter' },
      { k: 'Section 7', v: 'Remington Interval Slurs' },
    ],
    note: 'Seven sections, twelve scales, one skill isolated at a time. Read Section 1 again: the exercise ' +
          'does not end when you decide it does. *It ends when someone else tells you.*',
  },

  {
    type: 'dramatization',
    id: 'record',
    nav: 'The record',
    kicker: 'The record, as kept',
    title: 'The origin story we *do* have',
    sub: 'Seven years of it. None of these are stock photographs.',
    frames: [
      { title: 'The instrument', medium: 'Photograph', note: 'Band room', src: '/flute.jpg' },
      { title: 'A flute behind glass', medium: 'Photograph', note: 'Washington, DC', src: '/museum.jpg' },
      { title: 'Piccolo, Friday night', medium: 'Photograph', note: 'Royal Regiment', src: '/piccolo-night.jpg' },
      { title: 'Fourth of July parade', medium: 'Photograph', note: 'The Capitol, this year', src: '/capitol.jpg' },
      { title: 'The stands', medium: 'Photograph', note: 'An ordinary Friday', src: '/stands.jpg' },
      { title: 'Nobody does it alone', medium: 'Photograph', note: 'Verified accurate', verified: true, src: '/flute-circle.jpg' },
    ],
    disclaimer: 'Cole plays the flute and the piccolo for the South Plantation Royal Regiment. ' +
                'Every photograph here is hers.',
  },

  /* Cole's own suggestion: "it would probably be more efficient to add
     what skills i gained at each grade level to move onto the next one."
     Years and milestones are hers. The hour figures are a straight
     interpolation between her start and her own 4,200 estimate —
     swap them if she wants to count properly. */
  {
    type: 'timeline',
    id: 'timeline',
    nav: 'Timeline',
    kicker: 'The record, as kept',
    title: 'Not hours stacking up. *Techniques unlocking.*',
    totalLabel: 'Hours accumulated',
    stops: [
      { year: '2019', hours: 120,  title: 'Sixth grade, age eleven',
        body: 'Long tones. Hold the note until the director signals. Her school was broke, so it was band.' },
      { year: '2022', hours: 1400, title: 'Age thirteen, a grade 7',
        body: '“which only SOME high school seniors may touch if they’re committed to the craft.” ' +
              'That year she also played The Entertainer in concert band.' },
      { year: '2024', hours: 2900, title: 'First solo — sophomore year',
        body: 'Only because it was required. She was too shy to want it, and never had to audition for anything.' },
      { year: '2026', hours: 4200, title: 'The Capitol, Fourth of July',
        body: 'Four years on piccolo, first chair. There’s actual TV footage.' },
    ],
  },

  {
    type: 'exhibit',
    id: 'tyler',
    nav: 'Tyler',
    kicker: 'Exhibit the Second — a flat slope',
    name: 'Tyler',
    role: 'Rainbow Six Siege',
    countTo: 2500,
    unit: 'hours',
    quote: TODO("Tyler's exact quote — the “still trash” line, verbatim"),
    rank: TODO('actual rank'),
    rankLabel: 'Current rank',
    punch: 'No booklet. No sections. No director to signal the next note. Two and a half thousand hours ' +
           'of finding out for himself.',
  },

  {
    type: 'graph',
    id: 'graph',
    nav: 'The graph',
    kicker: 'Plate III — the whole argument',
    title: 'The gap is not the hours. *It is the feedback.*',
    axisX: 'Hours invested',
    axisY: 'Actual skill',
    curves: [
      { key: 'casual',   label: 'Uncoached', desc: '"Nobody ever told him."' },
      { key: 'obsessed', label: 'Coached',   desc: '"Every week, someone did."' },
    ],
    markers: [
      { key: 'casual',   at: 2500, label: 'Tyler', note: '2,500 hrs · flat' },
      { key: 'obsessed', at: 4200, label: 'Cole',  note: '4,200 hrs · still climbing' },
    ],
    /* The answer to "he is just not at 10,000 yet" — drawn, not argued. */
    projection: { label: 'Tyler at 10,000 hrs', note: 'Same place.' },
    foot: 'He is not short of hours. He is short of the thing that makes hours count. ' +
          'Ten thousand of these ends up in the same spot — the line is already flat.',
  },


  {
    type: 'gated',
    id: 'gated',
    nav: 'The price',
    kicker: 'Outliers — the part nobody quotes',
    title: 'Every one of those answers has a price. Here is Cole’s.',
    body: 'This is Gladwell’s actual argument, and it is not about effort. Everyone in that book was ' +
          'standing somewhere that answered them faster than everyone else. Feedback is not free, and ' +
          'it is not handed out evenly.',
    /* Cole's own figures, from the group chat. The teacher line is
       $60 a lesson x 40 lessons a year x her 7 years. */
    gates: [
      { q: 'A beginner flute?',                             cost: '$800' },
      { q: 'One whose headjoint is shaped to your mouth?',  cost: '$10,000' },
      { q: 'A piccolo, if you want the harder instrument?', cost: '$13,000' },
      { q: 'A teacher, once a week, for seven years?',      cost: '≈$16,800' },
      { q: 'A school with a music program at all?',         cost: 'Depends on the district' },
      { q: 'A band director who replaces what broke?',      cost: 'Unbuyable' },
    ],
    /* Read here as feedback speed, which is what actually made them work. */
    examples: [
      { who: 'Bill Gates', what: 'Lakeside, 1968: a terminal that answered instantly, while everyone else waited days for punch cards to come back' },
      { who: 'The Beatles', what: 'Hamburg, 1960 to 1962: 270 nights, five or more hours a night, a live audience reacting to every song' },
      { who: 'Cole', what: '“my school was broke so we had band” — orchestra has strings; band does not' },
    ],
    punch: 'Nobody in that book out-willed anyone. *They were all standing closer to the answer.*',
  },


  /* ═══ II — THE MINDSET · Section 2 ═══════════════════════════ */
  { type: 'chapter', id: 'ch-2', nav: 'II · The Mindset' },
  {
    type: 'spiral',
    id: 'spiral',
    nav: 'His own coach',
    kicker: 'Marginalia — what it sounds like with nobody to ask',
    title: 'With no coach, you have to become one',
    sub: 'So he interrogates everything himself. It starts reasonable.',
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
    beat: 'A director answers that with one nod. Alone, it takes a year and you still get it wrong.',
  },

  {
    type: 'correction',
    id: 'mindset',
    nav: 'The shift',
    kicker: 'Section 2 — LinkedIn Learning, “Developing Leadership Mindsets”',
    strike: 'Feedback is something you survive.',
    replace: 'Feedback is the *input*.',
    body: 'If hours only count when someone’s correcting you, then the best habit a leader can build is ' +
          'asking to be corrected: early and often, before it’s comfortable.',
    kicker2: TODO('The specific mindset from the module — name it and quote a line'),
  },


  {
    type: 'statement',
    id: 'mindset-turn',
    nav: 'Both directions',
    lines: ['Asking to be corrected', 'changes your own slope.'],
    accentLines: ['Giving it', 'changes everybody else’s.'],
    small: 'That second one is most of what a leader is actually for.',
  },

  /* ═══ III — THE TABLE · Section 3 ════════════════════════════ */
  { type: 'chapter', id: 'ch-3', nav: 'III · The Table' },

  {
    type: 'gated',
    id: 'food-gates',
    nav: 'Food security',
    kicker: 'Section 3 — Power of Food, the same argument',
    title: 'Every gate has a name. None of them are willpower.',
    body: 'Nobody eats badly because they lack willpower, any more than Tyler lacked hours. Eating well is ' +
          'a skill, and skills need somebody who already knows how. Take that person away and you get the ' +
          'same flat line. People are trying. Nothing is telling them what would work.',
    gates: [
      { q: 'A grocery store nearby?',                     cost: 'Miles, not minutes' },
      { q: 'Time to cook after two jobs?',                cost: 'Rarely any' },
      { q: 'Money for the version that is not packaged?', cost: 'Priced like a luxury' },
      { q: 'A kitchen that actually works?',              cost: 'Not guaranteed' },
      { q: 'Someone who already knows how to cook it?',   cost: 'Depends who raised you' },
      { q: 'A ride to get there at all?',                 cost: 'Not everyone has one' },
    ],
    examples: [
      { who: 'A ride',   what: 'A community shuttle on pantry days: the gate that costs least to open' },
      { who: 'A recipe', what: 'A thirty-minute card that assumes two jobs and one pan' },
      { who: 'A person', what: 'Somebody who stands there and shows you once. That’s the band director.' },
    ],
    punch: 'Leadership here isn’t telling people to try harder. *It’s being the feedback they never got.*',
  },


  /* Section 3 asks for the reflection applied, so this is the doing half:
     the same gates, priced in what they would cost us rather than what
     they cost somebody else. A draft for the group to argue with. */
  {
    type: 'gated',
    id: 'food-actions',
    nav: 'What we can open',
    kicker: 'Section 3 — the doing half',
    title: 'Three gates we could actually open this semester.',
    body: 'None of these teach anybody to cook. They put somebody next to the person who is already ' +
          'trying, which is the only thing that ever moved either of our two curves.',
    gates: [
      { q: 'A ride on pantry days',                        cost: 'A driver, two hours' },
      { q: 'A card that assumes two jobs and one pan',      cost: 'One afternoon' },
      { q: 'Somebody who stands there and shows you once',  cost: 'An hour, and knowing how' },
      { q: 'Doing it again next month',                     cost: 'The hard part' },
    ],
    examples: [
      { who: 'Cole', what: 'had somebody in the room correcting her every week for seven years' },
      { who: 'Tyler', what: 'has two and a half thousand hours and nobody' },
    ],
    punch: 'We cannot buy anyone ten thousand hours. *We can be the person in the room.*',
  },
  /* The story the price list cannot hold. Her words, unedited. */
  {
    type: 'takeaway',
    id: 'piccolo',
    nav: 'The piccolo',
    kicker: 'What the list cannot price',
    lead: 'Her piccolo broke at a football game. It was the school’s, and it was thirteen thousand dollars.',
    long: true,
    quote: 'it just SNAPPED on me bc the wood was old and probably rotted… i was sobbing so bad LMFAOO… ' +
           'so my band director secretly bought a new one so i wouldn’t freak out',
    attribution: 'Cole',
  },

  /* ═══ IV — THE BRAND · Section 4 ═════════════════════════════ */
  { type: 'chapter', id: 'ch-4', nav: 'IV · The Brand' },

  {
    type: 'takeaway',
    id: 'brand-statement',
    nav: 'Our brand',
    kicker: 'Section 4 — professional brand statement',
    lead: 'So here’s the statement we’re staking our name to.',
    long: true,
    quote: 'We don’t count hours. We build the loops that make hours count: asking to be corrected ' +
           'before it’s comfortable, and being that correction for the people around us. ' +
           'Nobody gets good alone, and we’d rather fewer people had to try.',
    attribution: 'Collin, Bryan, Bonga, Eduard, and Cole',
  },

  {
    type: 'portrait',
    id: 'eduard-linkedin',
    nav: 'In practice',
    kicker: 'The brand, already running',
    name: 'Eduard Varga',
    role: 'Honors Finance Student, UNF',
    photo: '/eduard.png',
    photoCaption: 'linkedin.com/in/eduardvarga',
    facts: [
      { k: 'School', v: 'UNF, Coggin Honors' },
      { k: 'Major', v: 'Finance' },
      { k: 'Matches reffed', v: '200+' },
      { k: 'New hires trained', v: 'Every one at the shop' },
    ],
    note: 'Two hundred matches a year is two hundred rooms full of people telling you instantly when you ' +
          'were wrong. Then he turns around and trains the new hires, which is the same loop pointed ' +
          'at somebody else.',
  },

  /* Restored. Her answer when Collin asked for a final quote. */
  {
    type: 'takeaway',
    id: 'cole-takeaway',
    nav: 'Back to Cole',
    kicker: 'Back to Cole',
    lead: 'We asked her what seven years actually looked like.',
    long: true,
    quote: 'after school (3pm), i’d do some hw, practice and warm up until practice starts (5:30pm) and it ' +
           'usually goes to like (8:30)… then i’d practice for like another 2 hours LMFAO… and for fridays ' +
           'for football/marching band, i was at school until 11 pm',
    attribution: 'Cole',
  },

  {
    type: 'close',
    id: 'close',
    nav: 'End',
    lines: ['Ten thousand hours', 'will not teach you anything.'],
    accent: 'Ten thousand corrections will.',
  },
]

/* Wording edited in the live editor arrives here. Paths not present keep
   whatever is written above, so a partly-filled copy.json is safe. */
applyOverrides(deck, overrides, meta, chapters)
