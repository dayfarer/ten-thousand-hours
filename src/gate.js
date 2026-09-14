/* ═════════════════════════════════════════════════════════
   PAGE GATE — one gesture turns at most one page, so a hard
   flick lands on the next page instead of blowing past three.

   · Rest points: every page top, plus the END of each long
     section (timeline, spiral). Measured from normal flow —
     never offsetTop, which lies for sticky elements.
   · Long sections scroll freely inside; a flick that would run
     past their end stops at the end, next gesture turns.
   · A long section may also name CHECKPOINTS spaced through its
     scroll (the timeline's stops). They are rest points, so one key
     press lands on the next one instead of playing the whole section
     through. The wheel ignores them: inside a zone it still scrolls
     freely, which is what makes the travel feel continuous.
   · After a turn, trackpad inertia keeps firing wheel events for
     ~1s. Those are swallowed until the wheel goes quiet (QUIET ms)
     or a genuinely new swipe starts (deltas jump back up).

   Pure logic: the scroller, layout, clock and timers are injected
   so the timing heuristics can be tested deterministically.
   ═════════════════════════════════════════════════════════ */

/** items: [{ kind: 'sheet' | 'spacer' | 'other', h, checkpoints? }] in
    document order. `checkpoints` counts the beats a long section wants to
    stop on, its first and last being the zone's own two ends. */
export function layoutFrom(items, maxScroll) {
  const rests = [], zones = []
  let y = 0
  items.forEach((it, k) => {
    if (it.kind === 'sheet') {
      rests.push(y)
      const nx = items[k + 1]
      if (nx && nx.kind === 'spacer') {
        const end = y + nx.h            // the sheet stays pinned while its spacer scrolls
        zones.push([y, end]); rests.push(end)
        // evenly spaced through the zone, matching the section's own scroll
        // progress, so a checkpoint lands exactly where its beat plays
        for (let i = 1; i < (it.checkpoints || 0) - 1; i++)
          rests.push(y + (end - y) * (i / (it.checkpoints - 1)))
      }
    }
    y += it.h
  })
  const cap = Math.max(0, maxScroll)
  return {
    rests: [...new Set(rests.map(r => Math.min(Math.round(r), cap)))].sort((a, b) => a - b),
    zones,
  }
}

/** Reads the live deck from flow heights. */
export function domLayout(deckEl) {
  const items = [...deckEl.children].map(el => ({
    kind: el.matches('[data-sheet]') ? 'sheet' : el.classList.contains('spacer') ? 'spacer' : 'other',
    h: el.offsetHeight,
    checkpoints: el.querySelectorAll?.('[data-stop]').length || 0,
  }))
  return layoutFrom(items, document.documentElement.scrollHeight - innerHeight)
}

export function createGate({
  lenis,
  layout,
  now = () => performance.now(),
  setTimer = (fn, ms) => setTimeout(fn, ms),
  clearTimer = id => clearTimeout(id),
  TURN = 1.15,    // page turn
  SETTLE = 0.55,  // stopping at a long section's edge
  SWEEP = 1.8,    // keyboard playing a long section through
  QUIET = 180,    // ms of wheel silence that ends a gesture
}) {
  let rests = [], zones = []
  const measure = () => { ({ rests, zones } = layout()) }
  measure()

  let busy = false, cooling = false, lastT = -Infinity, lastAbs = 0, failsafe = null

  const release = () => {
    busy = false; cooling = true
    if (failsafe != null) { clearTimer(failsafe); failsafe = null }
  }
  const go = (y, dur) => {
    if (Math.abs(y - lenis.targetScroll) < 1) return   // already there: onComplete may never fire
    busy = true
    // if onComplete is ever skipped, never leave the deck frozen
    failsafe = setTimer(release, dur * 1000 + 300)
    lenis.scrollTo(y, { duration: dur, lock: true, force: true, onComplete: release })
  }
  const nextRest = (y, dir) => dir > 0
    ? rests.find(r => r > y + 2)
    : [...rests].reverse().find(r => r < y - 2)
  const zoneAt = y => zones.find(([a, b]) => y >= a - 2 && y <= b + 2)

  const onWheel = ({ deltaY, event }) => {
    if (!event || event.type !== 'wheel') return true   // touch keeps native behaviour
    if (event.ctrlKey) return true                       // pinch-zoom, leave it alone

    const t = now(), abs = Math.abs(deltaY)
    // new gesture = a pause, or deltas rising again after decaying (fresh swipe mid-tail)
    const fresh = (t - lastT) > QUIET || (abs > lastAbs * 1.6 && abs > 14)
    lastT = t; lastAbs = abs

    // Lenis returns early when this hook says false — BEFORE its own
    // preventDefault — so cancelling here is what stops native scroll leaking
    const swallow = () => { if (event.cancelable) event.preventDefault(); return false }
    if (!deltaY || busy) return swallow()
    if (cooling) { if (!fresh) return swallow(); cooling = false }

    const dir = Math.sign(deltaY)
    const y = lenis.targetScroll
    const z = zoneAt(y)
    if (z) {
      const [a, b] = z, proj = y + deltaY
      if (dir > 0 && y < b - 2) { if (proj <= b) return true; go(b, SETTLE); return swallow() }
      if (dir < 0 && y > a + 2) { if (proj >= a) return true; go(a, SETTLE); return swallow() }
      // sitting on a zone edge and pushing outward: fall through to a page turn
    }
    const target = nextRest(y, dir)
    if (target != null) go(target, TURN)
    return swallow()
  }

  /** keyboard / clicker: one press = one beat */
  const step = dir => {
    if (busy) return
    const y = lenis.targetScroll
    const target = nextRest(y, dir)
    if (target == null) return
    const sweeping = zones.some(([a, b]) =>
      (Math.abs(y - a) < 3 && Math.abs(target - b) < 3) || (Math.abs(y - b) < 3 && Math.abs(target - a) < 3))
    go(target, sweeping ? SWEEP : TURN)
  }
  const to = y => { if (!busy) go(y, 1.4) }

  return {
    onWheel, step, to, measure,
    get rests() { return rests }, get zones() { return zones },
    get state() { return { busy, cooling } },
  }
}
