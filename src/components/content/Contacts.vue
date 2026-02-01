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
    <p v-else class="text-center">
      Карта недоступна: добавьте VITE_YANDEX_MAP_API_KEY в файл .env, чтобы отобразить расположение офиса.
    </p>
  </section>
</template>
