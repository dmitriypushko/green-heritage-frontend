import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import styles from './DeliveryPage.module.scss';

export const DeliveryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Инициализируем перевод

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← {t('common.back')}
      </button>
      <h1 className={styles.title}>{t('deliveryPage.title')}</h1>
      
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>📦 {t('deliveryPage.deliveryTitle')}</h2>
          <p>{t('deliveryPage.deliveryText1')}</p>
          <p>{t('deliveryPage.deliveryText2')}</p>
        </section>

        <section className={styles.section}>
          <h2>💳 {t('deliveryPage.paymentTitle')}</h2>
          <p>{t('deliveryPage.paymentText')}</p>
          <ul>
            <li>
              <strong>{t('order.paymentCodTitle')}</strong> — {t('deliveryPage.codDesc')}
            </li>
            <li>
              <strong>{t('order.paymentCardTitle')}</strong> — {t('deliveryPage.cardDesc')}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};