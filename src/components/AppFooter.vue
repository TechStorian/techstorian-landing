<script setup lang="ts">
import BrandMark from './BrandMark.vue'
import { contact, links } from '../content'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap row">
      <div class="brand">
        <BrandMark />
        <span>© {{ year }} techstorian · {{ contact.location }}</span>
      </div>
      <nav aria-label="Footer">
        <a :href="links.refcheck">RefCheck</a>
        <a :href="links.substack">Substack</a>
        <a :href="links.github">GitHub</a>
        <a :href="links.linkedin">LinkedIn</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 32px 0;
  border-top: 1px solid var(--rule);
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--ink-faint);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand :deep(.mark) {
  width: 28px;
  height: 28px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
}

nav a {
  text-decoration: none;
}

nav a:hover {
  color: var(--oxblood);
}
</style>
