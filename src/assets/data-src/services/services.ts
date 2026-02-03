export type ServiceItem = {
  id: string
  title: string
  image: string
  contentKey: string
}

const services: ServiceItem[] = [
  {
    id: 'presentation',
    title: 'Презентация',
    image: 'photo_0',
    contentKey: 'presentation',
  },
  {
    id: 'sound',
    title: 'Звук',
    image: 'photo_0',
    contentKey: 'sound',
  },
  {
    id: 'light',
    title: 'Свет',
    image: 'photo_0',
    contentKey: 'light',
  },
  {
    id: 'stage',
    title: 'Сцена',
    image: 'photo_0',
    contentKey: 'stage',
  },
  {
    id: 'video',
    title: 'Видео',
    image: 'photo_0',
    contentKey: 'video',
  },
]

export default services
