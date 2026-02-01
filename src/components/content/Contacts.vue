<script setup lang="ts">
import { YandexMap, YandexMapMarker } from 'vue-yandex-maps'

const officeCoordinates: [number, number] = [55.751244, 37.618423]
const hasMapKey = Boolean(import.meta.env.VITE_YANDEX_MAP_API_KEY)
</script>

<template>
  <section class="w-full space-y-6">
    <span class="w-full bg-primary py-2 flex flex-row justify-center font-tektur text-lg md:text-xl">
      <h1>Контакты</h1>
    </span>

    <div class="view flex flex-row flex-wrap gap-8">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-y-3">
        <dt>Звонок бесплатный:</dt>
        <dd>
          <a href="tel:88005516096">
            8 (800) 551-60-96
          </a>
        </dd>

        <dt>Телефон офиса:</dt>
        <dd>
          <a href="tel:+73472588972">
            +7 (347) 258-89-72
          </a>
        </dd>

        <dt>Электронная почта:</dt>
        <dd>
          <a href="mailto:zakaz@soundekb.ru">
            zakaz@soundekb.ru
          </a>
        </dd>


        <span class="col-span-2 my-4 flex flex-row justify-around">
          <img src="../../assets/svgs-src/telegram.svg"/>
          <img src="../../assets/svgs-src/vkontakte.svg"/>
          <img src="../../assets/svgs-src/whatsapp.svg"/>
        </span>

      </dl>

      <div v-if="hasMapKey">
        <YandexMap class="w-full" :coordinates="officeCoordinates" :zoom="15">
          <YandexMapMarker :coordinates="officeCoordinates">
            <div class="bg-secondary px-4 py-2 rounded-xl shadow-md">
              SoundBOX, примерный офис<br />
              Москва, Красная площадь, 1
            </div>
          </YandexMapMarker>
        </YandexMap>
      </div>
    </div>
  </section>
</template>


<style scoped>
img {
  max-width: 4rem;
  max-height: 4rem;
  margin-inline: 0.5rem;
  filter: ;
}
</style>