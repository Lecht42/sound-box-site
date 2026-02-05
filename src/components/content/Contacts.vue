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
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary')
</script>

<template>
  <section class="w-full space-y-6">
    <span class="w-full bg-primary py-2 flex flex-row justify-center font-tektur text-lg md:text-xl">
      <h1 class="text-black">Контакты</h1>
    </span>

    <div class="view flex flex-row flex-wrap gap-8">
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-y-3 grow">
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
          <svg class="social-icon vk-icon" :fill="primaryColor" viewBox="0.39 0.39 19.2 19.2" xmlns="http://www.w3.org/2000/svg" aria-label="VK">
            <path d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S15.302.4 10 .4zm3.692 10.831s.849.838 1.058 1.227c.006.008.009.016.011.02.085.143.105.254.063.337-.07.138-.31.206-.392.212h-1.5c-.104 0-.322-.027-.586-.209-.203-.142-.403-.375-.598-.602-.291-.338-.543-.63-.797-.63a.305.305 0 0 0-.095.015c-.192.062-.438.336-.438 1.066 0 .228-.18.359-.307.359h-.687c-.234 0-1.453-.082-2.533-1.221-1.322-1.395-2.512-4.193-2.522-4.219-.075-.181.08-.278.249-.278h1.515c.202 0 .268.123.314.232.054.127.252.632.577 1.2.527.926.85 1.302 1.109 1.302a.3.3 0 0 0 .139-.036c.338-.188.275-1.393.26-1.643 0-.047-.001-.539-.174-.775-.124-.171-.335-.236-.463-.26a.55.55 0 0 1 .199-.169c.232-.116.65-.133 1.065-.133h.231c.45.006.566.035.729.076.33.079.337.292.308 1.021-.009.207-.018.441-.018.717 0 .06-.003.124-.003.192-.01.371-.022.792.24.965a.216.216 0 0 0 .114.033c.091 0 .365 0 1.107-1.273a9.718 9.718 0 0 0 .595-1.274c.015-.026.059-.106.111-.137a.266.266 0 0 1 .124-.029h1.781c.194 0 .327.029.352.104.044.119-.008.482-.821 1.583l-.363.479c-.737.966-.737 1.015.046 1.748z"/>
          </svg>
          <i class="bi bi-whatsapp social-icon" aria-label="WhatsApp"></i>

        </span>

      </dl>

        <GMapMap class="grow w-full md:w-auto rounded-3xl overflow-hidden border border-primary min-w-1/2" :center="officePosition" :zoom="15" style="width: 100%; height: 300px" :options="mapOptions"
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
