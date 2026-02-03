<script setup lang="ts">
import { URL } from 'url';
import services from '../../../assets/data-src/services';
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <div v-for="service in services" class="w-64 h-64 bg-card flex flex-col items-center rounded-sm shadow-sm hover:shadow-md hover:scale-110 transition-transform duration-300 hover:cursor-pointer text-white text-center overflow-clip p-4">
            <h2>{{ service.title }}</h2>
            <img :src="`src/assets/imgs-src/services/${service.image}.jpg`" :alt="service.title"
                class="object-scale-down h-full w-full rounded-md" />
        </div>
    </div>
</template>
