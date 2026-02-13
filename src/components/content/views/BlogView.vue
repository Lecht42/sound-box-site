<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import type { NewsItem } from '../../../assets/data-src/blog/blog'
import news from '../../../assets/data-src/blog/blog'

type NewsCard = NewsItem & { imageUrl: string }

const newsCards: NewsCard[] = news.map((service) => ({
  ...service,
  imageUrl: new URL(
    `../../../assets/imgs-src/blog/${service.image}.jpg`,
    import.meta.url,
  ).href,
}))

const currentPage = ref(1)
const perPage = 3
const totalItems = computed(() => newsCards.length)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage))
const pagedNewsCards = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return newsCards.slice(start, start + perPage)
})

const windowWidth = ref<number>(0)
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

const previewLimit = computed(() => {
  if (windowWidth.value < 640) return 140
  if (windowWidth.value < 1024) return 210
  return 200
})

const formatDescription = (description: string) => {
  const limit = previewLimit.value
  if (description.length <= limit) return description
  const trimmed = description.slice(0, limit).trimEnd()
  return `${trimmed}… Нажмите что бы читать далее`
}
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:gap-8 w-full">
    <h1 class="text-white text-2xl md:text-3xl text-center font-tektur mb-14">Наша история</h1>
    <router-link v-for="newsCard in pagedNewsCards" :key="newsCard.id" :to="`/blog/${newsCard.id}`"
      class="border-2 border-primary hover:border-link group justify-between gap-4 w-full bg-card flex flex-col items-center rounded-sm shadow-sm hover:shadow-md hover:scale-105 hover:cursor-pointer transition-transform duration-300 text-white text-center overflow-clip p-8"
    >
      <span class="flex flex-row justify-between w-full">
        <h3 class="group-hover:text-link text-left w-fit">{{ newsCard.title }}</h3>
        <h3 class="group-hover:text-link text-right w-fit">{{ newsCard.date }}</h3>
      </span>
      <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
        <p class="group-hover:text-link font-prosto-one wrap-anywhere">{{ formatDescription(newsCard.description) }}</p>
        <img :src="newsCard.imageUrl" :alt="newsCard.title" class="w-46 object-cover rounded-md" loading="lazy" />
      </div>
    </router-link>
    <VueAwesomePaginate class="relative inset-x-1/2 -translate-1/2 w-min mt-8" v-if="totalPages > 1" v-model="currentPage"
      :total-items="totalItems" :items-per-page="perPage" :max-pages-shown="5" :hide-prev-next="true" />
  </section>
</template>
