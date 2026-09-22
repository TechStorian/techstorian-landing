<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BrandMark from './BrandMark.vue'

const nav = [
  { href: '#software', label: 'Software' },
  { href: '#approach', label: 'Approach' },
  { href: '#writing', label: 'Writing' },
  { href: '#about', label: 'About' },
]

const scrolled = ref(false)
const open = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ scrolled, open }">
    <div class="wrap bar">
      <a class="brand" href="#top" aria-label="techstorian, back to top" @click="open = false">
        <BrandMark />
        <span class="wordmark">techstorian</span>
      </a>

      <button
        class="toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="site-nav"
        @click="open = !open"
      >
        <span class="label">{{ open ? 'Close' : 'Menu' }}</span>
      </button>

      <nav id="site-nav" class="nav" aria-label="Main">
        <a v-for="item in nav" :key="item.href" :href="item.href" @click="open = false">
          {{ item.label }}
        </a>
        <a class="cta" href="#contact" @click="open = false">Get in touch</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.header.scrolled,
.header.open {
  border-bottom-color: var(--rule);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
}

.wordmark {
  font-size: 1.45rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
  font-family: var(--mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.nav a {
  text-decoration: none;
  color: var(--ink-soft);
  transition: color 0.16s ease;
}

.nav a:hover {
  color: var(--oxblood);
}

.nav .cta {
  padding: 8px 16px;
  border: 1px solid var(--oxblood);
  border-radius: 999px;
  color: var(--oxblood);
}

.nav .cta:hover {
  background: var(--oxblood);
  color: var(--paper);
}

.toggle {
  display: none;
  padding: 8px 14px;
  background: none;
  border: 1px solid var(--rule-strong);
  border-radius: 999px;
  cursor: pointer;
}

.toggle .label {
  color: var(--ink);
}

@media (max-width: 760px) {
  .toggle {
    display: inline-flex;
  }

  .nav {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 8px var(--gutter) 24px;
    background: var(--paper);
    border-bottom: 1px solid var(--rule);
    font-size: 0.95rem;
  }

  .open .nav {
    display: flex;
  }

  .nav a {
    padding: 14px 0;
    border-bottom: 1px solid var(--rule);
  }

  .nav .cta {
    margin-top: 18px;
    text-align: center;
    border-bottom: 1px solid var(--oxblood);
  }
}
</style>
