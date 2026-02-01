declare module 'swiper/css';
declare module '*.css';

interface ImportMetaEnv {
  readonly VITE_YANDEX_MAP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
