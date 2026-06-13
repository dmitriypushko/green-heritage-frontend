import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../entities/cart/model/store';

export const useCartPage = () => {
  const { 
    items, // Теперь TypeScript знает, что внутри [{ documentId, quantity }]
    clearCart, 
    increaseQuantity, 
    decreaseQuantity, 
    removeItem 
  } = useCartStore();
  
  const navigate = useNavigate();
  
  const [isSent, setIsSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);

  const handleOrderSuccess = (num: string) => {
    setOrderNumber(num);
    setIsSent(true);
    clearCart(); // Очищаем корзину после успешной отправки
  };

  const handleGoToCatalog = () => {
    navigate('/');
  };

  const handleStartCheckout = () => {
    setIsCheckout(true);
  };

  const handleCancelCheckout = () => {
    setIsCheckout(false);
  };

  return {
    items,
    isSent,
    orderNumber,
    isCheckout,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    handleOrderSuccess,
    handleGoToCatalog,
    handleStartCheckout,
    handleCancelCheckout
  };
};
