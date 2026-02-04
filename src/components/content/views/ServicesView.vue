<script setup lang="ts">
import services from '../../../assets/data-src/services'
import type { ServiceItem } from '../../../assets/data-src/services'
import { useModal } from 'vue-final-modal'
import DetailsModal from './modals/DetailsModal.vue'

type ServiceCard = ServiceItem & { imageUrl: string }

const serviceCards: ServiceCard[] = services.map((service) => ({
  ...service,
  imageUrl: new URL(
    `../../../assets/imgs-src/services/${service.image}.jpg`,
    import.meta.url,
  ).href,
}))

const { open, close, patchOptions } = useModal({
  component: DetailsModal,
  attrs: {
    service: serviceCards[0],
    onClose: () => close(),
  },
})

const openService = (service: ServiceCard) => {
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
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
    <button
      v-for="service in serviceCards"
      :key="service.id"
      type="button"
      class="size-64 bg-card gap-4 flex flex-col items-center rounded-sm shadow-sm hover:shadow-md hover:scale-110 transition-transform duration-300 hover:cursor-pointer text-white text-center overflow-clip p-4"
      @click="openService(service)"
    >
      <h2>{{ service.title }}</h2>
      <img :src="service.imageUrl" :alt="service.title" class="object-scale-down h-full rounded-md" />
    </button>
  </div>
</template>