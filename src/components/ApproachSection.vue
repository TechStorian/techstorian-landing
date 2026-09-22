<script setup lang="ts">
import { principles, services } from '../content'

const numerals = ['I', 'II', 'III']
</script>

<template>
  <section id="approach" class="section approach">
    <div class="wrap">
      <header class="section-head">
        <p class="label">Fol. 02 — Approach</p>
        <div>
          <h2>Built with a <em>historian’s</em> habits.</h2>
          <p class="lede">
            Source criticism, provenance and patience with messy material are the core of historical
            method. They are also a good way to build software.
          </p>
        </div>
      </header>

      <ol class="principles">
        <li v-for="(p, i) in principles" :key="p.title">
          <span class="numeral">{{ numerals[i] }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </li>
      </ol>

      <div class="services">
        <p class="label">What we do</p>
        <dl>
          <div v-for="s in services" :key="s.title" class="service">
            <dt>{{ s.title }}</dt>
            <dd>{{ s.body }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.approach {
  background: var(--paper-deep);
}

.principles {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 880px) {
  .principles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.principles li {
  padding: 32px 0;
  border-top: 1px solid var(--ink);
}

@media (min-width: 880px) {
  .principles li {
    padding: 32px 36px 8px 0;
  }
  .principles li + li {
    padding-left: 36px;
    border-left: 1px solid var(--rule-strong);
  }
}

.numeral {
  display: block;
  font-size: 2.6rem;
  font-style: italic;
  line-height: 1;
  color: var(--oxblood);
}

.principles h3 {
  margin-top: 22px;
  font-size: 1.55rem;
}

.principles p {
  margin-top: 12px;
  color: var(--ink-soft);
}

.services {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  margin-top: clamp(56px, 8vw, 88px);
}

@media (min-width: 880px) {
  .services {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 40px;
  }
}

.services dl {
  margin: 0;
}

.service {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px 32px;
  padding: 18px 0;
  border-bottom: 1px solid var(--rule-strong);
}

.service:first-child {
  border-top: 1px solid var(--rule-strong);
}

@media (min-width: 720px) {
  .service {
    grid-template-columns: 240px minmax(0, 1fr);
  }
}

dt {
  font-size: 1.3rem;
}

dd {
  margin: 0;
  color: var(--ink-soft);
}
</style>
