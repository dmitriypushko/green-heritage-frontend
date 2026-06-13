export type PlantCategory = 'coniferous' | 'deciduous';

// --- ШАГ 1: Создаем строгий интерфейс для Отзыва ---
export interface Review {
  id: number;
  documentId?: string; // Для мутаций в Strapi v5
  authorName: string;   // Имя пользователя
  rating: number;       // Количество звезд (1-5)
  comment: string;      // Текст отзыва
  isApproved: boolean;  // Статус модерации бэкенда
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  
  // Если к отзыву можно прикрепить фотографии (ты говорил про живые фото)
  images?: StrapiImage[]; 
  
  // Связь обратно с растением, если понадобится в админке
  plant?: Plant; 
}

export interface StrapiImage {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  
  // Вместо any для форматов — описываем структуру, если захочешь оптимизировать картинки
  formats: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  } | null; 
  
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // Наше самое главное поле!
  previewUrl: string | null;
  provider: string;
  provider_metadata: any; // Тут провайдеры (Cloudinary/S3) пишут свои id, можно оставить any
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Plant {
  id: number;
  documentId?: string; // Полезное поле для Strapi v5
  name: string;
  latinName: string;
  category: PlantCategory;
  subCategory: string;
  price: number;
  stock: number;
  images: StrapiImage[];
  features: {
    hardinessZone: number;
    soilType: string;
    growthRate: 'slow' | 'fast' | 'medium';
    isRedBook: boolean;
  };
  description: string;
  
  // --- ШАГ 2: Привязываем отзывы к растению ---
  // Теперь массив строго типизирован! Никаких any.
  reviews?: Review[]; 
}
