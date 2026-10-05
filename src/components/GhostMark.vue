<script setup lang="ts">
// The exorCITE ghost: a sheet of paper with its corner folded, haunting the page.
// Drawn from the same paths as the mark in the exorCITE app.
</script>

<template>
  <svg class="ghost-mark" viewBox="0 0 100 124" aria-hidden="true">
    <path class="body" d="M14 14 Q14 4 24 4 H66 L86 24 V102 Q74 122 62 102 Q50 122 38 102 Q26 122 14 102 Z" />
    <path class="fold" d="M66 4 V18 Q66 24 72 24 H86 Z" />
    <ellipse class="face" cx="39" cy="50" rx="6.5" ry="9.5" />
    <ellipse class="face" cx="61" cy="50" rx="6.5" ry="9.5" />
    <rect class="line" x="28" y="71" width="44" height="5" rx="2.5" />
    <rect class="line" x="28" y="82" width="28" height="5" rx="2.5" />
  </svg>
</template>

<style scoped>
.ghost-mark {
  display: block;
  flex: none;
  transform: rotate(-5deg);
}

.body {
  fill: var(--oxblood);
}

.fold {
  fill: #b07a6e;
}

.face,
.line {
  fill: var(--card);
}

.line {
  opacity: 0.5;
}
</style>
