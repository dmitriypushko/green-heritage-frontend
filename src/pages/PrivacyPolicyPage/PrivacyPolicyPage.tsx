import { useTranslation } from 'react-i18next';
import styles from './PrivacyPolicyPage.module.scss';

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation(); 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('privacy.title')}</h1>
      <p className={styles.date}>{t('privacy.date')}</p>

      <section className={styles.section}>
        <h2>{t('privacy.section1.title')}</h2>
        <p>
          {t('privacy.section1.intro')} <strong>Green Heritage</strong> {t('privacy.section1.introEnd')}
        </p>
        <ul>
          <li>{t('privacy.section1.bullet1')}</li>
          <li>{t('privacy.section1.bullet2')}</li>
          <li>{t('privacy.section1.bullet3')}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('privacy.section2.title')}</h2>
        <p>{t('privacy.section2.intro')}</p>
        <ul>
          <li>{t('privacy.section2.bullet1')}</li>
          <li>{t('privacy.section2.bullet2')}</li>
          <li>{t('privacy.section2.bullet3')}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('privacy.section3.title')}</h2>
        <p>{t('privacy.section3.text')}</p>
      </section>

      <section className={styles.section}>
        <h2>{t('privacy.section4.title')}</h2>
        <p>{t('privacy.section4.text')}</p>
      </section>
    </div>
  );
};