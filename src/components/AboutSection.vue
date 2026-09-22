<script setup lang="ts">
import { founder, links } from '../content'
import portrait from '../assets/victor.jpg'

const profiles = [
  { label: 'harbojohnston.dk', href: links.founderSite },
  { label: 'GitHub', href: links.github },
  { label: 'LinkedIn', href: links.linkedin },
  { label: 'ORCID', href: links.orcid },
  { label: 'Aarhus University', href: links.pure },
]
</script>

<template>
  <section id="about" class="section about">
    <div class="wrap">
      <header class="section-head">
        <p class="label">Fol. 04 — About</p>
        <div>
          <h2>A historian who <em>writes code</em>.</h2>
        </div>
      </header>

      <div class="grid">
        <aside class="record">
          <figure class="portrait">
            <img :src="portrait" :alt="`Portrait of ${founder.name}`" width="120" height="150" loading="lazy" />
          </figure>
          <p class="label">{{ founder.role }}</p>
          <p class="name">{{ founder.name }}</p>
          <dl>
            <div v-for="f in founder.facts" :key="f.label">
              <dt class="label">{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          </dl>
        </aside>

        <div class="bio">
          <p v-for="(para, i) in founder.bio" :key="i">{{ para }}</p>
          <p>
            techstorian is where that combination turns into software: tools shaped by years of
            working with archived web, digitised collections and the practicalities of research.
          </p>
          <ul class="profiles">
            <li v-for="p in profiles" :key="p.href">
              <a class="text-link" :href="p.href">{{ p.label }}</a>
            </li>
          </ul>
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
    grid-template-columns: 220px minmax(0, 1fr);
  }
  .bio {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 40px;
    align-content: start;
  }
  .bio > p:first-child {
    grid-column: 1 / -1;
    font-size: 1.45rem;
    line-height: 1.45;
    color: var(--ink);
  }
  .profiles {
    grid-column: 1 / -1;
  }
}

.record {
  padding-top: 16px;
  border-top: 1px solid var(--ink);
}

.portrait {
  width: 120px;
  margin: 0 0 20px;
  padding: 6px 6px 18px;
  background: var(--card);
  border: 1px solid var(--rule);
  box-shadow: var(--shadow-card);
  transform: rotate(-1.5deg);
}

.portrait img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: sepia(0.12) saturate(0.9);
}

.name {
  margin-top: 8px;
  font-size: 1.5rem;
  line-height: 1.2;
}

.record dl {
  margin: 20px 0 0;
}

.record dl div {
  padding: 10px 0;
  border-top: 1px solid var(--rule);
}

.record dd {
  margin: 2px 0 0;
  font-size: 1rem;
}

.bio {
  color: var(--ink-soft);
}

.bio > p + p {
  margin-top: 20px;
}

@media (min-width: 880px) {
  .bio > p + p {
    margin-top: 0;
  }
}

.profiles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
  margin: 12px 0 0;
  padding: 20px 0 0;
  list-style: none;
  border-top: 1px solid var(--rule);
  font-family: var(--mono);
  font-size: 0.82rem;
}
</style>
