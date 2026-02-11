<script setup lang="ts">
import services from '../../../assets/data-src/services'
import type { ServiceItem } from '../../../assets/data-src/services'
import { useModal } from 'vue-final-modal'
import ServiceInfoModal from './modals/ServiceInfoModal.vue'

const serviceCards: ServiceItem[] = services.filter(service => service.active);

const { open, close, patchOptions } = useModal({
  component: ServiceInfoModal,
  attrs: {
    service: serviceCards[0],
    onClose: () => close(),
  },
})

const openService = (service: ServiceItem) => {
  patchOptions({
    attrs: {
      service,
      onClose: () => close(),
    },
  })
  open()
}
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
    <button
      v-for="service in serviceCards"
      :key="service.id"
      type="button"
      class="group size-64 bg-card gap-4 rounded-sm shadow-sm hover:shadow-md hover:scale-110 transition-transform duration-300 hover:cursor-pointer text-white text-center overflow-clip p-4"
      @click="openService(service)"
    >
      <i class="group-hover:text-link" :class="`service-icon ${service.icon}`" aria-hidden="true"></i>
      <h2 class="group-hover:text-link">{{ service.title }}</h2>
    </button>
  </section>
</template>
