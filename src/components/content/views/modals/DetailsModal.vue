<script setup lang="ts">
import { computed } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { useMarkdownContent } from '../../../../composables/useMarkdownContent'
import type { NewsItem } from '../../../../assets/data-src/blog/blog'

const props = defineProps<{
  service?: NewsItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const contentKey = computed(
  () => props.service?.contentKey ?? 'presentation',
)
const { html } = useMarkdownContent('blog', contentKey)

const close = () => emit('close')
</script>

<template>
  <VueFinalModal
    class="flex items-center h-screen justify-center p-4"
    content-class="w-full max-w-4xl bg-secondary rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col"
    overlay-class="bg-black/70"
    @click-outside="close"
    @escape-key="close"
  >
    <div class="flex items-start justify-between gap-4 px-6 py-4">
      <div>
        <h3 class="text-2xl font-tektur">
          {{ service?.title ?? 'Описание услуги' }}
        </h3>
      </div>
      <button
        type="button"
        v-on:click="close"
      >
        Закрыть
      </button>
    </div>

    <div class="p-6 md:p-8 overflow-y-auto">
      <div class="content" v-html="html"></div>
    </div>
  </VueFinalModal>
</template>



