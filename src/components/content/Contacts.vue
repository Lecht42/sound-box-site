<script setup lang="ts">
import { ref } from 'vue'

const officePosition = { lat: 54.718861, lng: 55.9353378 }
const cssVar = (varName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: cssVar("--background") }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#b5b7bd" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0b0d11" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: cssVar("--card") }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f222a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1a2a" }],
  },
];

const mapOptions = {
  styles: darkMapStyle,
  disableDefaultUI: true,
  backgroundColor: '#0e0f12',
}

const isInfoOpen = ref(true)
const hasGoogleMaps = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
</script>

<template>
  <section class="w-full space-y-6">
    <span class="w-full bg-primary py-2 flex flex-row justify-center font-tektur text-lg md:text-xl">
      <h1>Контакты</h1>
    </span>

    <div class="view flex flex-row flex-wrap gap-8">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-y-3 py-3">
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


        <span class="col-span-2 my-4 flex flex-row justify-around items-center">
          <i class="bi bi-telegram social-icon" aria-label="Telegram"></i>
          <i class="bi bi-whatsapp social-icon" aria-label="WhatsApp"></i>
        </span>

      </dl>

        <GMapMap class="grow w-full md:w-auto rounded-3xl overflow-hidden border border-primary" :center="officePosition" :zoom="15" style="width: 100%; height: 300px" :options="mapOptions"
          v-if="hasGoogleMaps">
          <GMapMarker :position="officePosition" @click="isInfoOpen = !isInfoOpen">
            <GMapInfoWindow :opened="isInfoOpen">
              <label class="text-black font-tektur text-sm sm:text-base lg:text-lg">
                🏢 г.Уфа ул. Карла Маркса 37к1, офис 446
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


<style scoped>
.social-icon {
  width: 4rem;
  height: 4rem;
  font-size: 4rem;
  margin-inline: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}
</style>
