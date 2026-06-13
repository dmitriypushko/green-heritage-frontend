import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import { useCartPage } from './useCartPage';
import styles from './CartPage.module.scss';
import { OrderForm } from './OrderForm';
import { useAppLogic } from '../../../useAppLogic';

export const CartPage = () => {
  const { t } = useTranslation(); // Инициализируем перевод
  const { plantsData } = useAppLogic();

  const {
    items, // Массив [{ documentId, quantity }]
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
  } = useCartPage();

  // 🌟 ШАГ 3.3: Считаем общую стоимость динамически прямо тут, на основе живых цен
  const totalCartPrice = items.reduce((acc, item) => {
    const currentPlant = plantsData?.find(p => p.documentId === item.documentId);
    return acc + (currentPlant ? currentPlant.price * item.quantity : 0);
  }, 0);

  // 🤖 НОВЫЙ ШАГ: Генерируем красивую текстовую строчку товаров для передачи в форму (и затем в Telegram)
  const itemsReportForTelegram = items
    .map(item => {
      const plantInfo = plantsData?.find(p => p.documentId === item.documentId);
      // Если по какой-то причине растение не нашлось в базе, возвращаем пустую строку
      if (!plantInfo) return '';
      
      // Используем те поля, по которым сейчас строится верстка (plantInfo.name и plantInfo.price)
      return `• *${plantInfo.name}* (x${item.quantity}) — _${plantInfo.price * item.quantity} грн_`;
    })
    .filter(Boolean) // Удаляем пустые строки, если вдруг какое-то растение не нашлось
    .join('\n');

  // --- ЭКРАН УСПЕХА (Ранний возврат) ---
  if (isSent) {
    return (
      <div className={styles.page}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>🎊</div>
          
          <h2 className={styles.successTitle}>{t('cart.success.title')}</h2>
          <p className={styles.successText}>{t('cart.success.text')}</p>

          <div className={styles.orderNumberCard}>
            <span className={styles.orderLabel}>{t('cart.success.orderLabel')}</span>
            <strong className={styles.orderValue}>№ {orderNumber}</strong>
          </div>

          <div className={styles.nextSteps}>
            <p>{t('cart.success.nextSteps')}</p>
          </div>

          <div className={styles.successFooter}>
            <p>{t('cart.success.footerText')} 🌱</p>
            <h4>{t('cart.success.brand')}</h4>
            
            <button className={styles.homeBtn} onClick={handleGoToCatalog}>
              {t('cart.success.returnBtn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ОБЫЧНЫЙ ЭКРАН КОРЗИНЫ ---
  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={handleGoToCatalog}>
        ← {t('cart.backToCatalog')}
      </button>

      <h1>{t('cart.pageTitle')} 🌲</h1>
      
      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>{t('cart.emptyText')}</p>
          <button className={styles.continueShopping} onClick={handleGoToCatalog}>
            {t('cart.goToCatalogBtn')}
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          {/* Список товаров */}
          <div className={styles.list}>
            {items.map(item => {
              const plantInfo = plantsData?.find(p => p.documentId === item.documentId);

              if (!plantInfo) return null;

              return (
                <div key={item.documentId} className={styles.item}>
                  <span className={styles.name}>{plantInfo.name}</span>
                  
                  <div className={styles.controls}>
                    <button onClick={() => decreaseQuantity(item.documentId)}>−</button>
                    <span className={styles.quantity}>
                      {item.quantity} {t('cart.pcs')}
                    </span>
                    <button onClick={() => increaseQuantity(item.documentId)}>+</button>
                  </div>

                  <span className={styles.price}>
                    {plantInfo.price * item.quantity} {t('cart.currency')}
                  </span>
                  
                  <button className={styles.removeBtn} onClick={() => removeItem(item.documentId)}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Сводка и Оформление */}
          <div className={styles.summary}>
            {!isCheckout ? (
              <>
                <h3>{t('cart.total', { price: totalCartPrice })}</h3>
                <div className={styles.checkoutTriggerWrapper}>
                  <button className={styles.checkoutBtn} onClick={handleStartCheckout}>
                    {t('cart.checkoutBtn')}
                  </button>
                </div>
                <button className={styles.clearBtn} onClick={clearCart}>
                  {t('cart.clearAllBtn')}
                </button>
              </>
            ) : (
              <div className={styles.checkoutFormBlock}>
                <button className={styles.backToCartBtn} onClick={handleCancelCheckout}>
                  {t('cart.backToEditBtn')}
                </button>
                
                <h4 className={styles.checkoutTotal}>
                  {t('cart.toPay', { price: totalCartPrice })}
                </h4>
                
                {/* 🎯 ВОТ ТУТ: Передаем посчитанную цену и сформированный отчет прямо в форму через новые пропсы */}
                <OrderForm 
                  onOrderSuccess={handleOrderSuccess} 
                  totalPrice={totalCartPrice}
                  itemsReport={itemsReportForTelegram}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};