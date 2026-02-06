<script setup lang="ts">
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import type { AutoplayOptions, NavigationOptions, PaginationOptions } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

const navigationOptions: NavigationOptions = { enabled: false }
const paginationOptions: PaginationOptions = { clickable: true, dynamicBullets: true }
const autoplayOptions: AutoplayOptions = {
  delay: 5000,
  disableOnInteraction: false,
}

const carouselImages = computed(() =>
  Array.from({ length: 10 }, (_, index) => ({
    src: new URL(
      `../../../assets/imgs-src/carousel/photo_${index}.jpg`,
      import.meta.url,
    ).href,
    alt: `SoundBOX project photo #${index + 1}`,
  })),
)
</script>

<template>
    <div class="font-prosto-one w-full">
        <section>
            <h2>Мы готовы предоставить вам технику</h2>
            <p>
                SoundBOX — компания по техническому обеспечению мероприятий звуком и
                светом с 20ти летним стажем. Мы обеспечиваем стабильную работу техники
                на мероприятиях любого масштаба — от частных событий до крупных
                концертов и акций.
            </p>
            <Swiper
                class="w-full max-h-64vh"
                :modules="[Navigation, Pagination, Autoplay]"
                :slides-per-view="1"
                :loop="true"
                :breakpoints="{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 8,
                        navigation: {
                            enabled: true
                        }
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                        navigation: {
                            enabled: true
                        }
                    }
                }"
                :autoplay="autoplayOptions as any"
                :navigation="navigationOptions as any"
                :pagination="paginationOptions as any"
            >
                <SwiperSlide v-for="photo in carouselImages" :key="photo.src">
                    <img class=" block w-full h-full overflow-hidden rounded-lg" :src="photo.src" :alt="photo.alt" loading="lazy" />
                </SwiperSlide>
            </Swiper>
        </section>
        <section>
            <h2>Наши принципы</h2>
            <p>
                Наш приоритет — результат. Если оборудование установлено, оно работает без сбоев и оправданий. Мы
                отвечаем за технику от момента загрузки до последнего выключенного прибора.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p>Порядок:</p>
                    <ul class="pl-4">
                        <li>Осмотр площадки;</li>
                        <li>Формирование ТЗ и бюджета;</li>
                        <li>Подбор оборудования;</li>
                        <li>Доставка, монтаж и настройка;</li>
                        <li>Стабильная работа на мероприятии;</li>
                    </ul>
                </div>
                <div>
                    <p>Особенности:</p>
                    <ul class="pl-4">
                        <li>Опытные специалисты;</li>
                        <li>Проверенное оборудование;</li>
                        <li>Соблюдение сроков;</li>
                        <li>Работа с любым бюджетом;</li>
                        <li>Индивидуальные решения;</li>
                        <li>Ответственность за результат;</li>
                    </ul>
                </div>
            </div>
        </section>
        <section class="hidden">
            <h2>Опыт</h2>
            <p>
                Мы более 20ти лет работаем на рынке профессионального звукового и светового оборудования. За это время
                обеспечивали техническое сопровождение мероприятий разного уровня — от частных событий до масштабных
                концертных проектов.
            </p>
        </section>
    </div>
</template>
