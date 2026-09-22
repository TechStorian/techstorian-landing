<script setup lang="ts">
import CatalogueCard from './CatalogueCard.vue'

const materials = [
  'Validating references',
  'Web archives',
  'Theses & dissertations',
  'Digitised collections',
  'Footnotes',
  'Collections as data',
]
</script>

<template>
  <section id="top" class="hero">
    <div class="wrap grid">
      <div class="copy">
        <p class="label eyebrow">Research software for cultural heritage</p>
        <h1>Software for the <em>historical record</em>.</h1>
        <p class="lede">
          techstorian builds tools for archives, libraries, universities and everyone whose work
          depends on the past being documented, findable and true.
        </p>
        <div class="actions">
          <a class="btn btn-primary" href="#software">See our software <span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#contact">Get in touch</a>
        </div>
      </div>
      <CatalogueCard />
    </div>

    <div class="wrap">
      <div class="materials">
        <span class="label">We work with</span>
        <ul>
          <li v-for="m in materials" :key="m">{{ m }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: clamp(48px, 8vw, 104px) 0 clamp(40px, 6vw, 64px);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 64px;
  align-items: center;
}

@media (min-width: 960px) {
  .grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 56px;
  }
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

.lede {
  margin-top: 28px;
  max-width: 34ch;
  font-size: clamp(1.2rem, 2.2vw, 1.4rem);
  line-height: 1.5;
  color: var(--ink-soft);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.materials {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px 28px;
  margin-top: clamp(56px, 8vw, 96px);
  padding-top: 22px;
  border-top: 1px solid var(--rule);
}

.materials ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
  margin: 0;
  padding: 0;
  list-style: none;
  font-style: italic;
  color: var(--ink-soft);
}

.materials li + li::before {
  content: '·';
  margin: 0 12px;
  color: var(--rule-strong);
  font-style: normal;
}

@media (max-width: 640px) {
  .materials ul {
    gap: 4px 18px;
  }
  .materials li + li::before {
    content: none;
  }
}
</style>
