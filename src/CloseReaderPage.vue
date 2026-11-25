<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CloseReaderWindow from './components/CloseReaderWindow.vue'
import InstallWalkthrough from './components/InstallWalkthrough.vue'
import icon from './assets/close-reader-icon.png'
import { closeReader, contact } from './content'

const askHref = `mailto:${contact.email}?subject=${encodeURIComponent('Close Reader')}`
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <AppHeader home="/" />
  <main id="main">
    <section class="hero">
      <div class="wrap">
        <p class="label eyebrow">Software · Research notes</p>
        <h1>
          <img class="icon" :src="icon" alt="" width="88" height="88" />
          <span>Close <em>Reader</em></span>
        </h1>
        <p class="tagline">Structured research notes for historians.</p>
        <p class="lede">
          A note-taking tool for the reading you do away from the computer: in the archive, in the
          library, or with books and microfilm. Close Reader keeps every note tied to the source
          it came from, so you can find it, sort it and cite it when it’s time to write.
        </p>
        <div class="actions">
          <a class="btn btn-primary" :href="askHref">Ask for a copy <span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#idea">How it works</a>
        </div>
        <p class="label facts">
          Version {{ closeReader.version }} · {{ closeReader.platform }} · Demo project included
        </p>
      </div>

      <div class="wrap shot">
        <CloseReaderWindow />
      </div>
    </section>

    <section id="idea" class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="label">Fol. 01 — The idea</p>
          <div>
            <h2>The spreadsheet you already keep, with real <em>sources</em>.</h2>
            <p class="lede">
              Many historians keep their research notes in a spreadsheet: one row per note, one
              column for the note itself and the rest for where it came from and what it is about.
              Close Reader works the same way, and adds what a spreadsheet can’t.
            </p>
          </div>
        </header>

        <ul class="features">
          <li v-for="(f, i) in closeReader.features" :key="f.title">
            <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3>{{ f.title }}</h3>
            <p>{{ f.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="label">Fol. 02 — How notes are kept</p>
          <div>
            <h2>Five things, and <em>one</em> file.</h2>
            <p class="lede">
              Everything in Close Reader is built from five kinds of record. A project is a single
              <code>.crproj</code> file, so it’s easy to back up, move between machines or share
              with a colleague.
            </p>
          </div>
        </header>

        <dl class="model">
          <div v-for="m in closeReader.model" :key="m.term" class="entry">
            <dt>{{ m.term }}</dt>
            <dd>{{ m.body }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="label">Fol. 03 — At the reading-room desk</p>
          <div>
            <h2>A quiet window, made for <em>typing fast</em>.</h2>
            <p class="lede">
              Filters on the left, your notes in the middle in a table that works like a
              spreadsheet, and the current note on the right. Every tag type and metadata field gets
              its own column. Light and dark mode follow your system.
            </p>
          </div>
        </header>

        <div class="work">
          <div class="block">
            <h3>Keyboard</h3>
            <ul class="keys">
              <li v-for="s in closeReader.shortcuts" :key="s.keys">
                <kbd>{{ s.keys }}</kbd>
                <span>{{ s.body }}</span>
              </li>
            </ul>
          </div>
          <div class="block">
            <h3>In and out</h3>
            <ul class="exchange">
              <li v-for="e in closeReader.exchange" :key="e.title">
                <strong>{{ e.title }}.</strong> {{ e.body }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="install" class="section">
      <div class="wrap">
        <header class="section-head">
          <p class="label">Fol. 04 — Opening it the first time</p>
          <div>
            <h2>One <em>extra</em> step on a Mac.</h2>
            <p class="lede">
              Close Reader isn’t signed and notarised by Apple yet, so macOS blocks it the first time
              you open it. Allowing it takes under a minute, and you only have to do it once.
            </p>
          </div>
        </header>

        <InstallWalkthrough />
      </div>
    </section>

    <section class="section ask">
      <div class="wrap inner">
        <p class="label">Fol. 05 — Correspondence</p>
        <h2>Try it on your own <em>sources</em>.</h2>
        <p class="lede">
          Close Reader is in its first release, for {{ closeReader.platform }}. It opens with a demo
          project of archive notes on a cholera outbreak in an invented port town, so you can find
          your way around before you start. Write to us for a copy, or to tell us what your
          research needs.
        </p>
        <a class="mail" :href="askHref">{{ contact.email }}</a>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.skip {
  position: absolute;
  left: 16px;
  top: -60px;
  z-index: 100;
  padding: 10px 16px;
  background: var(--oxblood);
  color: var(--paper);
  font-family: var(--mono);
  font-size: 0.8rem;
}

.skip:focus {
  top: 12px;
}

/* Hero */
.hero {
  padding: clamp(48px, 8vw, 96px) 0 clamp(56px, 8vw, 96px);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.eyebrow::before {
  content: '';
  width: 28px;
  height: 1px;
  background: var(--oxblood);
}

h1 {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.4vw, 24px);
  margin-top: 22px;
  font-size: clamp(2.9rem, 8vw, 5.6rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  font-weight: 350;
}

h1 em {
  color: var(--oxblood);
  font-weight: 400;
}

.icon {
  width: 0.95em;
  height: 0.95em;
  flex: none;
}

.tagline {
  margin-top: 14px;
  font-size: clamp(1.3rem, 2.6vw, 1.6rem);
  font-style: italic;
  color: var(--ink-soft);
}

.lede {
  margin-top: 22px;
  max-width: 54ch;
  font-size: clamp(1.15rem, 2vw, 1.3rem);
  line-height: 1.5;
  color: var(--ink-soft);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.facts {
  margin-top: 22px;
}

.shot {
  margin-top: clamp(48px, 7vw, 80px);
}

/* Features */
.features {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ink);
}

@media (min-width: 760px) {
  .features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 48px;
  }
}

.features li {
  padding: 26px 0 30px;
  border-bottom: 1px solid var(--rule);
}

.features .num {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--oxblood);
}

.features h3 {
  margin-top: 8px;
  font-size: 1.5rem;
}

.features p {
  margin-top: 10px;
  color: var(--ink-soft);
}

/* Data model */
code {
  font-family: var(--mono);
  font-size: 0.85em;
  padding: 1px 5px;
  background: var(--paper-deep);
  border-radius: 3px;
}

.model {
  margin: 0;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 4px;
  box-shadow: var(--shadow-card);
}

.entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px 32px;
  padding: 20px clamp(20px, 4vw, 36px);
  border-bottom: 1px dotted var(--rule-strong);
}

.entry:last-child {
  border-bottom: none;
}

@media (min-width: 720px) {
  .entry {
    grid-template-columns: 200px minmax(0, 1fr);
    align-items: baseline;
  }
}

.entry dt {
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--oxblood);
}

.entry dd {
  margin: 0;
  color: var(--ink-soft);
}

/* Keyboard and import/export */
.work {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
}

@media (min-width: 880px) {
  .work {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 56px;
  }
}

.block h3 {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--ink);
  font-size: 1.5rem;
}

.keys,
.exchange {
  margin: 0;
  padding: 0;
  list-style: none;
}

.keys li {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: baseline;
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-soft);
}

kbd {
  justify-self: start;
  padding: 2px 9px;
  background: var(--card);
  border: 1px solid var(--rule-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--ink);
}

.exchange li {
  padding: 14px 0;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-soft);
}

.exchange strong {
  font-weight: 600;
  color: var(--ink);
}

/* Closing band, as on the front page */
.ask {
  background: var(--oxblood);
  color: var(--paper);
  border-top: none;
}

@media (prefers-color-scheme: dark) {
  .ask {
    background: var(--oxblood-soft);
    color: var(--ink);
  }
}

.inner {
  text-align: center;
}

.ask .label {
  color: inherit;
  opacity: 0.72;
}

.ask h2 {
  margin: 24px auto 0;
  max-width: 16ch;
  font-size: clamp(2.3rem, 6vw, 4.2rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
}

.ask h2 em {
  font-weight: 350;
}

.ask .lede {
  margin: 26px auto 0;
  max-width: 56ch;
  font-size: 1.2rem;
  color: inherit;
  opacity: 0.86;
}

.mail {
  display: inline-block;
  margin-top: 40px;
  padding-bottom: 6px;
  border-bottom: 1px solid currentColor;
  font-size: clamp(1.4rem, 4vw, 2.1rem);
  font-style: italic;
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: opacity 0.16s ease;
}

.mail:hover {
  opacity: 0.75;
}
</style>
