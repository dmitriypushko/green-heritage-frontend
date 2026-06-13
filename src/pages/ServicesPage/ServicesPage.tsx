import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ServicesPage.module.scss';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← {t('common.back')}
      </button>
      <h1 className={styles.title}>{t('services.title')}</h1>
      
      <div className={styles.content}>
        <p className={styles.intro}>{t('services.intro')}</p>
        
        <div className={styles.servicesList}>
          {/* Услуга 1 */}
          <div className={styles.serviceItem}>
            <h3>🌲 {t('services.service1.title')}</h3>
            <p>{t('services.service1.desc')}</p>
          </div>

          {/* Услуга 2 */}
          <div className={styles.serviceItem}>
            <h3>🎨 {t('services.service2.title')}</h3>
            <p>{t('services.service2.desc')}</p>
          </div>

          {/* Услуга 3 */}
          <div className={styles.serviceItem}>
            <h3>👨‍⚕️ {t('services.service3.title')}</h3>
            <p>{t('services.service3.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};