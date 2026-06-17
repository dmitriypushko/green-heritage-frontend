import { useState, useEffect } from 'react';
import { useCartStore } from '../../../entities/cart/model/store';

interface NovaPoshtaCity {
  Ref: string;
  Description: string;
}

interface NovaPoshtaWarehouse {
  Ref: string;
  Description: string;
}

interface OrderFormProps {
  onOrderSuccess: (orderNumber: string) => void;
  totalPrice: number;
  itemsReport: string;
}

type PaymentMethod = 'cod' | 'card';

const PHONE_REGEX = /^(?:\+?38)?(?:0\d{9})$/;

export const useOrderForm = ({ onOrderSuccess, totalPrice}: OrderFormProps) => {
  const { items } = useCartStore(); 
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

  // Основные поля формы
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  
  // Состояние для Новой Почты
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NovaPoshtaCity[]>([]);
  const [selectedCityRef, setSelectedCityRef] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  // Валидация на лету
  const cleanPhone = phone.replace(/[-\s()]/g, '');
  const isNameValid = name.trim().length >= 2; 
  const isPhoneValid = PHONE_REGEX.test(cleanPhone);
  const isDeliveryValid = selectedCityName.length > 0 && selectedWarehouse.length > 0;
  const isFormValid = isNameValid && isPhoneValid && isDeliveryValid && agreeWithTerms;

  // --- ЭФФЕКТ 1: Живой поиск городов ---
  useEffect(() => {
    if (cityQuery.trim().length < 2) {
      setCities([]);
      setShowCityDropdown(false);
      return;
    }
    if (cityQuery === selectedCityName) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
          method: 'POST',
          body: JSON.stringify({
            modelName: "Address",
            calledMethod: "getCities",
            methodProperties: { FindByString: cityQuery }
          })
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          setCities(resData.data);
          setShowCityDropdown(true);
        }
      } catch (error) {
        console.error('Ошибка загрузки городов:', error);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [cityQuery, selectedCityName]);

  // --- ЭФФЕКТ 2: Загрузка отделений ---
  useEffect(() => {
    if (!selectedCityRef) {
      setWarehouses([]);
      setSelectedWarehouse('');
      return;
    }

    const fetchWarehouses = async () => {
      try {
        const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
          method: 'POST',
          body: JSON.stringify({
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: { CityRef: selectedCityRef }
          })
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          setWarehouses(resData.data);
          if (resData.data.length > 0) {
            setSelectedWarehouse(resData.data[0].Description);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки отделений:', error);
      }
    };

    fetchWarehouses();
  }, [selectedCityRef]);

  // --- ОТПРАВКА ФОРМЫ ---
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    try {
      const strapiResponse = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: name.trim(),
            phone: cleanPhone,
            city: selectedCityName,
            warehouse: selectedWarehouse,
            paymentMethod,
            totalPrice: totalPrice, 
            items: items 
          }
        })
      });

      const strapiResult = await strapiResponse.json();

      if (!strapiResponse.ok) {
        throw new Error('Ошибка при сохранении заказа на бэкенде Strapi');
      }

      console.log('=== Ответ от бэкенда Strapi ===', strapiResult);

      // 🎯 НАДЁЖНЫЙ ПОИСК НОМЕРА ЗАКАЗА В СТРУКТУРЕ STRAPI V5
      // Наш бэкенд возвращает formattedResponse, где orderNumber лежит на самом верхнем уровне
      const finalOrderNumber = strapiResult?.orderNumber || 
                               strapiResult?.data?.orderNumber || 
                               `100${152 + (strapiResult?.id || strapiResult?.data?.id || 1)}`;

      console.log(`=== Фронтенд успешно зафиксировал номер заказа: №${finalOrderNumber} ===`);

      // Вызываем колбэк успешного заказа, передавая сгенерированный сервером номер
      onOrderSuccess(finalOrderNumber);

    } catch (err) {
      console.error(err);
      alert('Не удалось оформить заказ. Проверьте соединение с сервером.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name, setName,
    phone, setPhone,
    paymentMethod, setPaymentMethod,
    agreeWithTerms, setAgreeWithTerms,
    cityQuery, setCityQuery,
    cities,
    selectedCityRef, setSelectedCityRef,
    selectedCityName, setSelectedCityName,
    showCityDropdown, setShowCityDropdown,
    warehouses,
    selectedWarehouse, setSelectedWarehouse,
    isLoading,
    isFormValid,
    items,
    totalPrice,
    handleSubmit
  };
};