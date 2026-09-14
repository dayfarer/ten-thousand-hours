/* Builds every section from src/content.js. Layout lives here, copy lives there. */
import { deck, chapters, meta } from './content.js'

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

/* Photo paths are written as '/cole.jpg' in content.js. Resolve them against
   the build's base so the deck also works when it is served from a
   subdirectory rather than a domain root. */
const asset = p => p ? import.meta.env.BASE_URL.replace(/\/$/, '/') + String(p).replace(/^\//, '') : p

/* TODO() values render with a visible marker so gaps can't ship unnoticed */
const t = v => {
  if (v && typeof v === 'object' && v.__todo) return `<i class="todo">${esc(v.text)}</i>`
  // *asterisks* → italics, so the copy file controls emphasis
  return v == null ? '' : esc(v).replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
const words = str => String(str).split(/\s+/).filter(Boolean).map(w => `<span class="w"><span data-word>${esc(w)}</span></span>`).join(' ')
const chapterOf = id => chapters.find(c => c.id === id)

const mark = (s, key, cls) => {
  const m = s.markers.find(x => x.key === key)
  return `<span class="mk ${cls}" data-mark><em>${t(m.label)}</em><small>${t(m.note)}</small></span>`
}
const kicker = k => k ? `<p class="kicker" data-rise>${t(k)}</p>` : ''
const rule = () => `<span class="rule2"><i></i><i></i></span>`

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
/* stand-in until real stock photos are dropped into content.js */
const SITTERS = [['#cfc6b3', '#8d6a4f'], ['#bfc3b8', '#5a4032'], ['#cdbfa8', '#c79a74'], ['#c3bcc4', '#6e5040'], ['#c9c2b0', '#a8805e']]
const placeholder = (f, i) => {
  if (f.verified) return `<svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="80" height="100" fill="#211d18"/><rect x="8" y="47" width="64" height="6" rx="3" fill="#a98a4b"/>
    ${[18, 28, 38, 48, 58].map(x => `<circle cx="${x}" cy="50" r="1.6" fill="#211d18"/>`).join('')}</svg>`
  const [bg, tone] = SITTERS[i % SITTERS.length]
  return `<svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="80" height="100" fill="${bg}"/><circle cx="40" cy="40" r="13" fill="${tone}"/>
    <path d="M14 100c0-18 11.6-30 26-30s26 12 26 30z" fill="${tone}"/></svg>`
}

const views = {

  hero: s => `
    <div class="hero__head">${rule()}
      <div class="hero__meta">
        <span>${t(meta.masthead)}</span>
        <span>${t(s.eyebrow)}</span>
      </div>
    </div>
    <div class="hero__mid">
      <span class="hero__num" data-count="${s.countTo}" data-group>0</span>
      <div class="hero__band">
        <span class="hair"></span>
        <em class="hero__unit">${t(s.unitLine)}</em>
        <span class="hair"></span>
      </div>
      <p class="hero__sub" data-rise>${t(s.sub)}</p>
    </div>
    <div class="hero__foot">
      <span>${t(meta.presenters)} &middot; ${t(meta.course)}</span>
      <span class="hero__cue">${t(meta.scrollCue)}<i></i></span>
      <span>${t(meta.year)}</span>
    </div>`,

  chapter: s => {
    const c = chapterOf(s.id)
    return `
    <div class="chapter__inner">
      <div class="chapter__lead">
        <p class="kicker" data-rise>${t(meta.chapterLabel)}</p>
        <div class="chapter__title">
          <em class="chapter__num">${esc(c.numeral)}</em>
          <span class="chapter__name" data-rise>${esc(c.title)}</span>
        </div>
        <p class="chapter__sub" data-rise>${esc(c.sub)}</p>
      </div>
      <ol class="chapter__list">
        ${chapters.map(x => `
          <li class="${x.id === c.id ? 'is-here' : ''}">
            <em>${esc(x.numeral)}</em><span>${esc(x.title)}</span>
          </li>`).join('')}
      </ol>
    </div>`
  },

  portrait: s => `
    <div class="portrait">
      <figure class="plate" data-rise>
        <div class="plate__inner">
          ${s.photo ? `<img src="${esc(asset(s.photo))}" alt="${esc(s.name)}" loading="lazy">` : `
          <svg viewBox="0 0 24 24" width="86" fill="none" stroke="currentColor" stroke-width=".9">
            <rect x="3" y="5" width="18" height="14"></rect><circle cx="8.5" cy="10.5" r="1.6"></circle>
            <path d="M21 15l-5.5-5.5L5 19"></path>
          </svg>`}
        </div>
        <figcaption>${t(s.photoCaption)}</figcaption>
      </figure>
      <div class="portrait__body">
        ${kicker(s.kicker)}
        <h2 class="portrait__name" data-rise>${t(s.name)} <em>${t(s.role)}</em></h2>
        <dl class="ledger">
          ${s.facts.map(f => `<div><dt>${t(f.k)}</dt><dd>${t(f.v)}</dd></div>`).join('')}
        </dl>
        <p class="pull" data-rise>${t(s.note)}</p>
      </div>
    </div>`,

  dramatization: s => `
    <div class="drama__head">
      ${kicker(s.kicker)}
      <h2 data-rise>${t(s.title)}</h2>
      <p class="lede" data-rise>${t(s.sub)}</p>
    </div>
    <div class="gallery" data-gallery>
      ${s.frames.map((f, i) => `
        <figure class="print${f.verified ? ' print--verified' : ''}" data-print>
          <div class="print__frame">
            <div class="print__img" data-develop>${f.src
              ? `<img src="${esc(asset(f.src))}" alt="${esc(f.title)}" loading="lazy">`
              : placeholder(f, i)}</div>
          </div>
          <figcaption class="placard">
            <span class="placard__no">Plate ${ROMAN[i] || i + 1}</span>
            <span class="placard__title">${t(f.title)}</span>
            <span class="placard__meta">${t(f.medium)} &middot; ${t(f.note)}</span>
          </figcaption>
        </figure>`).join('')}
    </div>
    <p class="drama__note" data-drama-note>${t(s.disclaimer)}</p>`,

  /* The track is a melodic line: it travels past a fixed playhead, bar
     lines tick by, and each stop is a note head sitting ON the curve.
     Geometry is measured in main.js — the path is empty until then. */
  timeline: s => `
    <div class="tl__head">
      <div>${kicker(s.kicker)}<h2 data-rise>${t(s.title)}</h2></div>
      <div class="tl__total">
        <span>${t(s.totalLabel)}</span>
        <em data-tl-total>0</em>
      </div>
    </div>
    <div class="tl__stage" data-tl-stage>
      <span class="tl__play" aria-hidden="true"></span>
      <div class="tl__track" data-tl-track>
        <svg class="tl__ink" data-tl-svg aria-hidden="true">
          <g data-tl-notches></g>
          <path class="tl__curve" data-tl-path></path>
          <path class="tl__curve tl__curve--lit" data-tl-lit></path>
        </svg>
        ${s.stops.map((st, i) => `
          <article class="stop" data-stop data-hours="${st.hours}" data-i="${i}">
            <span class="stop__note" aria-hidden="true"></span>
            <span class="stop__hrs">${st.hours.toLocaleString()} hrs</span>
            <em class="stop__year">${t(st.year)}</em>
            <h3>${t(st.title)}</h3>
            <p>${t(st.body)}</p>
          </article>`).join('')}
      </div>
    </div>`,

  statement: s => `
    <div class="stmt">
      <h2>${s.lines.map(l => `<span class="line">${t(l)}</span>`).join('')}
        ${s.accentLines.map(l => `<span class="line accent"><em>${t(l)}</em></span>`).join('')}</h2>
      ${s.small ? `<p class="lede" data-rise>${t(s.small)}</p>` : ''}
    </div>`,

  claim: s => `
    <div class="claim">
      ${kicker(s.kicker)}
      <span class="claim__big" data-rise>${esc(s.big)}</span>
      <h2 data-rise>${t(s.title)}</h2>
      <p class="lede" data-rise>${t(s.body)}</p>
      <p class="foot-note" data-rise>${t(s.footnote)}</p>
    </div>`,

  correction: s => `
    <div class="corr">
      ${kicker(s.kicker)}
      <p class="corr__strike" data-strike><span>${t(s.strike)}</span><i></i></p>
      <p class="corr__new" data-rise>${t(s.replace)}</p>
      <div class="corr__grid">
        <p class="lede" data-rise>${t(s.body)}</p>
        <p class="pull" data-rise>${t(s.kicker2)}</p>
      </div>
    </div>`,

  exhibit: s => `
    <div class="exhibit">
      <div class="exhibit__left">
        ${kicker(s.kicker)}
        <h2 class="exhibit__name" data-rise>${t(s.name)} <em>${t(s.role)}</em></h2>
        <div class="exhibit__count">
          <span data-count="${s.countTo}" data-group>0</span><i>${t(s.unit)}</i>
        </div>
        <p class="lede" data-rise>${t(s.punch)}</p>
      </div>
      <div class="exhibit__right">
        <div class="rank">
          <span class="rank__label">${t(s.rankLabel)}</span>
          <span class="rank__val">${t(s.rank)}</span>
        </div>
        <blockquote class="quote" data-rise>
          <p>&ldquo;${t(s.quote)}&rdquo;</p><cite>&mdash; ${t(s.name)}</cite>
        </blockquote>
      </div>
    </div>`,

  graph: s => `
    <div class="graph__head">
      <div>${kicker(s.kicker)}<h2 data-rise>${t(s.title)}</h2></div>
      <ul class="legend">
        ${s.curves.map(c => `<li class="lg--${c.key}"><i></i><span><em>${esc(c.label)}</em><small>${esc(c.desc)}</small></span></li>`).join('')}
      </ul>
    </div>
    <div class="graph__plot" data-graph>
      <svg viewBox="0 0 1120 450" preserveAspectRatio="none" class="graph__grid">
        <line x1="0" y1="430" x2="1120" y2="430"></line><line x1="0" y1="0" x2="0" y2="430"></line>
        <line class="g" x1="0" y1="322" x2="1120" y2="322"></line>
        <line class="g" x1="0" y1="214" x2="1120" y2="214"></line>
        <line class="g" x1="0" y1="106" x2="1120" y2="106"></line>
      </svg>
      <svg viewBox="0 0 1120 450" class="graph__ink">
        <path class="c--casual" data-ink d="M0 412 C150 322 250 250 400 238 C580 224 780 220 1120 218"></path>
        <path class="c--obsessed" data-ink d="M0 412 C170 348 320 274 480 210 C670 136 860 74 1120 30"></path>
        <g data-gap opacity="0">
          <line class="gap" x1="280" y1="262" x2="1108" y2="262"></line>
          <line class="gap" x1="1112" y1="218" x2="1112" y2="430"></line>
        </g>
        <g data-dot="casual" opacity="0"><circle cx="280" cy="262" r="6"></circle><circle cx="280" cy="262" r="13" class="halo"></circle></g>
        <g data-dot="obsessed" opacity="0"><circle cx="470" cy="214" r="6"></circle><circle cx="470" cy="214" r="13" class="halo"></circle></g>
        ${s.projection ? `<g data-dot="proj" opacity="0"><circle cx="1112" cy="218" r="6"></circle><circle cx="1112" cy="218" r="13" class="halo"></circle></g>` : ''}
      </svg>
      ${mark(s, 'casual', 'mk--tyler')}
      ${mark(s, 'obsessed', 'mk--cole')}
      ${s.projection ? `<span class="mk mk--proj" data-mark><em>${t(s.projection.label)}</em><small>${t(s.projection.note)}</small></span>` : ''}
      <span class="axis axis--x">${t(s.axisX)}</span>
      ${s.projection ? `<span class="axis axis--max">10,000 hrs</span>` : ''}
      <span class="axis axis--y">${t(s.axisY)}</span>
    </div>
    <p class="pull graph__foot">${t(s.foot)}</p>`,

  spiral: s => `
    <div class="spiral__head">
      ${kicker(s.kicker)}
      <h2 data-rise>${t(s.title)}</h2>
      <p class="lede" data-rise>${t(s.sub)}</p>
    </div>
    <div class="spiral__field" data-spiral>
      ${s.questions.map((q, i) => `<span class="q" data-q="${i}">${esc(q)}</span>`).join('')}
    </div>
    <div class="spiral__final" data-final>
      <span class="q q--final">${esc(s.questions[s.finalIndex])}</span>
      <p class="pull">${t(s.beat)}</p>
    </div>`,

  gated: s => `
    <div class="gated">
      <div class="gated__head">${kicker(s.kicker)}<h2 data-rise>${t(s.title)}</h2></div>
      <div class="gated__grid">
        <ul class="gates">
          ${s.gates.map(g => `<li data-gate><span>${t(g.q)}</span><em>${t(g.cost)}</em></li>`).join('')}
        </ul>
        <div class="gated__side">
          <p class="lede" data-rise>${t(s.body)}</p>
          <dl class="examples">
            ${s.examples.map(e => `<div><dt>${t(e.who)}</dt><dd>${t(e.what)}</dd></div>`).join('')}
          </dl>
        </div>
      </div>
      <p class="pull gated__punch" data-rise>${t(s.punch)}</p>
    </div>`,

  plate: s => `
    <div class="pl">
      <figure class="pl__fig" data-rise>
        <img src="${esc(asset(s.photo))}" alt="${esc(s.title)}" loading="lazy">
        <figcaption>${t(s.photoCaption)}</figcaption>
      </figure>
      <div class="pl__body">
        ${kicker(s.kicker)}
        <h2 data-rise>${t(s.title)}</h2>
        <ol class="pl__list">
          ${s.items.map(it => `<li data-gate><em>${t(it.k)}</em><span>${t(it.v)}</span></li>`).join('')}
        </ol>
        <p class="pull" data-rise>${t(s.note)}</p>
      </div>
    </div>`,

  takeaway: s => `
    <div class="takeaway${s.long ? ' takeaway--long' : ''}">
      ${kicker(s.kicker)}
      <p class="lede" data-rise>${t(s.lead)}</p>
      <blockquote class="takeaway__q" data-rise><p>&ldquo;${t(s.quote)}&rdquo;</p></blockquote>
      <span class="attrib"><i></i>${t(s.attribution)}<i></i></span>
    </div>`,

  close: s => `
    <div class="close__head">${rule()}</div>
    <div class="close__mid">
      <h2 class="close__title">
        ${s.lines.map(l => `<span class="line">${words(l)}</span>`).join('')}
        <span class="line accent"><em>${words(s.accent)}</em></span>
      </h2>
      <span class="close__mark"></span>
    </div>
    <div class="close__foot">
      <span>${t(meta.presenters)} &middot; ${t(meta.course)}</span>
      <span>${t(meta.masthead)}</span>
      <span>${t(meta.year)}</span>
    </div>`,
}

/* extra screens of scroll a section needs while it sits pinned */
const EXTRA = { dramatization: 1.3, timeline: 1.5, spiral: 1.2 }

export function render(root) {
  root.innerHTML = deck.map((s, i) => {
    const body = views[s.type] ? views[s.type](s) : ''
    const last = i === deck.length - 1
    const extra = EXTRA[s.type] || 0
    const sheet = `<section class="sheet sheet--${s.type}" id="${s.id}" data-sheet${last ? ' data-last' : ''}
                     style="z-index:${i + 1}"><div class="sheet__in">${body}</div></section>`
    // the spacer scrolls while the sheet stays pinned over it, buying the
    // section time to play out before the next sheet arrives
    const spacer = extra
      ? `<div class="spacer" data-spacer-for="${s.id}" style="height:${extra * 100}svh"></div>`
      : ''
    return sheet + spacer
  }).join('')
  return deck
}
