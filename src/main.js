import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { render } from './render.js'
import { createGate, domLayout } from './gate.js'

gsap.registerPlugin(ScrollTrigger)
if (import.meta.env?.DEV) window.__ST = ScrollTrigger

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const $  = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const clamp = gsap.utils.clamp

/* ── build the deck from content.js ───────────────────────── */
render($('[data-deck]'))
const sheets = $$('[data-sheet]')
const spacerFor = sheet => document.querySelector(`[data-spacer-for="${sheet.id}"]`)
/* how far a sheet stays pinned: its own screen plus any spacer behind it */
/* a sticky sheet is an unreliable ScrollTrigger trigger — its spacer is not */
const rangeOf = sheet => {
  const sp = spacerFor(sheet)
  return sp ? { trigger: sp, start: 'top bottom', end: 'bottom bottom' }
            : { trigger: sheet, start: 'top top', end: 'bottom top' }
}

/* ── smooth scroll ───────────────────────────────────────── */
let gate = null   // page gate, defined below once lenis exists
const lenis = new Lenis({
  duration: 1.1,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !reduced,
  touchMultiplier: 1.5,
  virtualScroll: data => (gate ? gate.onWheel(data) : true),
})
lenis.on('scroll', ScrollTrigger.update)
if (import.meta.env?.DEV) window.__lenis = lenis
if (import.meta.env?.DEV) queueMicrotask(() => { window.__gate = gate })
gsap.ticker.add(time => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)


/* page gate — see src/gate.js: one gesture turns at most one page */
gate = createGate({ lenis, layout: () => domLayout($('[data-deck]')) })
addEventListener('resize', gate.measure)
document.fonts?.ready.then(gate.measure)
addEventListener('load', gate.measure)


/* One-shot reveals use IntersectionObserver, not ScrollTrigger.
   Elements inside a sheet that is sticky-pinned from scroll 0 get a
   NEGATIVE computed start, so the crossing never happens and a
   gsap.from() leaves them stuck at opacity 0 forever. IO reports real
   visibility and is indifferent to sticky. */
let playClose = () => {}
/* assigned with the reveals below; a pinned sheet shows all of its content,
   so whatever the observer missed is played when the sheet becomes active */
let revealSheet = () => {}

const inView = (el, fn, margin = '0px 0px -10% 0px') => {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { io.disconnect(); fn(); return }
  }, { threshold: 0, rootMargin: margin })
  io.observe(el)
}

/* ═════════════════════════════════════════════════════════
   THE SIGNATURE MOVE — sheets are sticky, so each one stays
   while the next rides up over it. As it's covered it scales
   down, rounds off and dims: a plate being set onto a pile.
   ═════════════════════════════════════════════════════════ */
if (!reduced) {
  sheets.forEach((sheet, i) => {
    const next = sheets[i + 1]
    if (!next) return
    // as `next` rides up over `sheet`, `sheet` steps back: the minimize
    gsap.timeline({
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 },
    })
      .fromTo(sheet, { scale: 1, borderRadius: 0 },
                     { scale: 0.94, borderRadius: 12, ease: 'power1.in' }, 0)
      .fromTo(sheet, { filter: 'brightness(1)' },
                     { filter: 'brightness(0.965)', ease: 'none' }, 0)
      .fromTo(sheet.firstElementChild, { y: 0, opacity: 1 },
                                       { y: -18, opacity: 0.55, ease: 'none' }, 0)

    // the arriving sheet casts a soft edge onto the one it covers
    gsap.fromTo(next, { boxShadow: '0 -26px 54px rgba(74,62,44,0)' },
      { boxShadow: '0 -26px 54px rgba(74,62,44,.26)', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.5 } })
  })
}

/* ── chrome: progress, folio, running ledger ──────────────── */
{
  /* Sticky sheets defeat BOTH ScrollTrigger position math and
     IntersectionObserver: sheet 0 is pinned at top:0 for the whole deck,
     so it never stops "intersecting". Derive the active sheet from flow
     offsets instead — deterministic, and sticky cannot lie about it. */
  let tops = []
  const measure = () => {
    tops = []; let y = 0
    for (const el of $('[data-deck]').children) {
      if (el.matches('[data-sheet]')) tops.push(y)
      y += el.offsetHeight
    }
  }
  measure()
  addEventListener('resize', measure)
  document.fonts?.ready.then(measure)

  const bar = $('[data-progress]')
  const folio = $('[data-folio]')
  const tally = $('[data-tally]')
  let active = -1, closed = false
  const pad = n => String(n).padStart(2, '0')

  const onScroll = () => {
    const y = lenis.scroll ?? scrollY
    const max = Math.max(1, document.body.scrollHeight - innerHeight)
    // land exactly on 10,000 at the end — sub-pixel scroll left it at 9,999
    const p = (max - y < 2) ? 1 : clamp(0, 1, y / max)

    gsap.set(bar, { scaleX: p })
    // hours accrue across the whole scroll — the thesis, as furniture
    tally.textContent = Math.round(p * 10000).toLocaleString()

    let i = 0
    for (let k = 0; k < tops.length; k++) if (y >= tops[k] - 2) i = k
    if (i === active) return
    active = i
    folio.textContent = `${pad(i + 1)} / ${pad(tops.length)}`
    /* Sheets are sticky, so a covered one never stops compositing its own
       scale/brightness: with all of them live the frame budget went from
       83ms at the top of the deck to 333ms at the end, wheel events queued
       behind it, and a single flick turned several pages. Only the sheet on
       screen and the two it hands off to need painting. */
    sheets.forEach((sh, k) => sh.classList.toggle('is-stowed', Math.abs(k - i) > 1))
    revealSheet(sheets[i])
    // hero and close print their own presenter/year lines
    document.body.classList.toggle('chrome-off', i === 0 || i === tops.length - 1)
    if (i === tops.length - 1 && !closed) { closed = true; playClose() }
  }

  lenis.on('scroll', onScroll)
  addEventListener('resize', onScroll)
  onScroll()
}

/* ── portraits with a second photograph ───────────────────
   The swap only becomes available once the alternate has actually
   decoded, so a portrait whose second file is missing behaves exactly
   like one that never had it: no pointer, no dot, no dead click. */
$$('[data-swap]').forEach(plate => {
  const alt = $('.plate__alt', plate)
  if (!alt) return
  const arm = () => {
    if (!alt.naturalWidth) return
    plate.classList.add('can-swap')
    const toggle = () => plate.classList.toggle('is-alt')
    plate.addEventListener('click', toggle)
    plate.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
    })
  }
  if (alt.complete) arm()
  else alt.addEventListener('load', arm, { once: true })
})

/* ── generic reveals ─────────────────────────────────────── */
{
  /* The observer ignores the bottom 10% of the screen so nothing pops in
     while barely peeking. On a full-screen pinned sheet that tenth is real
     content — the closing line of the gated slides sat at 848px of 900 and
     never qualified — so a sheet becoming active also plays its own. */
  const play = el => {
    if (el.__risen) return
    el.__risen = true
    gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' })
  }
  $$('[data-rise]').forEach(el => {
    gsap.set(el, { y: 26, opacity: 0 })
    inView(el, () => play(el))
  })
  revealSheet = sheet => sheet && $$('[data-rise]', sheet).forEach(play)
  revealSheet(sheets[0])
}

/* ── counters ────────────────────────────────────────────── */
$$('[data-count]').forEach(el => {
  const end = parseFloat(el.dataset.count)
  const group = el.hasAttribute('data-group')
  const write = v => { el.textContent = group ? Math.round(v).toLocaleString() : String(Math.round(v)) }
  write(0)
  inView(el, () => {
    const obj = { v: 0 }
    gsap.to(obj, { v: end, duration: 2.4, ease: 'expo.out', onUpdate: () => write(obj.v) })
  })
})

/* ── hero ────────────────────────────────────────────────── */
{
  gsap.set('.hero__num', { yPercent: 18, opacity: 0 })
  gsap.set('.hero__band .hair', { scaleX: 0, transformOrigin: '0 50%' })
  gsap.set('.hero__unit', { opacity: 0, y: 14 })
  gsap.set('.hero__head, .hero__foot', { opacity: 0 })
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 })
  tl.to('.hero__num', { yPercent: 0, opacity: 1, duration: 1.5 })
    .to('.hero__band .hair', { scaleX: 1, duration: 1.3, stagger: 0.1 }, 0.3)
    .to('.hero__unit', { opacity: 1, y: 0, duration: 1.1 }, 0.45)
    .to('.hero__head, .hero__foot', { opacity: 1, duration: 1, stagger: 0.1 }, 0.2)
}

/* ── timeline: a melodic line travelling past a fixed playhead ──
   The curve is built through the stops themselves, so a note head is on
   the line by construction rather than by nudging pixels. It climbs as
   the hours add up and squiggles on the way; bar lines tick past to give
   the travel something to measure itself against. */
{
  const track = $('[data-tl-track]')
  if (track) {
    const section = track.closest('[data-sheet]')
    const stage = $('[data-tl-stage]')
    const svg = $('[data-tl-svg]')
    const path = $('[data-tl-path]')
    const lit = $('[data-tl-lit]')
    const notches = $('[data-tl-notches]')
    const total = $('[data-tl-total]')
    const stops = $$('[data-stop]', track)
    const hoursAt = stops.map(s => +s.dataset.hours)

    /* one smooth cubic through every point, Catmull-Rom converted to bezier */
    const through = pts => pts.map((p, i) => {
      if (!i) return `M${p.x} ${p.y}`
      const a = pts[i - 1], p0 = pts[i - 2] || a, p3 = pts[i + 1] || p
      const c1 = { x: a.x + (p.x - p0.x) / 6, y: a.y + (p.y - p0.y) / 6 }
      const c2 = { x: p.x - (p3.x - a.x) / 6, y: p.y - (p3.y - a.y) / 6 }
      return `C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p.x} ${p.y}`
    }).join(' ')

    let travel = 0, playX = 0
    const measure = () => {
      const H = stage.clientHeight
      const gap = Math.max(300, Math.min(560, innerWidth * 0.46))
      playX = Math.round(innerWidth * 0.3)
      const narrow = innerWidth < 700
      const mid = Math.round(H * (narrow ? 0.3 : 0.36))   // leaves room for the longest card below
      const amp = Math.min(52, H * 0.12)          // how far the line wanders
      const climb = Math.min(84, H * 0.2)         // how far it rises overall
      const n = stops.length
      const pts = stops.map((_, i) => ({
        x: playX + i * gap,
        // rises with the hours, alternating above and below its own trend
        y: mid + climb / 2 - (i / Math.max(1, n - 1)) * climb + (i % 2 ? amp : -amp) * 0.7,
      }))
      travel = (n - 1) * gap
      const W = playX + travel + Math.max(320, innerWidth * 0.4)

      svg.setAttribute('width', W); svg.setAttribute('height', H)
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      track.style.width = W + 'px'
      const d = through(pts)
      path.setAttribute('d', d); lit.setAttribute('d', d)

      // bar lines: short ticks square to the curve, the way a score is barred
      const len = path.getTotalLength()
      let ticks = ''
      for (let l = 6; l < len; l += 34) {
        const a = path.getPointAtLength(l), b = path.getPointAtLength(Math.min(len, l + 1))
        const ang = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2
        const h = 7
        ticks += `<line x1="${(a.x - Math.cos(ang) * h).toFixed(1)}" y1="${(a.y - Math.sin(ang) * h).toFixed(1)}"
                        x2="${(a.x + Math.cos(ang) * h).toFixed(1)}" y2="${(a.y + Math.sin(ang) * h).toFixed(1)}"/>`
      }
      notches.innerHTML = ticks

      stops.forEach((el, i) => { el.style.left = pts[i].x + 'px'; el.style.top = pts[i].y + 'px' })
      lit.style.strokeDasharray = len
      return len
    }

    let pathLen = measure()
    const relayout = () => { pathLen = measure(); ScrollTrigger.refresh() }
    addEventListener('resize', relayout)
    document.fonts?.ready.then(relayout)

    const lerp = p => {                            // hours between the two nearest stops
      const t = p * (hoursAt.length - 1)
      const i = Math.min(hoursAt.length - 2, Math.floor(t))
      return Math.round(hoursAt[i] + (hoursAt[i + 1] - hoursAt[i]) * (t - i))
    }

    if (reduced) {
      lit.style.strokeDashoffset = 0
      stops.forEach(el => el.classList.add('is-lit'))
      total.textContent = hoursAt[hoursAt.length - 1].toLocaleString()
    } else {
      gsap.set(stops, { opacity: 0, y: 24 })
      lit.style.strokeDashoffset = pathLen          // nothing inked before the first note
      stops[0].classList.add('is-lit')              // the first note starts on the playhead
      total.textContent = hoursAt[0].toLocaleString()
      gsap.to(track, {
        x: () => -travel, ease: 'none',
        scrollTrigger: {
          ...rangeOf(section), scrub: 0.8, invalidateOnRefresh: true,
          onRefresh: () => { pathLen = measure() },
          onUpdate: self => {
            const p = self.progress
            total.textContent = lerp(p).toLocaleString()
            // the curve begins at the playhead, so the fraction already
            // past it is the scroll progress itself
            lit.style.strokeDashoffset = pathLen * (1 - Math.min(1, p + 0.004))
            stops.forEach((el, i) => {
              const at = i / Math.max(1, stops.length - 1)
              el.classList.toggle('is-lit', p >= at - 0.02)
            })
          },
        },
      })
      stops.forEach(el => inView(el, () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }), '0px'))
    }
  }
}

/* ── correction: the strike is drawn ─────────────────────── */
{
  const strike = $('[data-strike] i')
  if (strike) inView(strike, () => gsap.to(strike, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }))
}

/* ── graph: the curves ink in, then the camera visits each point ──
   The plot is a fixed 1120x450 drawing, so a dot's own cx/cy is where
   the camera has to look. Only the drawing scales: the labels are
   siblings that get repositioned to follow their point, which keeps
   them the same size and readable at every zoom. */
{
  const plot = $('[data-graph]')
  if (plot) {
    const cam = $('[data-graph-cam]', plot)
    const paths = $$('[data-ink]', plot)
    const VW = 1120, VH = 450

    paths.forEach(p => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    // the ink lands once, on arrival; the camera owns the scroll from there
    inView(plot, () => gsap.timeline()
      .to(paths, { strokeDashoffset: 0, duration: 1.5, ease: 'none', stagger: 0.18 }, 0)
      .to('[data-dot]', { opacity: 1, duration: 0.25 }, 0.9)
      .to('[data-gap]', { opacity: 1, duration: 0.3 }, 1.3), '0px')

    const at = sel => {
      const c = $(sel + ' circle', plot)
      return c && { x: +c.getAttribute('cx') / VW, y: +c.getAttribute('cy') / VH }
    }
    const WIDE = { p: { x: 0.5, y: 0.5 }, s: 1, mk: null }
    const beats = [
      WIDE,
      { p: at('[data-dot="casual"]'),   s: 2.3, mk: '.mk--tyler' },
      { p: at('[data-dot="obsessed"]'), s: 2.3, mk: '.mk--cole' },
      ...(at('[data-dot="proj"]') ? [{ p: at('[data-dot="proj"]'), s: 2.3, mk: '.mk--proj' }] : []),
      WIDE,
    ].filter(b => b.p)

    const lerp = (a, b, t) => a + (b - a) * t
    const ease = gsap.parseEase('power2.inOut')

    const look = a => {
      const i = Math.min(beats.length - 2, Math.max(0, Math.floor(a)))
      const e = ease(clamp(0, 1, a - i))
      const A = beats[i], B = beats[i + 1]
      const S = lerp(A.s, B.s, e)
      const px = lerp(A.p.x, B.p.x, e), py = lerp(A.p.y, B.p.y, e)
      const W = plot.clientWidth, H = plot.clientHeight
      cam.style.transform =
        `translate(${(-S * (px - 0.5) * W).toFixed(1)}px,${(-S * (py - 0.5) * H).toFixed(1)}px) scale(${S.toFixed(3)})`

      // labels are outside the camera, so put each one where its dot now is
      beats.forEach(b => {
        if (!b.mk) return
        const el = $(b.mk, plot); if (!el) return
        const fx = 0.5 + S * (b.p.x - px), fy = 0.5 + S * (b.p.y - py)
        el.style.left = (fx * 100).toFixed(2) + '%'
        el.style.top = (fy * 100).toFixed(2) + '%'
        el.style.transform = `translate(${fx > 0.78 ? '-88%' : fx < 0.12 ? '-6%' : '-50%'},-128%)`
        // dim what the camera is not looking at, drop what it has pushed off
        const focused = Math.abs(a - beats.indexOf(b)) < 0.45
        el.style.opacity = (fx < -0.04 || fx > 1.04 || fy < -0.04 || fy > 1.04) ? 0 : focused ? 1 : 0.34
        el.classList.toggle('is-on', focused)
      })
    }

    if (reduced) { look(0) } else {
      look(0)
      gsap.to({}, {
        scrollTrigger: {
          ...rangeOf(plot.closest('[data-sheet]')), scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: self => {
            look(self.progress * (beats.length - 1))
            $('[data-graph-foot]').style.opacity = (0.35 + 0.65 * Math.max(0, (self.progress - 0.72) / 0.28)).toFixed(2)
          },
        },
      })
      addEventListener('resize', () => look(0))
    }
  }
}

/* ── spiral: the camera falls into it, one question at a time ──
   Each question sits further round and further in than the last, at
   K times the radius and K times the size. Zooming by 1/K^a and
   centring on question `a` therefore renders whichever one you are on
   at full size, with the one behind you flying outward and the next
   already small near the middle. The questions get sillier as they get
   smaller, which is the joke the slide is making. */
{
  const field = $('[data-spiral]')
  if (field) {
    const qs = $$('.q', field)
    const section = field.closest('[data-sheet]')
    const head = $('.spiral__head', section)
    const last = qs.length - 1
    const K = 0.58            // each step inward
    const DTH = 2.2           // radians between neighbours, so they do not stack
    const TH0 = -0.9

    if (reduced) {
      field.classList.add('is-static')
      $('[data-final]').style.opacity = 1
    } else {
      const place = a => {
        const R = Math.min(innerWidth, innerHeight) * 0.42
        const ca = Math.cos(TH0 + a * DTH), sa = Math.sin(TH0 + a * DTH)
        qs.forEach((q, i) => {
          const d = i - a
          if (d < -1.6 || d > 4.2) { q.style.opacity = 0; return }   // outside the frame
          const s = Math.pow(K, d)
          const th = TH0 + i * DTH
          // difference between this question's place on the spiral and the
          // camera's, once the whole plane is scaled back up by 1 / K^a
          q.style.transform =
            `translate(-50%,-50%) translate(${(R * (s * Math.cos(th) - ca)).toFixed(1)}px,` +
            `${(R * (s * Math.sin(th) - sa)).toFixed(1)}px) scale(${s.toFixed(4)})`
          q.style.opacity = (d < -0.25 ? Math.max(0, 1 + (d + 0.25) / 1.35)
                           : d > 0.7  ? Math.max(0.1, 1 - (d - 0.7) / 3.2)
                           : 1).toFixed(3)
          q.classList.toggle('is-here', Math.abs(d) < 0.4)
        })
      }
      place(0)
      gsap.to({}, {
        scrollTrigger: {
          ...rangeOf(section), scrub: 0.5, invalidateOnRefresh: true,
          onUpdate: self => {
            place(self.progress * last)
            // the heading steps aside once you are inside the spiral
            head.style.opacity = Math.max(0, 1 - self.progress * 5).toFixed(2)
            $('[data-final]').style.opacity = Math.max(0, (self.progress - 0.86) / 0.14).toFixed(2)
          },
        },
      })
      addEventListener('resize', () => place(0))
    }
  }
}

/* ── gated rows ──────────────────────────────────────────── */
$$('[data-gate]').forEach((li, i) => {
  gsap.set(li, { opacity: 0, x: -18 })
  inView(li, () => gsap.to(li, { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', delay: i * 0.04 }))
})

/* ── close ───────────────────────────────────────────────── */
{
  const words = $$('.close__title [data-word]')
  gsap.set(words, { yPercent: 115 })
  gsap.set('.close__mark', { scaleX: 0, transformOrigin: '50% 50%' })
  playClose = () => {
    gsap.to(words, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.045 })
    gsap.to('.close__mark', { scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.3 })
  }
}

/* ── dramatization: prints develop on the wall, one by one ──
   Empty mats hang from the start; each image comes up out of the
   paper (washed white → sepia → rest) and its placard follows. */
{
  const wall = $('[data-gallery]')
  if (wall) {
    const section = wall.closest('[data-sheet]')
    const RAW = 'sepia(0.5) saturate(0.2) brightness(1.9) contrast(0.25) blur(4px)'
    const REST = 'sepia(0.12) saturate(0.78) brightness(1) contrast(1) blur(0px)'
    const tl = gsap.timeline({ scrollTrigger: { ...rangeOf(section), scrub: 0.6 } })
    $$('[data-print]', wall).forEach((print, i) => {
      const at = i * 0.8
      tl.fromTo(print.querySelector('[data-develop]'), { opacity: 0, filter: RAW },
                  { opacity: 1, filter: REST, duration: 1.1, ease: 'power1.out' }, at)
        .fromTo(print.querySelector('.placard'), { opacity: 0, y: 8 },
                  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at + 0.55)
    })
    tl.fromTo('[data-drama-note]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '>-0.1')
  }
}

/* ── keyboard navigation: presenter drives with a clicker ──
   Same rest points as the wheel gate: one press = one beat.
   Inside a long section, a press plays it through to its end. */
{
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); gate.step(1) }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); gate.step(-1) }
    if (e.key === 'Home') { e.preventDefault(); gate.to(0) }
    if (e.key === 'End') { e.preventDefault(); gate.to(document.documentElement.scrollHeight) }
  })
}

document.fonts?.ready.then(() => ScrollTrigger.refresh())
addEventListener('load', () => ScrollTrigger.refresh())
