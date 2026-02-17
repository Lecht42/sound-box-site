<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const mapEl = ref<HTMLDivElement | null>(null)
let mapInstance: any = null

const officePosition: [number, number] = [54.787956, 56.055649]

const load2gis = () =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-2gis-loader="true"]',
    )
    if (existing) {
      const dg = (window as any).DG
      if (dg) {
        resolve()
      } else {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('2GIS load error')), {
          once: true,
        })
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full&skin=dark'
    script.async = true
    script.defer = true
    script.dataset['2gisLoader'] = 'true'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('2GIS load error')), {
      once: true,
    })
    document.head.appendChild(script)
  })

const initMap = async () => {
  if (!mapEl.value) return
  await load2gis()
  const DG = (window as any).DG
  if (!DG?.then) return
  DG.then(() => {
    const api = (window as any).DG
    if (!api?.map) return
    mapInstance = api.map(mapEl.value, {
      center: officePosition,
      zoom: 15,
    })
    const marker = api.marker(officePosition).addTo(mapInstance)
    marker.bindPopup('г. Уфа, Уфимское шоссе, 39').openPopup()
  })
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (mapInstance && typeof mapInstance.remove === 'function') {
    mapInstance.remove()
  }
  mapInstance = null
})
</script>

<template>
  <section class="w-full ">
    <span class="w-full bg-primary py-2 flex flex-row justify-center font-tektur text-lg md:text-xl">
      <h2 class="text-black">Связаться с нами</h2>
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

      <div
        ref="mapEl"
        class="flex-3 rounded-sm overflow-hidden border border-primary min-w-1/2 h-75">
      ></div>
    </div>
  </section>
</template>
