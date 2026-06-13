import { useTranslation } from 'react-i18next';
import { useOrderForm } from './useOrderForm';
import styles from './OrderForm.module.scss';

// 1. Расширяем интерфейс пропсов формы
interface OrderFormProps {
  onOrderSuccess: (orderNumber: string) => void;
  totalPrice: number;   // Получаем итоговую цену сверху
  itemsReport: string;  // Получаем красивую строку товаров сверху
}

export const OrderForm = ({ onOrderSuccess, totalPrice, itemsReport }: OrderFormProps) => {
  const { t } = useTranslation();

  // 2. Передаем эти пропсы объектом в наш хук useOrderForm
  const {
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
    handleSubmit
  } = useOrderForm({ onOrderSuccess, totalPrice, itemsReport }); // Передаем объектом!



  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>📍 {t('order.formTitle')}</h3>
      
      {/* Имя и Фамилия */}
      <div className={styles.inputGroup}>
        <label htmlFor="customerName">{t('order.labelName')}</label>
        <input 
          id="customerName"
          name="name"
          required 
          autoComplete="name"
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('order.placeholderName')} 
        />
      </div>

      {/* Телефон */}
      <div className={styles.inputGroup}>
        <label htmlFor="customerPhone">{t('order.labelPhone')}</label>
        <input 
          id="customerPhone"
          name="phone"
          autoComplete="tel"
          required 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+380XXXXXXXXX" 
        />
      </div>

      {/* Город */}
      <div className={styles.inputGroup} style={{ position: 'relative' }}>
        <label htmlFor="deliveryCity">{t('order.labelCity')}</label>
        <input 
          id="deliveryCity"
          name="city" // 🌟 Добавили name для полной чистоты
          required 
          type="text"
          autoComplete="off" 
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            if (selectedCityName && e.target.value !== selectedCityName) {
              setSelectedCityRef('');
              setSelectedCityName('');
            }
          }}
          placeholder={t('order.placeholderCity')} 
        />
        
        {showCityDropdown && cities.length > 0 && (
          <ul className={styles.dropdown}>
            {cities.map((city) => (
              <li 
                key={city.Ref}
                role="button" // 🌟 Подсказали браузеру, что элемент кликабельный
                tabIndex={0}  // 🌟 Чтобы можно было подсветить фокусом
                onClick={() => {
                  setCityQuery(city.Description);
                  setSelectedCityName(city.Description);
                  setSelectedCityRef(city.Ref);
                  setShowCityDropdown(false);
                }}
              >
                {city.Description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Отделение */}
      <div className={styles.inputGroup}>
        {/* 🌟 Связали лабел и селект через htmlFor и id */}
        <label htmlFor="deliveryWarehouse">{t('order.labelWarehouse')}</label>
        <select
          id="deliveryWarehouse"
          name="warehouse"
          required
          disabled={!selectedCityRef || warehouses.length === 0}
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className={styles.select}
        >
          {!selectedCityRef ? (
            <option value="">{t('order.selectCityFirst')}</option>
          ) : warehouses.length === 0 ? (
            <option value="">{t('order.loadingWarehouses')}</option>
          ) : (
            warehouses.map((w) => (
              <option key={w.Ref} value={w.Description}>
                {w.Description}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Оплата */}
<div className={styles.paymentGroup} role="radiogroup" aria-label={t('order.paymentGroupLabel')}>
  {/* 🌟 Заменили <label> на <span>, чтобы убрать ошибку привязки */}
  <span className={styles.groupLabel}>{t('order.paymentGroupLabel')}</span>
  
  <div className={styles.radioOption}>
    <input 
      type="radio" 
      id="cod" 
      name="payment" 
      value="cod"
      checked={paymentMethod === 'cod'}
      onChange={() => setPaymentMethod('cod')}
    />
    <label htmlFor="cod">
      <strong>{t('order.paymentCodTitle')}</strong>
      <span>{t('order.paymentCodDesc')}</span>
    </label>
  </div>

  <div className={styles.radioOption}>
    <input 
      type="radio" 
      id="card" 
      name="payment" 
      value="card"
      checked={paymentMethod === 'card'}
      onChange={() => setPaymentMethod('card')}
    />
    <label htmlFor="card">
      <strong>{t('order.paymentCardTitle')}</strong>
      <span>{t('order.paymentCardDesc')}</span>
    </label>
  </div>
</div>

      {/* Соглашения */}
      <div className={styles.termsGroup}>
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreeWithTerms}
            onChange={(e) => setAgreeWithTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            {t('order.termsText1')}{' '}
            <a href="/public-offer" target="_blank" rel="noreferrer">{t('order.termsLinkOffer')}</a>{' '}
            {t('order.termsText2')}{' '}
            <a href="/privacy-policy" target="_blank" rel="noreferrer">{t('order.termsLinkPrivacy')}</a>
          </label>
      </div>

      {/* Кнопка отправки */}
      <button 
        type="submit" 
        className={styles.submitBtn}
        disabled={isLoading || items.length === 0 || !isFormValid}
      >
        {isLoading ? t('order.savingBtn') : t('order.submitBtn')}
      </button>
    </form>
  );
};