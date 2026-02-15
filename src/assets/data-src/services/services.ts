export type ServiceItem = {
  id: string
  title: string
  icon: string
  contentKey: string
  active?: boolean
}

const services: ServiceItem[] = [
  {
    id: 'sound',
    title: 'Звуковое оборудование',
    icon: 'fa-solid fa-volume-high',
    contentKey: 'sound',
    active: true,
  },
  {
    id: 'light',
    title: 'Свет',
    icon: 'fa-regular fa-lightbulb',
    contentKey: 'light',
    active: false,
  },
  {
    id: 'stage',
    title: 'Сценические решения',
    icon: 'fa-solid fa-microphone',
    contentKey: 'stage',
    active: true,
  },
  {
    id: 'effects',
    title: 'Сценические эффекты',
    icon: 'fa-solid fa-wand-magic-sparkles',
    contentKey: 'effects',
    active: true,
  },
  {
    id: 'video',
    title: 'Видео',
    icon: 'fa-solid fa-video',
    contentKey: 'video',
    active: false,
  },
]

export default services
