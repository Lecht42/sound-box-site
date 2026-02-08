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
    icon: 'bi-speaker',
    contentKey: 'sound',
    active: true,
  },
  {
    id: 'light',
    title: 'Свет',
    image: 'photo_0',
    icon: 'bi-lightbulb',
    contentKey: 'light',
    active: false,
  },
  {
    id: 'stage',
    title: 'Сценические решения',
    image: 'photo_0',
    icon: 'bi-mic',
    contentKey: 'stage',
    active: true,
  },
  {
    id: 'effects',
    title: 'Сценические эффекты',
    image: 'photo_0',
    icon: 'bi-stars',
    contentKey: 'effects',
    active: true,
  },
  {
    id: 'video',
    title: 'Видео',
    image: 'photo_0',
    icon: 'bi-camera-video',
    contentKey: 'video',
    active: false,
  },
]

export default services
