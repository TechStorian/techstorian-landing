<script setup lang="ts">
// A short animated walkthrough of allowing the unsigned Close Reader app to open on macOS.
// Drawn in HTML like CloseReaderWindow rather than recorded, so it follows light/dark mode
// and stays sharp at any size. Everything on the 800×500 stage is a function of `t`, the
// time in ms into the current scene, so pausing and jumping between steps are trivial.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import icon from '../assets/close-reader-icon.png'
import { closeReader, closeReaderInstall as steps } from '../content'

type Waypoint = [at: number, x: number, y: number]
type Scene = {
  app: string
  duration: number
  /** A frame that sums up the step, shown when motion is reduced and nothing plays. */
  poster: number
  path: Waypoint[]
  /** Mouse-button-down intervals. */
  presses: [number, number][]
}

const scenes: Scene[] = [
  {
    app: 'Finder',
    duration: 5000,
    poster: 2400,
    path: [
      [0, 640, 440],
      [1100, 298, 238],
      [1400, 298, 238],
      [3100, 502, 238],
    ],
    presses: [[1250, 3300]],
  },
  {
    app: 'Finder',
    duration: 5000,
    poster: 2800,
    path: [
      [0, 660, 450],
      [2600, 400, 310],
    ],
    presses: [[3300, 3460]],
  },
  {
    app: 'System Settings',
    duration: 6200,
    poster: 4600,
    path: [
      [0, 650, 460],
      [800, 195, 362],
      [1150, 195, 362],
      [1700, 420, 250],
      [3600, 420, 250],
      [4500, 616, 300],
    ],
    presses: [
      [950, 1110],
      [4800, 4960],
    ],
  },
  {
    app: 'System Settings',
    duration: 6200,
    poster: 3600,
    path: [
      [0, 660, 450],
      [1200, 400, 310],
      [1700, 400, 310],
      [4000, 400, 310],
      [4600, 462, 314],
    ],
    presses: [
      [1500, 1660],
      [4800, 4960],
    ],
  },
  {
    app: 'Close Reader',
    duration: 4500,
    poster: 4000,
    path: [[0, 690, 440]],
    presses: [],
  },
]

const sidebar = (() => {
  const groups = [
    ['Wi‑Fi', 'Bluetooth', 'Network'],
    ['General', 'Appearance', 'Accessibility', 'Desktop & Dock'],
    ['Notifications', 'Sound', 'Focus'],
    ['Lock Screen', 'Privacy & Security', 'Touch ID & Password', 'Users & Groups'],
  ]
  const colours = ['#4f86c6', '#4f86c6', '#4f86c6', '#8a8a8a', '#3a3a3a', '#4f86c6', '#5a7fa8', '#d9534f', '#d9534f', '#7b5fc7', '#3a3a3a', '#4f86c6', '#d9534f', '#8a8a8a']
  const items: { label: string; top: number; colour: string }[] = []
  let top = 70
  for (const g of groups) {
    for (const label of g) {
      items.push({ label, top, colour: colours[items.length] })
      top += 19
    }
    top += 8
  }
  return items
})()

const privacyRows = ['Location Services', 'Contacts', 'Calendars', 'Reminders', 'Photos', 'Bluetooth', 'Microphone', 'Camera', 'Files & Folders', 'Full Disk Access']
const generalRows = ['About', 'Software Update', 'Storage', 'AirDrop & Handoff', 'Login Items', 'Language & Region', 'Date & Time', 'Sharing', 'Time Machine', 'Startup Disk']
const appRows = [72, 58, 84, 64, 46, 78, 60, 70]

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const step = ref(0)
const t = ref(reducedMotion ? scenes[0].poster : 0)
const playing = ref(!reducedMotion)
const inView = ref(false)
const scale = ref(1)

const scene = computed(() => scenes[step.value])

// Easing and timing helpers
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)
const ramp = (a: number, b: number) => ease(clamp((t.value - a) / (b - a)))
const linear = (a: number, b: number) => clamp((t.value - a) / (b - a))
const during = (a: number, b: number) => t.value >= a && t.value < b

function cursorAt(time: number) {
  const p = scene.value.path
  if (time <= p[0][0]) return { x: p[0][1], y: p[0][2] }
  for (let i = 0; i < p.length - 1; i++) {
    const [a, x1, y1] = p[i]
    const [b, x2, y2] = p[i + 1]
    if (time < b) {
      const k = ease((time - a) / (b - a))
      return { x: x1 + (x2 - x1) * k, y: y1 + (y2 - y1) * k }
    }
  }
  const last = p[p.length - 1]
  return { x: last[1], y: last[2] }
}

const cursor = computed(() => cursorAt(t.value))
const pressed = computed(() => scene.value.presses.some(([a, b]) => during(a, b)))

const cursorStyle = computed(() => ({
  transform: `translate(${cursor.value.x}px, ${cursor.value.y}px) scale(${pressed.value ? 0.86 : 1})`,
}))

const ringStyle = computed(() => {
  const press = scene.value.presses.find(([a]) => during(a, a + 450))
  if (!press) return { opacity: 0 }
  const k = (t.value - press[0]) / 450
  const at = cursorAt(press[0])
  return {
    opacity: 0.55 * (1 - k),
    transform: `translate(${at.x}px, ${at.y}px) scale(${0.4 + k})`,
  }
})

const appear = (a: number, b: number) => {
  const k = ramp(a, b)
  return { opacity: k, transform: `scale(${0.96 + 0.04 * k})` }
}
const appearAndLeave = (a: number, b: number, c: number, d: number) => {
  const k = ramp(a, b) * (1 - ramp(c, d))
  return { opacity: k, transform: `scale(${0.96 + 0.04 * k})` }
}

// Scene 1: the dragged copy of the icon
const ghostStyle = computed(() => {
  const dragging = t.value >= 1250
  const leave = ramp(3300, 3700)
  const at = t.value < 3300 ? cursor.value : { x: 502, y: 238 }
  return {
    opacity: dragging ? 0.7 * (1 - leave) : 0,
    transform: `translate(${at.x - 48}px, ${at.y - 48}px) scale(${1 - 0.4 * leave})`,
  }
})

// Scene 3: the sidebar selection and the scrolled pane
const privacyShown = computed(() => t.value >= 1000)
const selectionTop = computed(() => (privacyShown.value ? 303 : 135))
const scroll = computed(() => 200 * ramp(1900, 3500))

// Scene 4: password dots
const dots = computed(() => '•'.repeat(Math.floor(linear(2700, 3900) * 6.99)))

// Playback
let raf = 0
let last = 0
const running = () => playing.value && inView.value

function frame(now: number) {
  if (!running()) {
    raf = 0
    return
  }
  t.value += now - last
  last = now
  if (t.value >= scene.value.duration) {
    t.value = 0
    step.value = (step.value + 1) % scenes.length
  }
  raf = requestAnimationFrame(frame)
}

function kick() {
  if (running() && !raf) {
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
}

watch([playing, inView], kick)

function toggle() {
  if (!playing.value && t.value >= scene.value.duration - 50) t.value = 0
  playing.value = !playing.value
}

function go(i: number) {
  step.value = i
  t.value = 0
  playing.value = true
}

function fill(i: number) {
  if (i < step.value) return 1
  if (i > step.value) return 0
  return Math.min(1, t.value / scene.value.duration)
}

const screen = ref<HTMLElement>()
let resize: ResizeObserver | undefined
let seen: IntersectionObserver | undefined

onMounted(() => {
  const el = screen.value!
  resize = new ResizeObserver(([entry]) => {
    scale.value = entry.contentRect.width / 800
  })
  resize.observe(el)
  seen = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), {
    threshold: 0.35,
  })
  seen.observe(el)
})

onBeforeUnmount(() => {
  resize?.disconnect()
  seen?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="install">
    <figure class="player" aria-label="Animated walkthrough: allowing Close Reader to open on a Mac">
      <div ref="screen" class="screen" aria-hidden="true">
        <div class="stage" :style="{ transform: `scale(${scale})` }">
          <div class="menubar">
            <strong>{{ scene.app }}</strong>
            <span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span>
            <span class="clock">10:41</span>
          </div>

          <!-- 1. Drag to Applications -->
          <template v-if="step === 0">
            <div class="win" :style="{ left: '170px', top: '90px', width: '460px', height: '290px', ...appear(0, 300) }">
              <div class="bar">
                <span class="lights"><i></i><i></i><i></i></span>
                <span class="wtitle">Close Reader {{ closeReader.version }}</span>
              </div>
              <div class="item" style="left: 80px; top: 100px">
                <img :src="icon" alt="" width="96" height="96" />
                <span>Close Reader</span>
              </div>
              <span class="drag-arrow" style="left: 196px; top: 147px"></span>
              <div class="item" :class="{ hot: during(2900, 3800) }" style="left: 284px; top: 100px">
                <span class="folder"></span>
                <span>Applications</span>
              </div>
            </div>
            <img class="ghost" :src="icon" alt="" width="96" height="96" :style="ghostStyle" />
          </template>

          <!-- 2. Blocked on first launch -->
          <template v-else-if="step === 1">
            <div class="win dialog" :style="{ left: '250px', top: '90px', width: '300px', height: '290px', ...appearAndLeave(0, 300, 3700, 4000) }">
              <span class="d-icon" style="top: 20px"><img :src="icon" alt="" width="64" height="64" /><b class="badge">!</b></span>
              <p class="d-title" style="top: 96px">“Close Reader” Not Opened</p>
              <p class="d-body" style="top: 122px">
                Apple could not verify “Close Reader” is free of malware that may harm your Mac or
                compromise your privacy.
              </p>
              <span class="mbtn primary" :class="{ down: during(3300, 3500) }" style="top: 206px">Done</span>
              <span class="mbtn" style="top: 242px">Move to Trash</span>
            </div>
          </template>

          <!-- 3. System Settings → Privacy & Security → Open Anyway -->
          <template v-else-if="step === 2">
            <div class="win settings" :style="{ left: '110px', top: '50px', width: '580px', height: '400px', ...appear(0, 300) }">
              <div class="side">
                <span class="lights" style="top: 14px; left: 14px"><i></i><i></i><i></i></span>
                <span class="search">Search</span>
                <span class="sel" :style="{ top: `${selectionTop}px` }"></span>
                <span
                  v-for="s in sidebar"
                  :key="s.label"
                  class="sitem"
                  :class="{ on: s.top === selectionTop }"
                  :style="{ top: `${s.top}px` }"
                  ><i :style="{ background: s.colour }"></i>{{ s.label }}</span
                >
              </div>
              <div class="pane">
                <p class="ptitle">{{ privacyShown ? 'Privacy & Security' : 'General' }}</p>
                <div class="viewport">
                  <div v-if="!privacyShown" class="card" style="top: 0">
                    <span v-for="r in generalRows" :key="r" class="row">{{ r }}<i>›</i></span>
                  </div>
                  <div v-else class="scroller" :style="{ transform: `translateY(${-scroll}px)` }">
                    <p class="glabel" style="top: 0">Privacy</p>
                    <div class="card" style="top: 24px">
                      <span v-for="r in privacyRows" :key="r" class="row">{{ r }}<i>›</i></span>
                    </div>
                    <p class="glabel" style="top: 316px">Security</p>
                    <div class="card" style="top: 344px">
                      <span class="row tall32">Allow applications from<em>App Store &amp; Known Developers</em></span>
                      <span class="row tall48 blocked">
                        “Close Reader” was blocked to protect your Mac.
                        <b class="mbtn inline" :class="{ down: during(4800, 5000) }">Open Anyway</b>
                      </span>
                    </div>
                    <div class="card" style="top: 440px">
                      <span class="row tall32">FileVault<em>On</em></span>
                      <span class="row tall32">Lockdown Mode<em>Off</em></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 4. Confirm, then password or Touch ID -->
          <template v-else-if="step === 3">
            <div class="win settings faded" style="left: 110px; top: 50px; width: 580px; height: 400px">
              <div class="side"><span class="lights" style="top: 14px; left: 14px"><i></i><i></i><i></i></span></div>
              <div class="pane"><p class="ptitle">Privacy &amp; Security</p></div>
            </div>
            <div class="win dialog" :style="{ left: '250px', top: '100px', width: '300px', height: '276px', ...appearAndLeave(0, 300, 1850, 2100) }">
              <span class="d-icon small" style="top: 20px"><img :src="icon" alt="" width="56" height="56" /></span>
              <p class="d-title" style="top: 86px">Open “Close Reader”?</p>
              <p class="d-body" style="top: 110px">
                macOS cannot verify the developer of “Close Reader”. Open it only if you trust where
                it came from.
              </p>
              <span class="mbtn primary" :class="{ down: during(1500, 1700) }" style="top: 196px">Open Anyway</span>
              <span class="mbtn" style="top: 232px">Done</span>
            </div>
            <div class="win dialog" :style="{ left: '260px', top: '110px', width: '280px', height: '240px', ...appearAndLeave(2150, 2450, 5100, 5400) }">
              <span class="touch" style="top: 20px"></span>
              <p class="d-title" style="top: 80px">Privacy &amp; Security</p>
              <p class="d-body" style="top: 102px">Use Touch ID or enter your password to allow this.</p>
              <span class="field" style="top: 146px">{{ dots }}<i v-if="during(2450, 4000)" class="caret"></i></span>
              <span class="mbtn half" style="top: 190px; left: 20px">Cancel</span>
              <span class="mbtn half primary" :class="{ down: during(4800, 5000) }" style="top: 190px; left: 144px">OK</span>
            </div>
          </template>

          <!-- 5. Close Reader opens -->
          <template v-else>
            <div class="win app" :style="{ left: '150px', top: '70px', width: '500px', height: '330px', ...appear(0, 600) }">
              <div class="bar">
                <span class="lights"><i></i><i></i><i></i></span>
                <span class="atitle">Close <em>Reader</em></span>
              </div>
              <div class="aside">
                <span v-for="w in [62, 80, 54, 70, 48, 66]" :key="w" class="line" :style="{ width: `${w}%` }"></span>
              </div>
              <div class="atable">
                <span v-for="(w, i) in appRows" :key="i" class="arow" :class="{ cur: i === 0 }">
                  <span class="line" :style="{ width: `${w}%` }"></span>
                </span>
              </div>
              <div class="aform">
                <span class="box"></span>
                <span class="box tall"></span>
                <span class="box"></span>
              </div>
            </div>
          </template>

          <span class="ring" :style="ringStyle"></span>
          <svg class="cursor" :style="cursorStyle" width="18" height="26" viewBox="0 0 14 21">
            <path d="M1 1 L1 17 L5 13.4 L7.8 19.8 L10.3 18.7 L7.6 12.4 L12.8 12.4 Z" />
          </svg>
        </div>
      </div>

      <div class="controls">
        <button
          type="button"
          class="play"
          :aria-label="playing ? 'Pause the walkthrough' : 'Play the walkthrough'"
          @click="toggle"
        >
          <svg v-if="playing" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="1.5" width="3" height="9" rx="0.6" />
            <rect x="7" y="1.5" width="3" height="9" rx="0.6" />
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 1.5 L10.5 6 L3 10.5 Z" />
          </svg>
        </button>
        <div class="bars">
          <button
            v-for="(s, i) in scenes"
            :key="i"
            type="button"
            class="seg"
            :style="{ flexGrow: s.duration }"
            :aria-label="`Step ${i + 1}: ${steps[i].title}`"
            @click="go(i)"
          >
            <span :style="{ transform: `scaleX(${fill(i)})` }"></span>
          </button>
        </div>
        <span class="count">{{ step + 1 }} / {{ scenes.length }}</span>
      </div>
    </figure>

    <ol class="steps">
      <li v-for="(s, i) in steps" :key="s.title" :class="{ active: i === step }">
        <button type="button" :aria-current="i === step ? 'step' : undefined" @click="go(i)">
          <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">
            <strong>{{ s.title }}</strong>
            <span>{{ s.body }}</span>
          </span>
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.install {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
}

@media (min-width: 980px) {
  .install {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;
  }
}

.player {
  margin: 0;
}

@media (min-width: 980px) {
  .player {
    position: sticky;
    top: 100px;
  }
}

/* The scaled 800×500 stage */
.screen {
  --ui: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  --btn: var(--partial);
  --btn-ink: var(--card);
  --folder: #7fa9d6;
  --folder-back: #6a95c4;

  position: relative;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  box-shadow: var(--shadow-card);
  background: linear-gradient(155deg, var(--paper-deep), var(--oxblood-soft));
}

@media (prefers-color-scheme: dark) {
  .screen {
    --folder: #4d7bae;
    --folder-back: #3f6895;
  }
}

.stage {
  position: absolute;
  inset: 0 auto auto 0;
  width: 800px;
  height: 500px;
  transform-origin: 0 0;
  font-family: var(--ui);
  font-size: 12px;
  line-height: 1.35;
  color: var(--ink);
}

.stage p {
  margin: 0;
}

.menubar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 24px;
  padding: 0 16px;
  background: color-mix(in srgb, var(--card) 72%, transparent);
  border-bottom: 1px solid var(--rule);
  font-size: 12px;
}

.menubar .clock {
  margin-left: auto;
  color: var(--ink-soft);
}

.win {
  position: absolute;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  box-shadow: 0 22px 44px -18px rgba(0, 0, 0, 0.45);
  transform-origin: 50% 50%;
}

.win.faded {
  opacity: 0.45;
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-bottom: 1px solid var(--rule);
  background: var(--paper-deep);
}

.lights {
  position: absolute;
  left: 12px;
  display: inline-flex;
  gap: 6px;
}

.lights i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--rule-strong);
}

.wtitle {
  font-weight: 600;
  color: var(--ink-soft);
}

/* Scene 1 */
.item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 96px;
  border-radius: 10px;
  transition: background 0.15s;
}

.item.hot {
  background: rgba(127, 127, 127, 0.2);
}

.item img {
  display: block;
}

.folder {
  position: relative;
  width: 96px;
  height: 96px;
}

.folder::before,
.folder::after {
  content: '';
  position: absolute;
}

.folder::before {
  left: 10px;
  top: 16px;
  width: 34px;
  height: 16px;
  border-radius: 5px 5px 0 0;
  background: var(--folder-back);
}

.folder::after {
  left: 6px;
  right: 6px;
  top: 26px;
  bottom: 12px;
  border-radius: 6px;
  background: var(--folder);
}

.drag-arrow {
  position: absolute;
  width: 68px;
  border-top: 2px dashed var(--ink-faint);
}

.drag-arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -7px;
  border-left: 10px solid var(--ink-faint);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.ghost {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

/* Dialogs */
.dialog > * {
  position: absolute;
  left: 20px;
  right: 20px;
  text-align: center;
}

.d-icon {
  left: 50%;
  right: auto;
  width: 64px;
  height: 64px;
  margin-left: -32px;
}

.d-icon.small {
  width: 56px;
  height: 56px;
  margin-left: -28px;
}

.d-icon img {
  display: block;
}

.badge {
  position: absolute;
  right: -4px;
  bottom: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f2b33d;
  border: 2px solid var(--card);
  color: #1f1a16;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}

.d-title {
  font-size: 13.5px;
  font-weight: 700;
}

.d-body {
  font-size: 11.5px;
  color: var(--ink-soft);
}

.mbtn {
  display: block;
  height: 28px;
  border: 1px solid var(--rule-strong);
  border-radius: 7px;
  background: var(--paper-deep);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 26px;
  text-align: center;
  color: var(--ink);
}

.mbtn.primary {
  border-color: var(--btn);
  background: var(--btn);
  color: var(--btn-ink);
}

.mbtn.half {
  right: auto;
  width: 116px;
}

.mbtn.down {
  filter: brightness(0.8);
}

.touch {
  left: 50%;
  right: auto;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, var(--invalid) 0 1.5px, transparent 1.5px 5px);
  box-shadow: 0 0 0 1px var(--rule);
}

.field {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border: 1px solid var(--btn);
  border-radius: 6px;
  background: var(--paper);
  font-size: 15px;
  letter-spacing: 2px;
  text-align: left;
}

.caret {
  width: 1px;
  height: 15px;
  margin-left: 2px;
  background: var(--ink);
}

/* Scene 3: System Settings */
.side {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 170px;
  background: var(--paper-deep);
  border-right: 1px solid var(--rule);
}

.side > * {
  position: absolute;
}

.search {
  left: 10px;
  right: 10px;
  top: 36px;
  height: 22px;
  padding-left: 9px;
  border-radius: 6px;
  background: var(--card);
  border: 1px solid var(--rule);
  font-size: 11px;
  line-height: 20px;
  color: var(--ink-faint);
}

.sel {
  left: 8px;
  right: 8px;
  height: 19px;
  border-radius: 5px;
  background: var(--btn);
}

.sitem {
  left: 16px;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 19px;
  font-size: 11.5px;
  white-space: nowrap;
}

.sitem i {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.sitem.on {
  color: var(--btn-ink);
}

.pane {
  position: absolute;
  left: 170px;
  right: 0;
  top: 0;
  bottom: 0;
}

.ptitle {
  position: absolute;
  left: 20px;
  top: 14px;
  font-size: 15px;
  font-weight: 700;
}

.viewport {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  overflow: hidden;
}

.scroller {
  position: absolute;
  inset: 0;
}

.glabel {
  position: absolute;
  left: 20px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-soft);
}

.card {
  position: absolute;
  left: 16px;
  right: 16px;
  border-radius: 8px;
  background: var(--paper);
  box-shadow: 0 0 0 1px var(--rule);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 28px;
  padding: 0 12px;
  border-bottom: 1px solid var(--rule);
  font-size: 11.5px;
}

.row:last-child {
  border-bottom: none;
}

.row i {
  font-style: normal;
  color: var(--ink-faint);
}

.row em {
  font-style: normal;
  color: var(--ink-faint);
}

.row.tall32 {
  height: 32px;
}

.row.tall48 {
  height: 48px;
}

.row.blocked {
  color: var(--ink-soft);
}

.mbtn.inline {
  flex: none;
  width: 92px;
  height: 24px;
  font-size: 11.5px;
  line-height: 22px;
}

/* Scene 5: the app */
.atitle {
  font-family: var(--serif);
  font-size: 15px;
}

.atitle em {
  color: var(--oxblood);
}

.app > div:not(.bar) {
  position: absolute;
  top: 31px;
  bottom: 0;
}

.aside {
  left: 0;
  width: 110px;
  padding: 16px 12px;
  background: var(--paper-deep);
  border-right: 1px solid var(--rule);
}

.line {
  display: block;
  height: 7px;
  margin-bottom: 12px;
  border-radius: 4px;
  background: var(--rule);
}

.atable {
  left: 110px;
  width: 210px;
  padding: 14px 12px;
  border-right: 1px solid var(--rule);
}

.arow {
  display: block;
  padding: 9px 8px 2px;
  border-bottom: 1px solid var(--rule);
}

.arow .line {
  margin-bottom: 7px;
}

.arow.cur {
  background: var(--oxblood-soft);
}

.aform {
  left: 320px;
  right: 0;
  padding: 14px;
}

.box {
  display: block;
  height: 24px;
  margin-bottom: 12px;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: var(--paper);
}

.box.tall {
  height: 110px;
}

/* Pointer */
.cursor,
.ring {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.cursor {
  transform-origin: 1px 1px;
}

.cursor path {
  fill: #111;
  stroke: #fff;
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.ring {
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  border-radius: 50%;
  border: 2px solid var(--oxblood);
}

/* Controls */
.controls {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}

.play {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  padding: 0;
  border: 1px solid var(--rule-strong);
  border-radius: 50%;
  background: var(--card);
  color: var(--ink);
  cursor: pointer;
}

.play svg {
  fill: currentColor;
}

.play:hover {
  border-color: var(--oxblood);
  color: var(--oxblood);
}

.bars {
  display: flex;
  flex: 1;
  gap: 5px;
}

.seg {
  position: relative;
  flex-basis: 0;
  padding: 10px 0;
  border: none;
  background: none;
  cursor: pointer;
}

.seg::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  height: 3px;
  border-radius: 2px;
  background: var(--rule);
}

.seg span {
  position: relative;
  display: block;
  height: 3px;
  border-radius: 2px;
  background: var(--oxblood);
  transform-origin: 0 50%;
}

.count {
  flex: none;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--ink-faint);
}

/* Steps, which double as the text version */
.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ink);
}

.steps li {
  border-bottom: 1px solid var(--rule);
}

.steps button {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 8px;
  width: 100%;
  padding: 16px 14px;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.steps .num {
  padding-top: 5px;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--ink-faint);
}

.steps strong {
  display: block;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.25;
}

.steps .text > span {
  display: block;
  margin-top: 4px;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.steps li.active button {
  box-shadow: inset 2px 0 0 var(--oxblood);
}

.steps li.active .num,
.steps li.active strong {
  color: var(--oxblood);
}

.steps button:hover strong {
  color: var(--oxblood);
}
</style>
