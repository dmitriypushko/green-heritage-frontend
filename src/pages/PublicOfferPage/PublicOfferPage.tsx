import { useTranslation } from 'react-i18next';
import styles from './PublicOfferPage.module.scss';

export const PublicOfferPage = () => {
  const { t } = useTranslation(); 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('offer.title')}</h1>
      <p className={styles.date}>{t('offer.date')}</p>

      <section className={styles.section}>
        <h2>{t('offer.section1.title')}</h2>
        <p>
          {t('offer.section1.p1_start')} <strong>«Green Heritage»</strong> {t('offer.section1.p1_end')}
        </p>
        <p>{t('offer.section1.p2')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('offer.section2.title')}</h2>
        <p>{t('offer.section2.p1')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('offer.section3.title')}</h2>
        <p>{t('offer.section3.p1')}</p>
        <p>{t('offer.section3.p2')}</p>
        <p>{t('offer.section3.p3')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('offer.section4.title')}</h2>
        <p>{t('offer.section4.p1')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('offer.section5.title')}</h2>
        <div className={styles.contacts}>
          <p><strong>{t('offer.section5.shopLabel')}</strong> Green Heritage</p>
          <p><strong>{t('offer.section5.emailLabel')}</strong> info@green-heritage.example.com</p>
          <p><strong>{t('offer.section5.phoneLabel')}</strong> +380 XX XXX XX XX</p>
          <p>{t('offer.section5.legalInfo')}</p>
        </div>
      </section>
    </div>
  );
};