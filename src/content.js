/* ═══════════════════════════════════════════════════════════════════
   ALL COPY LIVES HERE. Edit this file to change the presentation.
   Nothing in render.js / main.js needs touching to swap words.

   *asterisks* make words italic.
   TODO() marks something only you can supply. Anything wrapped in it
   renders with a dashed amber outline on screen so gaps are obvious
   while you build — they disappear once you replace the text.

   ONE LESSON: hours do not teach you, feedback does — and feedback
   is bought. Every chapter is one section of the assignment, in order,
   so the four sections are impossible to miss.
   ═══════════════════════════════════════════════════════════════════ */

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
    small: 'Every argument in this presentation is about the second one.',
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
      { k: 'Hours', v: '4,200' },
      { k: 'Corrected by a teacher', v: 'Every week, 7 years' },
    ],
    note: 'She is not obsessed. She did the solo because it was required, and she never had to audition ' +
          'for anything. What she had was somebody in the room telling her what was wrong — every week, ' +
          'for seven years.',
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
    punch: 'No coach. No VOD review. Nobody has ever watched him play and told him what he did wrong. ' +
           'Two and a half thousand hours of finding out for himself.',
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
    /* The answer to "he is just not at 10,000 yet" — drawn, not argued.
       Extends the flat line to the far right and marks where he lands. */
    projection: { label: 'Tyler at 10,000 hrs', note: 'Same place.' },
    gapLabel: 'This gap is the presentation',
    foot: 'He is not short of hours. He is short of the thing that makes hours count. ' +
          'Ten thousand of these ends up in the same spot — the line is already flat.',
  },

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
    beat: 'A coach answers that in one sentence. Alone, it takes a year and you still get it wrong.',
  },

  {
    type: 'gated',
    id: 'gated',
    nav: 'The price',
    kicker: 'Outliers — the part nobody quotes',
    title: 'Every one of those questions has an answer. The answers are for sale.',
    body: 'This is Gladwell’s actual argument, and it is not about effort. Every name in the book was ' +
          'standing somewhere that answered them faster than everyone else. Feedback is not free, and ' +
          'it is not evenly handed out.',
    /* Street prices, checked against what these things actually sell for. Basis:
         monitor   240 Hz 1080p/1440p gaming panel
         coach     per-session VOD review on the usual coaching marketplaces
         move      average interstate move, 2-3 bedrooms, movers included
         flute     Yamaha YFL-222 student flute, the cheapest one that holds pitch
         teacher   $60/lesson x 40 lessons a year x 11 years */
    gates: [
      { q: 'A coach who reviews your VOD?',              cost: '$40 / hour' },
      { q: 'A teacher, once a week, for eleven years?',  cost: '$26,400' },
      { q: 'A flute that stays in tune enough to hear the mistake?', cost: '$900' },
      { q: 'A monitor that shows you what happened?',    cost: '$250–400' },
      { q: 'Move closer to a server so the game tells you the truth?', cost: '$5,000+' },
      { q: 'Someone free to drive you there every week?', cost: 'Priceless / unbuyable' },
    ],
    /* Figures are the ones Gladwell prints in Outliers, ch. 1-2 — not the
       inflated versions that get repeated second-hand. Both examples are
       read here as feedback speed, which is what actually made them work. */
    examples: [
      { who: 'Bill Gates', what: 'Lakeside, 1968: a terminal that answered instantly, while everyone else waited days for punch cards to come back' },
      { who: 'The Beatles', what: 'Hamburg, 1960–62: 270 nights, five or more hours a night, a live audience reacting to every song' },
      { who: 'Canadian hockey', what: 'Born in January, picked for the select team at nine — and from then on coached by better coaches than everyone born in December' },
    ],
    punch: 'Nobody in that book out-willed anyone. *They were all standing closer to the answer.*',
  },

  /* ═══ II — THE MINDSET · Section 2 ═══════════════════════════ */
  { type: 'chapter', id: 'ch-2', nav: 'II · The Mindset' },

  {
    type: 'correction',
    id: 'mindset',
    nav: 'The shift',
    kicker: 'Section 2 — LinkedIn Learning, “Developing Leadership Mindsets”',
    strike: 'Feedback is something you survive.',
    replace: 'Feedback is the *input*.',
    body: 'If the hours only count when someone is correcting you, then the single most valuable habit ' +
          'a leader can build is asking to be corrected — early, often, and before it is comfortable. ' +
          'The mindset is not toughness. It is treating every correction as the thing that moves the slope.',
    kicker2: TODO('The specific mindset from the module you are building on — name it and quote a line'),
  },

  {
    type: 'statement',
    id: 'mindset-turn',
    nav: 'Both directions',
    lines: ['Asking for feedback', 'changes your own slope.'],
    accentLines: ['Giving it', 'changes everybody else’s.'],
    small: 'That second one is the entire job description of a leader.',
  },

  /* ═══ III — THE TABLE · Section 3 ════════════════════════════ */
  { type: 'chapter', id: 'ch-3', nav: 'III · The Table' },

  {
    type: 'gated',
    id: 'food-gates',
    nav: 'Food security',
    kicker: 'Section 3 — Power of Food, the same argument',
    title: 'Every gate has a name. None of them are willpower.',
    body: 'Nobody eats badly because they lack willpower, any more than Tyler lacked hours. Eating well ' +
          'is a skill, and skills need somebody who already knows how. Take that person away and you get ' +
          'the same flat line — not because people are not trying, but because nothing is telling them ' +
          'what would work.',
    gates: [
      { q: 'A grocery store nearby?',                     cost: 'Miles, not minutes' },
      { q: 'Time to cook after two jobs?',                cost: 'Rarely any' },
      { q: 'Money for the version that is not packaged?', cost: 'Priced like a luxury' },
      { q: 'A kitchen that actually works?',              cost: 'Not guaranteed' },
      { q: 'Someone who already knows how to cook it?',   cost: 'Depends who raised you' },
      { q: 'A ride to get there at all?',                 cost: 'Not everyone has one' },
    ],
    examples: [
      { who: 'A ride',   what: 'A community shuttle on pantry days — the gate that costs the least to open' },
      { who: 'A recipe', what: 'A thirty-minute card that assumes two jobs and one pan' },
      { who: 'A person', what: 'Somebody who stands there and shows you once. That is the teacher Cole had.' },
    ],
    punch: 'Leadership here is not telling people to try harder. *It is being the feedback they were never given.*',
  },

  /* ═══ IV — THE BRAND · Section 4 ═════════════════════════════ */
  { type: 'chapter', id: 'ch-4', nav: 'IV · The Brand' },

  {
    type: 'takeaway',
    id: 'brand-statement',
    nav: 'Our brand',
    kicker: 'Section 4 — professional brand statement',
    lead: 'So here is the statement we are staking our name to.',
    quote: 'We do not count hours. We build the loops that make hours count — asking to be corrected ' +
           'before it is comfortable, and being that correction for the people around us. ' +
           'Nobody gets good alone, and we would rather fewer people had to try.',
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
          'were wrong. Then he turns around and trains the new hires — which is the same loop, ' +
          'pointed at somebody else.',
  },

  {
    type: 'close',
    id: 'close',
    nav: 'End',
    lines: ['Ten thousand hours', 'will not teach you anything.'],
    accent: 'Ten thousand corrections will.',
  },
]
