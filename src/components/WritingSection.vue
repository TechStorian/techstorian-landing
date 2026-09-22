<script setup lang="ts">
import { links, writing } from '../content'
</script>

<template>
  <section id="writing" class="section">
    <div class="wrap">
      <header class="section-head">
        <p class="label">Fol. 03 — Writing</p>
        <div>
          <h2>techstorian, <em>the newsletter</em>.</h2>
          <p class="lede">{{ writing.blurb }}</p>
        </div>
      </header>

      <div class="grid">
        <a class="clipping" :href="writing.featured.href">
          <span class="label">Latest essay · {{ writing.featured.date }}</span>
          <span class="title">{{ writing.featured.title }}</span>
          <span class="read">Read on Substack <span class="arrow">→</span></span>
        </a>
        <div class="subscribe">
          <p>
            New essays land on Substack. Subscribe to follow along for free, and you will never hear
            from us more often than there is something worth saying.
          </p>
          <a class="btn btn-ghost" :href="links.substack">Subscribe on Substack <span class="arrow">→</span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
}

@media (min-width: 880px) {
  .grid {
    grid-template-columns: 220px minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 40px;
  }
  .clipping {
    grid-column: 2;
  }
}

/* Styled like a newspaper clipping */
.clipping {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(24px, 4vw, 40px);
  background: var(--card);
  border: 1px solid var(--rule);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transform: rotate(-0.6deg);
  transition: transform 0.2s ease;
}

.clipping:hover {
  transform: rotate(0deg) translateY(-2px);
}

.clipping .title {
  font-size: clamp(1.7rem, 3.4vw, 2.4rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  padding-top: 16px;
  border-top: 3px double var(--ink);
}

.clipping .read {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--oxblood);
}

.subscribe {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  color: var(--ink-soft);
}
</style>
