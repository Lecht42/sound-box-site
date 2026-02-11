<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

const props = withDefaults(
  defineProps<{
    title: string
    contentHtml?: string
    contentClass?: string
  }>(),
  {
    contentHtml: '',
    contentClass:
      'w-full max-w-4xl bg-secondary text-text rounded-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const close = () => emit('close')
</script>

<template>
  <VueFinalModal class="flex items-center h-screen justify-center p-4" :content-class="props.contentClass"
    overlay-class="bg-black/70" @click-outside="close" @escape-key="close">
    <div class="flex items-start justify-between gap-4 px-6 py-4 border-b border-primary/20">
      <div>
        <h3 class="text-2xl font-tektur">
          {{ props.title }}
        </h3>
      </div>
      <button type="button" @click="close">
        Закрыть
      </button>
    </div>

    <div class="p-6 md:p-8 overflow-y-auto">
      <div v-if="props.contentHtml" class="content" v-html="props.contentHtml"></div>
      <slot v-else />
    </div>
  </VueFinalModal>
</template>
