import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "./entities/cart/model/store.ts";
import { fetchPlants } from "./shared/api/plantsStrapiApi.ts";
import type { Plant } from "./entities/plant/model/types.ts";
import { useTranslation } from 'react-i18next';

export type SortType = 'default' | 'price-low' | 'price-high' | 'name';

export const useAppLogic = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language || 'ua';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const [plantsData, setPlantsData] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Глобальный стор корзины
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Считаем общее количество товаров в хедере
  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        setIsLoading(true);
  
        // Маппим фронтендерский 'ua' в бэкендерский 'uk' для Strapi
        const strapiLocale = currentLanguage === 'ua' ? 'uk' : currentLanguage;
  
        // Отправляем в Strapi правильный код локали!
        const data = await fetchPlants(strapiLocale); 
        setPlantsData(data || []);
      } catch (err: any) {
        console.error("Ошибка запроса к Strapi:", err);
        setError(err.message || "Что-то пошло не так");
      } finally {
        setIsLoading(false);
      }
    };
  
    loadPlants();
  }, [currentLanguage]);

  // Фильтрация и сортировка массива саженцев
  const filteredPlants = useMemo(() => {
    if (!plantsData || plantsData.length === 0) return [];
  
    let result = !activeSubCategory 
      ? [...plantsData] 
      : plantsData.filter(plant => plant.subCategory === activeSubCategory);
  
    if (searchTerm.trim() !== '') {
      result = result.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        plant.latinName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high':
        return result.sort((a, b) => b.price - a.price);
      case 'name':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [activeSubCategory, plantsData, sortBy, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeSubCategory,
    setActiveSubCategory,
    plantsData,
    filteredPlants,
    isLoading,
    error,
    totalCount,
    clearCart,
    t,
    currentLanguage,
    changeLanguage
  };
};