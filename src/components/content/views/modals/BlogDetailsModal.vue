<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdownContent } from '../../../../composables/useMarkdownContent'
import type { NewsItem } from '../../../../assets/data-src/blog/blog'
import BaseModal from '../../../elements/BaseModal.vue'

const props = defineProps<{
  service?: NewsItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const title = computed(() => props.service?.title ?? 'Описание материала')
const contentKey = computed(() => props.service?.contentKey ?? 'presentation')
const { html } = useMarkdownContent('blog', contentKey)

const close = () => emit('close')
</script>

<template>
  <BaseModal :title="title" :content-html="html" @close="close" />
</template>
