import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useCartStore } from '../../entities/cart/model/store';
import { getImageUrl } from '../../shared/api/plantsStrapiApi';
import type { Plant, Review } from '../../entities/plant/model/types';

export const usePlantDetailPage = (plants: Plant[]) => {
  // 🌟 Забираем documentId из URL вместо id
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  
  const [activeImg, setActiveImg] = useState<string>('');

  // 1. Находим нужное растение по уникальному documentId (он одинаковый на всех языках!)
  const plant = useMemo<Plant | null>(() => {
    if (!documentId || !plants || plants.length === 0) return null;
    return plants.find(p => p.documentId === documentId) || null; 
  }, [documentId, plants]);

  // 2. Проверяем, есть ли оно уже в корзине (теперь тоже проверяем по documentId)
  const isAlreadyInCart = useMemo(() => {
    if (!plant) return false;
    return cartItems.some(item => item.documentId === plant.documentId);
  }, [cartItems, plant]);

  // 3. Сеттим дефолтную главную картинку при смене растения/языка
  useEffect(() => {
    if (plant && plant.images && plant.images.length > 0) {
      setActiveImg(getImageUrl(plant.images[0]?.url));
    }
  }, [plant]);

  // 4. Нормализуем фичи растения
  const plantFeatures = useMemo(() => {
    if (!plant || !plant.features) return null;
    return Array.isArray(plant.features) ? plant.features[0] : plant.features;
  }, [plant]);

  // 5. Нормализуем отзывы строго по типам
  const normalizedReviews = useMemo<Review[]>(() => {
    if (!plant || !plant.reviews) return [];

    const rawReviews = Array.isArray(plant.reviews)
      ? plant.reviews
      : (plant.reviews as any).data;

    if (!Array.isArray(rawReviews)) return [];

    return rawReviews.map((r: any) => {
      if (r.attributes) {
        return { id: r.id, ...r.attributes };
      }
      return r;
    });
  }, [plant]);

  const handleBack = () => navigate(-1);
  const handleGoHome = () => navigate('/');
  const handleAddToCart = () => {
    if (plant) addItem(plant);
  };

  return {
    plant,
    isAlreadyInCart,
    activeImg,
    setActiveImg,
    plantFeatures,
    normalizedReviews,
    handleBack,
    handleGoHome,
    handleAddToCart
  };
};