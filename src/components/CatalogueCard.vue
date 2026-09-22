<script setup lang="ts">
import { contact } from '../content'

const entries = [
  { key: 'Subject', value: 'Research software — Cultural heritage' },
  { key: 'Scope', value: 'Web archives · Libraries · Research integrity' },
  { key: 'Holdings', value: 'RefCheck; open-source research tools' },
  { key: 'Place', value: contact.location },
]
</script>

<template>
  <figure class="stack" aria-label="techstorian described as a library catalogue card">
    <div class="card behind behind-2" aria-hidden="true"></div>
    <div class="card behind behind-1" aria-hidden="true"></div>
    <div class="card front">
      <div class="top">
        <span>TS&thinsp;·&thinsp;001</span>
        <span>Aarhus</span>
      </div>
      <p class="title">techstorian.</p>
      <p class="subtitle">Software for the historical record / made by a historian who writes code.</p>
      <dl>
        <div v-for="entry in entries" :key="entry.key" class="row">
          <dt>{{ entry.key }}</dt>
          <dd>{{ entry.value }}</dd>
        </div>
      </dl>
      <p class="tracing">1. Archives — Data processing. 2. Digital humanities. I. Title.</p>
      <span class="hole" aria-hidden="true"></span>
    </div>
  </figure>
</template>

<style scoped>
.stack {
  position: relative;
  margin: 0;
  width: 100%;
  max-width: 520px;
  justify-self: center;
}

.card {
  border-radius: 3px;
  background: var(--card);
  border: 1px solid var(--rule);
  box-shadow: var(--shadow-card);
}

.behind {
  position: absolute;
  inset: 0;
}

.front {
  position: relative;
}

.behind-2 {
  transform: translate(18px, -22px) rotate(2.4deg);
  background: var(--paper-deep);
}

.behind-1 {
  transform: translate(9px, -11px) rotate(1.1deg);
}

.front {
  display: flex;
  flex-direction: column;
  padding: clamp(20px, 4vw, 30px) clamp(20px, 4.4vw, 34px) 52px;
  font-family: var(--mono);
  font-size: clamp(0.66rem, 1.6vw, 0.76rem);
  line-height: 1.5;
  color: var(--ink-soft);
}

.top {
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--card-margin);
}

.title {
  margin-top: 12px;
  font-family: var(--serif);
  font-size: clamp(1.3rem, 3.4vw, 1.7rem);
  color: var(--ink);
  letter-spacing: -0.01em;
}

.subtitle {
  margin-top: 2px;
  color: var(--ink-soft);
}

dl {
  margin: 12px 0 0;
}

.row {
  display: grid;
  grid-template-columns: clamp(52px, 11vw, 70px) 1fr;
  gap: 12px;
  padding: 5px 0;
  border-bottom: 1px dotted var(--rule);
}

dt {
  color: var(--ink-faint);
}

dd {
  margin: 0;
  color: var(--ink);
}

.tracing {
  margin-top: auto;
  padding-top: 10px;
  color: var(--ink-faint);
}

.hole {
  position: absolute;
  left: 50%;
  bottom: 12px;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  background: var(--paper);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
}


</style>
