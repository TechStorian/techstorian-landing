<script setup lang="ts">
import { links, openSource, refcheckFeatures, refcheckSample, type RefStatus } from '../content'

const statusLabel: Record<RefStatus, string> = {
  valid: 'Valid',
  partial: 'Partially valid',
  invalid: 'Not found',
}
</script>

<template>
  <section id="software" class="section">
    <div class="wrap">
      <header class="section-head">
        <p class="label">Fol. 01 — Software</p>
        <div>
          <h2>Tools that show their <em>sources</em>.</h2>
          <p class="lede">
            Our products are built for people who have to be sure and who need to be able to
            explain how they know.
          </p>
        </div>
      </header>

      <article class="product">
        <div class="product-copy">
          <p class="label kicker">Product · Available to institutions</p>
          <h3>RefCheck</h3>
          <p class="tagline">Find fabricated references in any paper.</p>
          <p class="desc">
            Upload a paper, thesis or exam submission. RefCheck extracts every reference and checks
            that each one exists by looking it up in doi.org, Crossref, DataCite, OpenAlex and
            library catalogues. You get a clear list of what exists, what doesn’t, and why.
          </p>
          <ul class="features">
            <li v-for="f in refcheckFeatures" :key="f.title">
              <strong>{{ f.title }}.</strong> {{ f.body }}
            </li>
          </ul>
          <a class="btn btn-primary" :href="links.refcheck">
            Visit RefCheck <span class="arrow">→</span>
          </a>
        </div>

        <div class="report" aria-label="Example RefCheck report">
          <div class="report-head">
            <span class="label">Report · bibliography.pdf</span>
            <span class="label">3 references</span>
          </div>
          <ol>
            <li v-for="(ref, i) in refcheckSample" :key="i" class="slip">
              <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
              <div>
                <p class="cite">{{ ref.citation }}</p>
                <p class="note">{{ ref.note }}</p>
              </div>
              <span class="stamp" :class="ref.status">{{ statusLabel[ref.status] }}</span>
            </li>
          </ol>
          <p class="caption">Illustrative example.</p>
        </div>
      </article>

      <div class="oss">
        <div class="oss-head">
          <h3>Open research software</h3>
          <p>
            Tools for the archived web that our founder develops or co-develops with research
            libraries and projects. Openly licensed and citable.
          </p>
        </div>
        <ul class="oss-list">
          <li v-for="p in openSource" :key="p.name">
            <a :href="p.href" class="oss-item">
              <span class="label">{{ p.role }} · {{ p.lang }}</span>
              <span class="oss-name">{{ p.name }} <span class="arrow" aria-hidden="true">↗</span></span>
              <span class="oss-body">{{ p.body }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 48px;
  padding: clamp(28px, 5vw, 56px);
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 4px;
}

@media (min-width: 960px) {
  .product {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 56px;
  }
}

.kicker {
  color: var(--oxblood);
}

.product h3 {
  margin-top: 14px;
  font-size: clamp(2.4rem, 5vw, 3.2rem);
  font-weight: 450;
}

.tagline {
  margin-top: 6px;
  font-size: 1.3rem;
  font-style: italic;
  color: var(--ink-soft);
}

.desc {
  margin-top: 22px;
  color: var(--ink-soft);
}

.features {
  margin: 26px 0 32px;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rule);
}

.features li {
  padding: 14px 0;
  border-bottom: 1px solid var(--rule);
  font-size: 1.02rem;
  color: var(--ink-soft);
}

.features strong {
  font-weight: 600;
  color: var(--ink);
}

/* The report mock-up */
.report {
  align-self: start;
  padding: 22px;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 3px;
}

.report-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--rule-strong);
}

.report ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

.slip {
  position: relative;
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 12px;
  padding: 18px 0 20px;
  border-bottom: 1px solid var(--rule);
}

.num {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--ink-faint);
  padding-top: 4px;
}

.cite {
  font-size: 0.98rem;
  line-height: 1.45;
}

.note {
  margin-top: 6px;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--ink-faint);
}

/* Archival rubber stamp */
.stamp {
  justify-self: start;
  grid-column: 2;
  margin-top: 4px;
  padding: 3px 9px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transform: rotate(-2deg);
  opacity: 0.92;
}

.slip:nth-child(2) .stamp {
  transform: rotate(1.5deg);
}

.stamp.valid {
  color: var(--valid);
  background: var(--valid-bg);
}
.stamp.partial {
  color: var(--partial);
  background: var(--partial-bg);
}
.stamp.invalid {
  color: var(--invalid);
  background: var(--invalid-bg);
}

.caption {
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--ink-faint);
}

/* Open-source list */
.oss {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 32px;
  margin-top: clamp(64px, 9vw, 104px);
}

@media (min-width: 880px) {
  .oss {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 40px;
  }
}

.oss-head h3 {
  font-size: 1.5rem;
}

.oss-head p {
  margin-top: 12px;
  font-size: 1rem;
  color: var(--ink-soft);
}

.oss-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ink);
}

.oss-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 6px 32px;
  padding: 22px 0;
  border-bottom: 1px solid var(--rule);
  text-decoration: none;
  transition: background 0.16s ease;
}

@media (min-width: 720px) {
  .oss-item {
    grid-template-columns: 180px minmax(0, 1.3fr) minmax(0, 1.4fr);
    align-items: baseline;
  }
}

.oss-name {
  font-size: 1.35rem;
}

.oss-name .arrow {
  color: var(--oxblood);
  font-size: 0.95rem;
}

.oss-body {
  font-size: 1rem;
  color: var(--ink-soft);
}

.oss-item:hover .oss-name {
  color: var(--oxblood);
}
</style>
