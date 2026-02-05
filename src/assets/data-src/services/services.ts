export type ServiceItem = {
  id: string
  title: string
  image: string
  icon: string
  contentKey: string
}

const services: ServiceItem[] = [
  {
    id: 'presentation',
    title: 'Презентация',
    image: 'photo_0',
    icon: 'bi-easel2',
    contentKey: 'presentation',
  },
  {
    id: 'sound',
    title: 'Звуковое оборудование',
    image: 'photo_0',
    icon: 'bi-speaker',
    contentKey: 'sound',
  },
  {
    id: 'light',
    title: 'Свет',
    image: 'photo_0',
    icon: 'bi-lightbulb',
    contentKey: 'light',
  },
  {
    id: 'stage',
    title: 'Сценические решения',
    image: 'photo_0',
    icon: 'bi-mic',
    contentKey: 'stage',
  },
  {
    id: 'effects',
    title: 'Сценические эффекты',
    image: 'photo_0',
    icon: 'bi-stars',
    contentKey: 'effects',
  },
  {
    id: 'video',
    title: 'Видео',
    image: 'photo_0',
    icon: 'bi-camera-video',
    contentKey: 'video',
  },
]

export default services
