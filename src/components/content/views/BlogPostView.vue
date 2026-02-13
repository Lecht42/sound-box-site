<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import news from '../../../assets/data-src/blog/blog'
import { useMarkdownContent } from '../../../composables/useMarkdownContent'

const route = useRoute()
const postId = computed(() => String(route.params.id || ''))
const post = computed(() => news.find((item) => item.id === postId.value))

const contentKey = computed(() => post.value?.contentKey ?? 'presentation')
const { html } = useMarkdownContent('blog', contentKey)
</script>

<template>
  <section class="w-full space-y-6">
    <nav class="text-sm text-white/70">
      <RouterLink class="hover:text-link" to="/blog">Блог</RouterLink>
      <span class="mx-2">/</span>
      <span>{{ post?.title || 'Статья' }}</span>
    </nav>

    <h1 class="text-white text-2xl md:text-3xl text-left font-tektur">
      {{ post?.title || 'Статья' }}
    </h1>

    <p v-if="post" class="text-white/70">{{ post.date }}</p>
    <div v-if="post" class="content" v-html="html"></div>
    <p v-else class="text-white/70">Статья не найдена.</p>
  </section>
</template>
