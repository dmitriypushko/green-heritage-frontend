import plantsData from './plants.json';
import type { Plant } from '../../entities/plant/model/types';

// Имитируем задержку сервера для реалистичности (и чтобы потестить лоадеры в будущем)
export const fetchPlants = async (): Promise<Plant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(plantsData as Plant[]);
    }, 500);
  });
};