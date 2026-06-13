import { useMemo } from 'react';
import type { Plant } from '../../../entities/plant/model/types';

export const useCategoryMenu = (plants: Plant[]) => {
  const menuData = useMemo(() => {
    const categories: Record<string, Set<string>> = {};

    plants.forEach(plant => {
      if (!plant.category) return; // Страховка от пустых данных
      
      if (!categories[plant.category]) {
        categories[plant.category] = new Set();
      }
      
      if (plant.subCategory) {
        categories[plant.category].add(plant.subCategory);
      }
    });

    return categories;
  }, [plants]);

  return {
    menuData,
  };
};