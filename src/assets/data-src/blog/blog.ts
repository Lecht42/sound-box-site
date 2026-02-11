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
    id: 'news1',
    title: 'Новость 1',
    image: 'photo_0',
    contentKey: 'presentation',
    description: 'This is the first news item. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    date: '01.01.2024',
  },
  {
    id: 'news',
    title: 'Новость 2',
    image: 'photo_0',
    contentKey: 'sound',
    description: 'This is the second news item.',   
    date: '01.01.2024',
  },
  {
    id: 'news3',
    title: 'Новость 3',
    image: 'photo_0',
    contentKey: 'light',
    description: 'This is the third news item.',
    date: '01.01.2024',
  },
  {
    id: 'news4',
    title: 'Новость 4',
    image: 'photo_0',
    contentKey: 'stage',
    description: 'This is the fourth news item.',
    date: '01.01.2026',
  },
  {
    id: 'news5',
    title: 'Новость 5',
    image: 'photo_0',
    contentKey: 'video',
    description: 'This is the fifth news item.',
    date: '21.06.2026',
  },
]

export default news;
