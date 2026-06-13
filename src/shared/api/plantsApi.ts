import plantsData from './plants.json';
import type { Plant } from '../../entities/plant/model/types';

// Имитируем задержку сервера для реалистичности
export const fetchPlants = async (): Promise<Plant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Используем двойное приведение типов: сначала к unknown, потом к Plant[]
      resolve(plantsData as unknown as Plant[]);
    }, 500);
  });
};