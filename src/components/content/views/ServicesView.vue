<script setup lang="ts">
import services from '../../../assets/data-src/services'
import type { ServiceItem } from '../../../assets/data-src/services'
const serviceCards: ServiceItem[] = services.filter(service => service.active);
</script>

<template>
  <section class="w-full space-y-6">
    <h1 class="text-white text-2xl md:text-3xl text-center font-tektur mb-14">Предоставим</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
    <router-link
      v-for="service in serviceCards"
      :key="service.id"
      :to="`/services/${service.id}`"
      class="flex flex-col items-center justify-center border-2 border-primary hover:border-link group size-64 bg-card gap-4 rounded-sm shadow-sm hover:shadow-md hover:scale-110 transition-transform duration-300 hover:cursor-pointer text-white text-center overflow-clip p-4"
    >
      <i class="group-hover:text-link" :class="`text-primary text-5xl ${service.icon}`" aria-hidden="true"></i>
      <h2 class="group-hover:text-link">{{ service.title }}</h2>
    </router-link>
    </div>
  </section>
</template>
