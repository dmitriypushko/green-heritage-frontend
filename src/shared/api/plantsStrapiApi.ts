import type { Plant } from '../../entities/plant/model/types';

interface ReviewPayload {
  authorName: string;
  rating: number;
  comment: string;
  plantId: number;
  photos: File[];
}

const STRAPI_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

export const submitReview = async (payload: ReviewPayload) => {
  // --- ЭТАП 1: Создаем отзыв (чистый JSON) 
  const reviewData = {
    data: {
      authorName: payload.authorName,
      rating: Number(payload.rating),
      comment: payload.comment,
      published: false,
      plant: {
        connect: [Number(payload.plantId)],
      },
    }
  };

  const reviewResponse = await fetch(`${STRAPI_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });

  if (!reviewResponse.ok) {
    const errorData = await reviewResponse.json().catch(() => ({}));
    console.error('Ошибка создания отзыва:', errorData);
    throw new Error(errorData?.error?.message || 'Failed to save review');
  }

  const createdReview = await reviewResponse.json();
  const reviewId = createdReview.data.id; 

  // --- ЭТАП 2: Загрузка фото 
  if (payload.photos && payload.photos.length > 0 && reviewId) {
    const fileFormData = new FormData();
    
    payload.photos.forEach((file) => {
      fileFormData.append('files', file); 
    });

    fileFormData.append('ref', 'api::review.review'); 
    fileFormData.append('refId', String(reviewId));   
    fileFormData.append('field', 'images'); 

    console.log('Отправляем фотки для отзыва ID:', reviewId);

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      body: fileFormData,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json().catch(() => ({}));
      console.error('Ошибка фото от Strapi:', uploadError);
    } else {
      console.log('Фотки успешно привязались к отзыву!');
    }
  }

  return createdReview;
};

// 🌟 ОБНОВЛЕННАЯ ФУНКЦИЯ: теперь принимает параметр языка
export const fetchPlants = async (currentLang: string = 'ru'): Promise<Plant[]> => {
  const query = [
    `locale=${currentLang}`, // Направляем Strapi на путь истинный (нужный язык)
    'populate[images]=true',
    'populate[features]=true',
    'populate[reviews][populate][images]=true',
    'populate[reviews][filters][published][$eq]=true'
  ].join('&');

  const response = await fetch(`${STRAPI_URL}/api/plants?${query}`);
  
  if (!response.ok) {
    console.error("Strapi error status:", response.status);
    const errText = await response.text().catch(() => "");
    console.error("Strapi error body:", errText);
    
    throw new Error("Failed to fetch plants from server");
  }
  
  const json = await response.json();
  return json.data as Plant[];
};


export const getImageUrl = (url: string): string => {
  if (!url) return "";
  
  // Если адрес уже полный (начинается с http), отдаем как есть
  if (url.startsWith("http")) return url;
  
  // ВРЕМЕННО: для картинок ходим на локальный комп, пока бэк на Рендере без Cloudinary
  return `http://localhost:1337${url}`;
};

// export const getImageUrl = (url: string): string => {
//   if (!url) return "";
//   return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
// };