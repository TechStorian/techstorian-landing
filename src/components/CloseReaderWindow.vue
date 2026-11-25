<script setup lang="ts">
// A drawn version of the Close Reader window: filter sidebar, note table, current note.
// The data is the app's own (fictional) demo project.
import { closeReaderDemo as demo } from '../content'
</script>

<template>
  <figure class="window" aria-label="Illustration of the Close Reader window with the demo project open">
    <div class="titlebar">
      <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="app">Close <em>Reader</em></span>
      <span class="slash" aria-hidden="true">/</span>
      <span class="project">{{ demo.project }}</span>
      <span class="search">Search notes, sources, tags…</span>
      <span class="pill">+ New source</span>
      <span class="pill solid">+ New note</span>
    </div>

    <div class="panes">
      <aside class="side" aria-label="Filters">
        <p class="group">Sources</p>
        <ul>
          <li v-for="s in demo.sources" :key="s.name">
            <span class="box" :class="{ ticked: s.name === demo.current.source }"></span>
            <span class="name">{{ s.name }}</span>
            <span class="count">{{ s.count }}</span>
          </li>
        </ul>
        <p class="group"><span class="dot theme"></span>Theme</p>
        <ul>
          <li v-for="t in demo.themes" :key="t.name">
            <span class="box"></span>
            <span class="name">{{ t.name }}</span>
            <span class="count">{{ t.count }}</span>
          </li>
        </ul>
      </aside>

      <div class="table" aria-label="Notes">
        <p class="meta">14 notes</p>
        <ol>
          <li class="head">Note</li>
          <li v-for="(n, i) in demo.notes" :key="i" :class="{ current: i === 0 }">{{ n }}</li>
        </ol>
      </div>

      <div class="form" aria-label="Current note">
        <div class="row2">
          <div>
            <p class="field">Source</p>
            <p class="input">{{ demo.current.source }}</p>
          </div>
          <div>
            <p class="field">Page</p>
            <p class="input">{{ demo.current.page }}</p>
          </div>
        </div>
        <p class="detail">{{ demo.current.sourceDetail }}</p>
        <p class="field">Note</p>
        <p class="input text">{{ demo.current.text }}</p>
        <dl class="tags">
          <div v-for="t in demo.current.tags" :key="t.type">
            <dt><span class="dot" :class="t.type"></span>{{ t.label }}</dt>
            <dd class="input">{{ t.values.join(', ') }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <figcaption>From the demo project. All sources and quotations in it are fictional.</figcaption>
  </figure>
</template>

<style scoped>
.window {
  --cr-theme: #b8913a;
  --cr-person: #4f8a78;
  --cr-place: #4f6d8a;
  --cr-org: #a0522d;

  margin: 0;
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  box-shadow: var(--shadow-card);
  font-size: 0.82rem;
  line-height: 1.4;
}

.titlebar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--rule);
  white-space: nowrap;
}

.lights {
  display: inline-flex;
  gap: 6px;
}

.lights i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--rule-strong);
}

.app {
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}

.app em {
  color: var(--oxblood);
}

.slash,
.project {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--ink-faint);
}

.search {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 12px;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--card);
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--ink-faint);
}

.pill {
  padding: 4px 12px;
  border: 1px solid var(--oxblood);
  border-radius: 999px;
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--oxblood);
}

.pill.solid {
  background: var(--oxblood);
  color: var(--paper);
}

.panes {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .panes {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  }
}

@media (min-width: 960px) {
  .panes {
    grid-template-columns: 190px minmax(0, 1fr) minmax(0, 1.05fr);
  }
}

/* Sidebar */
.side {
  display: none;
  padding: 14px 12px;
  background: var(--paper-deep);
  border-right: 1px solid var(--rule);
}

@media (min-width: 960px) {
  .side {
    display: block;
  }
}

.group {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 4px 0 6px;
  font-family: var(--mono);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.side ul {
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}

.side li {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

.box {
  width: 11px;
  height: 11px;
  border: 1px solid var(--rule-strong);
  border-radius: 2px;
  background: var(--card);
}

.box.ticked {
  background: var(--oxblood);
  border-color: var(--oxblood);
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  font-family: var(--mono);
  font-size: 0.64rem;
  color: var(--ink-faint);
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.dot.theme { background: var(--cr-theme); }
.dot.person { background: var(--cr-person); }
.dot.place { background: var(--cr-place); }
.dot.org { background: var(--cr-org); }

/* Note table */
.table {
  padding: 14px;
  border-right: 1px solid var(--rule);
}

.meta {
  margin-bottom: 8px;
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--ink-faint);
}

.table ol {
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 3px;
}

.table li {
  padding: 7px 10px;
  border-bottom: 1px solid var(--rule);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table li:last-child {
  border-bottom: none;
}

.table li.head {
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.table li.current {
  background: var(--oxblood-soft);
}

/* Note form */
.form {
  display: none;
  padding: 14px 16px;
}

@media (min-width: 640px) {
  .form {
    display: block;
  }
}

.row2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 84px;
  gap: 10px;
}

.field,
dt {
  margin-bottom: 4px;
  font-family: var(--mono);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.input {
  padding: 5px 9px;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.detail {
  margin: 5px 0 12px;
  font-family: var(--mono);
  font-size: 0.62rem;
  color: var(--ink-faint);
}

.input.text {
  min-height: 96px;
  padding: 9px 11px;
  white-space: normal;
  font-size: 0.92rem;
}

.tags {
  margin: 12px 0 0;
}

.tags div {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.tags dt {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
}

.tags dd {
  margin: 0;
}

figcaption {
  padding: 8px 16px;
  border-top: 1px solid var(--rule);
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--ink-faint);
}

@media (max-width: 560px) {
  .search,
  .slash,
  .project,
  .pill:not(.solid) {
    display: none;
  }
}
</style>
