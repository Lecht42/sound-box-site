<script setup lang="ts">
import { ref } from 'vue'

const officePosition = { lat: 54.7807891, lng: 56.0379087 }
const cssVar = (varName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#101218" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#c7c9cf" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0b0d11" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a1d24" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2a2e37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1a2a" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#1f222b" }, { visibility: "on" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1b1f27" }, { visibility: "on" }],
  },
  {
    featureType: "poi.business",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d3d5dc" }, { visibility: "on" }],
  },
];

const mapOptions = {
  styles: darkMapStyle,
  disableDefaultUI: true,
  zoomControl: true,
  backgroundColor: '#0e0f12',
}

const isInfoOpen = ref(true)
const hasGoogleMaps = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
</script>

<template>
  <section class="w-full space-y-6">
    <span class="w-full bg-primary py-2 flex flex-row justify-center font-tektur text-lg md:text-xl">
      <h1 class="text-black">Контакты</h1>
    </span>

    <div class="view flex flex-2 flex-row flex-wrap gap-8">
      <dl class="grid grid-cols-1 gap-y-3 grow">

        <dt>
          <i class="fa-solid fa-phone mr-2" aria-hidden="true"></i>
          Телефон
        </dt>
        <dd>
          <a href="tel:79273295521">
            +79273295521
          </a>
        </dd>

        <dt>
          <i class="fa-solid fa-envelope mr-2" aria-hidden="true"></i>
          E-mail
        </dt>
        <dd>
          <a href="mailto:bogomolovpetr@yandex.ru">
            bogomolovpetr@yandex.ru
          </a>
        </dd>

        <span class="my-4 flex flex-row justify-around items-center">
          <a
            href="https://t.me/SoundBOXrent"
            aria-label="Telegram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-telegram social-icon" aria-hidden="true"></i>
          </a>
          <a
            href="https://vk.ru/soundbox.rent"
            aria-label="Vkontakte"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-vk social-icon" aria-hidden="true"></i>
          </a>
          <a
            href="https://wa.me/79273295521"
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-brands fa-whatsapp social-icon" aria-hidden="true"></i>
          </a>
        </span>

      </dl>

      <GMapMap class="flex-3 rounded-sm overflow-hidden border border-primary min-w-1/2"
        :center="officePosition" :zoom="15" style="width: 100%; height: 300px" :options="mapOptions"
        v-if="hasGoogleMaps">
        <GMapMarker :position="officePosition" @click="isInfoOpen = !isInfoOpen">
          <GMapInfoWindow :opened="isInfoOpen">
            <label class="text-black font-tektur text-sm sm:text-base lg:text-lg">
              г. Уфа, ул. Уфимское Шоссе 39
            </label>
          </GMapInfoWindow>
        </GMapMarker>
      </GMapMap>
      <p v-else class="p-6 text-center text-text/70">
        Карта Google недоступна: проверьте наличие VITE_GOOGLE_MAPS_API_KEY в .env.
      </p>
    </div>
  </section>
</template>
