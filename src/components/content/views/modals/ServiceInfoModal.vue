<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdownContent } from '../../../../composables/useMarkdownContent'
import type { ServiceItem } from '../../../../assets/data-src/services/services'

const props = defineProps<{
  service?: ServiceItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const title = computed(() => props.service?.title ?? 'Описание услуги')
const contentKey = computed(() => props.service?.contentKey ?? 'presentation')
const { html } = useMarkdownContent('services', contentKey)

const close = () => emit('close')
</script>

<template>
  <BaseModal :title="title" :content-html="html" @close="close" />
</template>
