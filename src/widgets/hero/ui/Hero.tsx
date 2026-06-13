import { useTranslation } from 'react-i18next';
import styles from './Hero.module.scss';

export default function Hero () {
  const { t } = useTranslation(); 

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {t('hero.titleLine1')} <br />
            <span>{t('hero.titleLine2')}</span>
          </h1>
          
          <p className={styles.description}>
            {t('hero.descriptionLine1')} <br />
            {t('hero.descriptionLine2')}
          </p>
        </div>
      </div>
      
      <div className={styles.hero_image_overlay}></div>
    </section>
  );
};