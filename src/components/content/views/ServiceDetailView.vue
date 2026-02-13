<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import services from '../../../assets/data-src/services'
import { useMarkdownContent } from '../../../composables/useMarkdownContent'

const route = useRoute()
const serviceId = computed(() => String(route.params.id || ''))
const service = computed(() => services.find((item) => item.id === serviceId.value))

const contentKey = computed(() => service.value?.contentKey ?? 'presentation')
const { html } = useMarkdownContent('services', contentKey)
</script>

<template>
  <section class="w-full space-y-6">
    <nav class="text-sm text-white/70">
      <RouterLink class="hover:text-link" to="/services">Услуги</RouterLink>
      <span class="mx-2">/</span>
      <span>{{ service?.title || 'Услуга' }}</span>
    </nav>

    <h1 class="text-white text-2xl md:text-3xl text-left font-tektur">
      {{ service?.title || 'Услуга' }}
    </h1>

    <div v-if="service" class="content" v-html="html"></div>
    <p v-else class="text-white/70">Услуга не найдена.</p>
  </section>
</template>
