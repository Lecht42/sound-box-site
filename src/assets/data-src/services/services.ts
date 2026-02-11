export type ServiceItem = {
  id: string
  title: string
  image: string
  icon: string
  contentKey: string
  active?: boolean
}

const services: ServiceItem[] = [
  {
    id: 'sound',
    title: 'Звуковое оборудование',
    image: 'photo_0',
    icon: 'fa-solid fa-volume-high',
    contentKey: 'sound',
    active: true,
  },
  {
    id: 'light',
    title: 'Свет',
    image: 'photo_0',
    icon: 'fa-regular fa-lightbulb',
    contentKey: 'light',
    active: false,
  },
  {
    id: 'stage',
    title: 'Сценические решения',
    image: 'photo_0',
    icon: 'fa-solid fa-microphone',
    contentKey: 'stage',
    active: true,
  },
  {
    id: 'effects',
    title: 'Сценические эффекты',
    image: 'photo_0',
    icon: 'fa-solid fa-wand-magic-sparkles',
    contentKey: 'effects',
    active: true,
  },
  {
    id: 'video',
    title: 'Видео',
    image: 'photo_0',
    icon: 'fa-solid fa-video',
    contentKey: 'video',
    active: false,
  },
]

export default services
