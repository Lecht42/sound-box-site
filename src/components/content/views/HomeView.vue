<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { buildFaqJson } from '../../../utils/faqSchema'
import faqItems from '../../../assets/data-src/faq'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import type { AutoplayOptions, PaginationOptions } from 'swiper/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

const paginationOptions: PaginationOptions = { clickable: true }
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

const experienceIsHidden = Boolean(import.meta.env.EXPERIENCE_SECTION_IS_HIDDEN)

const faqJson = computed(() => buildFaqJson(faqItems))

const faqScriptId = 'faq-schema'
const upsertFaqSchema = () => {
  let script = document.head.querySelector(`#${faqScriptId}`) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = faqScriptId
    document.head.appendChild(script)
  }
  script.textContent = faqJson.value
}

onMounted(() => {
  upsertFaqSchema()
})

watch(faqJson, () => {
  upsertFaqSchema()
})

onBeforeUnmount(() => {
  const script = document.head.querySelector(`#${faqScriptId}`)
  if (script) script.remove()
})
</script>

<template>
  <div class="font-prosto-one w-full">
    <h1>
      SoundBOX — аппаратура для мероприятий
    </h1>

    <section>
      <h2>Мы готовы предоставить вам технику</h2>
      <p>
        SoundBOX — это аппаратура для мероприятий, где важны надежность, звук и свет.
        Мы берем на себя техническое обеспечение мероприятий любого масштаба: от частных
        праздников и корпоративных событий до концертов, фестивалей и городских площадок.
        В нашей работе важны безопасность, стабильность и понятная коммуникация с заказчиком.
      </p>
      <p>
        Мы подбираем оборудование под задачу, площадку и бюджет, предоставляем специалистов
        и сопровождаем проект на всех этапах — от подготовки до последнего включенного прибора.
        Такой подход помогает избежать сбоев и обеспечивает качественный результат, а ключевые
        слова из заголовка и title действительно отражают содержание страницы.
      </p>
      <Swiper
        class="w-full max-h-64vh"
        :modules="[Navigation, Pagination, Autoplay]"
        :slides-per-view="1"
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
        :pagination="paginationOptions as any"
      >
        <SwiperSlide v-for="photo in carouselImages" :key="photo.src">
          <img class="block w-full h-full overflow-hidden rounded-lg" :src="photo.src" :alt="photo.alt" loading="lazy" />
        </SwiperSlide>
      </Swiper>
    </section>

    <section>
      <h2>Наши принципы</h2>
      <p>
        Наш приоритет — результат. Мы отвечаем за технику от момента загрузки до завершения
        мероприятия и гарантируем стабильную работу оборудования в реальных условиях.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>Порядок:</p>
          <ul class="pl-4">
            <li>Осмотр площадки;</li>
            <li>Формирование ТЗ и бюджета;</li>
            <li>Подбор оборудования;</li>
            <li>Доставка, монтаж и настройка;</li>
            <li>Стабильная работа на мероприятии.</li>
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
            <li>Ответственность за результат.</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="!experienceIsHidden">
      <h2>Опыт</h2>
      <p>
        Мы более 20 лет работаем на рынке профессионального звукового и светового оборудования
        и обеспечиваем техническое сопровождение мероприятий разного уровня.
      </p>
    </section>

    <section>
      <h2>FAQ</h2>
        <div v-for="item in faqItems" :key="item.question">
          <h3 class="text-left text-base md:text-lg">{{ item.question }}</h3>
          <p class="ml-6">{{ `- ${item.answer}` }}</p>
        </div>
    </section>
  </div>
</template>
