import { useMemo } from 'react';
import { useCartStore } from '../../cart/model/store';
import type { Plant } from '../model/types';

export const usePlantCard = (plant: Plant) => {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const cartItems = useCartStore((state) => state.items);

  // 1. Безопасно вытаскиваем documentId
  const docId = plant.documentId || '';

  // 2. Ищем элемент в корзине строго по уникальному documentId
  const cartItem = useMemo(() => {
    if (!docId) return undefined;
    return cartItems.find(item => item.documentId === docId);
  }, [cartItems, docId]);

  const isAlreadyInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 0;

  // 3. Хендлер для добавления (или увеличения количества)
  const handleAdd = () => {
    if (docId) addItem(docId);
  };

  // 4. Хендлер для уменьшения количества или полного удаления
  const handleRemove = () => {
    if (!docId) return;
    
    // Если товар в корзине в количестве 1 шт, то при клике на минус — полностью удаляем
    if (quantity === 1) {
      removeItem(docId);
    } else {
      // Если больше 1 шт — просто уменьшаем счётчик
      decreaseQuantity(docId);
    }
  };

  return {
    isAlreadyInCart,
    quantity,
    handleAdd,
    handleRemove
  };
};