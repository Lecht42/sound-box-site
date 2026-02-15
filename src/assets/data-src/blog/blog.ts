export type NewsItem = {
  id: string
  title: string
  image: string
  contentKey: string
  description: string
  date: string
}

const news: NewsItem[] = [
  {
    id: 'kirkorov',
    title: 'Концерт  Филиппа Киркорова в СКК "Оренбуржье"',
    image: 'kirkorov_0.png',
    contentKey: 'kirkorov',
    description: 'Наша компания озвучивала концерт Филиппа Киркорова в СКК "Оренбуржье", город Оренбург.',
    date: '13.02.2026 ',
  },
]

export default news;
