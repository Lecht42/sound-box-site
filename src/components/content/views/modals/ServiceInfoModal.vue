<script setup lang="ts">
import { computed } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { useMarkdownContent } from '../../../../composables/useMarkdownContent'
import type { ServiceItem } from '../../../../assets/data-src/services/services'

const props = defineProps<{
  service?: ServiceItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const contentKey = computed(() => props.service?.contentKey ?? 'presentation')
const { html } = useMarkdownContent('services', contentKey)

const close = () => emit('close')
</script>

<template>
  <VueFinalModal
    class="flex items-center h-screen justify-center p-4"
    content-class="w-full max-w-4xl bg-secondary text-text rounded-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col"
    overlay-class="bg-black/70"
    @click-outside="close"
    @escape-key="close"
  >
    <div class="flex items-start justify-between gap-4 px-6 py-4 border-b border-primary/20">
      <div>
        <h3 class="text-2xl font-tektur">
          {{ service?.title ?? 'Описание услуги' }}
        </h3>
      </div>
      <button
        class="rounded-full border border-primary/30 px-3 py-1 text-sm hover:bg-primary/10"
        type="button"
        @click="close"
      >
        Закрыть
      </button>
    </div>

    <div class="p-6 md:p-8 overflow-y-auto">
      <div class="content" v-html="html"></div>
    </div>
  </VueFinalModal>
</template>

