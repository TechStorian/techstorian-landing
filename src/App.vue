<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import SoftwareSection from './components/SoftwareSection.vue'
import ApproachSection from './components/ApproachSection.vue'
import WritingSection from './components/WritingSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main">
    <HeroSection />
    <SoftwareSection />
    <ApproachSection />
    <WritingSection />
    <AboutSection />
    <ContactSection />
  </main>
  <AppFooter />
</template>

<style scoped>
.skip {
  position: absolute;
  left: 16px;
  top: -60px;
  z-index: 100;
  padding: 10px 16px;
  background: var(--oxblood);
  color: var(--paper);
  font-family: var(--mono);
  font-size: 0.8rem;
}

.skip:focus {
  top: 12px;
}
</style>
