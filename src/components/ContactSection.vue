<script setup lang="ts">
import { contact } from '../content'
</script>

<template>
  <section id="contact" class="section contact">
    <div class="wrap inner">
      <p class="label">Fol. 05 — Correspondence</p>
      <h2>Have a collection, a problem, or a <em>project</em>?</h2>
      <p class="lede">
        Whether you want a RefCheck demo for your institution, help with a web archive, or a
        workshop for your researchers, write to us!
      </p>
      <a class="mail" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      <p class="label place">{{ contact.location }}</p>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--oxblood);
  color: var(--paper);
  border-top: none;
}

@media (prefers-color-scheme: dark) {
  .contact {
    background: var(--oxblood-soft);
    color: var(--ink);
  }
}

.inner {
  text-align: center;
}

.contact .label {
  color: inherit;
  opacity: 0.72;
}

h2 {
  margin: 24px auto 0;
  max-width: 16ch;
  font-size: clamp(2.3rem, 6vw, 4.2rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
}

h2 em {
  font-weight: 350;
}

.lede {
  margin: 26px auto 0;
  max-width: 52ch;
  font-size: 1.2rem;
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

.place {
  margin-top: 28px;
}
</style>
