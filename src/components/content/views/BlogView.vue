<script setup lang="ts">
import type { NewsItem } from '../../../assets/data-src/blog/blog'
import news from '../../../assets/data-src/blog/blog'
import { useModal } from 'vue-final-modal'
import DetailsModal from './modals/DetailsModal.vue'

type NewsCard = NewsItem & { imageUrl: string }

const newsCards: NewsCard[] = news.map((service) => ({
    ...service,
    imageUrl: new URL(
        `../../../assets/imgs-src/blog/${service.image}.jpg`,
        import.meta.url,
    ).href,
}))

const { open, close, patchOptions } = useModal({
    component: DetailsModal,
    attrs: {
        service: newsCards[0],
        onClose: () => close(),
    },
})

const openService = (service: NewsCard) => {
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
    <div class="grid grid-cols-1 gap-4 md:gap-8 w-full">
        <button v-for="newsCard in newsCards" :key="newsCard.id" type="button"
            class="justify-between gap-4 w-full bg-card flex flex-col items-center rounded-sm shadow-sm hover:shadow-md hover:scale-105 hover:cursor-pointer transition-transform duration-300  text-white text-center overflow-clip p-8"
            @click="openService(newsCard)">
            <div class="flex flex-row justify-between w-full">
                <h2 class="text-left w-fit">{{ newsCard.title }}</h2>
                <h2 class="text-right w-fit">{{ newsCard.date }}</h2>
            </div>
            <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
                <p class="font-prosto-one">{{ newsCard.description }}</p>
                <img :src="newsCard.imageUrl" :alt="newsCard.title" class="size-46 object-cover rounded-md" />
            </div>
        </button>
    </div>
</template>