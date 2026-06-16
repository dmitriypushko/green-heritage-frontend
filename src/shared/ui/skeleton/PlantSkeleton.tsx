import styles from './PlantSkeleton.module.scss';


export default function PlantSkeleton () {
  return (
    <div className={styles.skeletonCard}>
      {/* Блок для картинки */}
      <div className={`${styles.skeleton} ${styles.image}`} />
      
      <div className={styles.infoWrapper}>
        {/* Блок для категории */}
        <div className={`${styles.skeleton} ${styles.badge}`} />
        
        {/* Блок для названия */}
        <div className={`${styles.skeleton} ${styles.title}`} />
        
        {/* Блок для латинского названия */}
        <div className={`${styles.skeleton} ${styles.latin}`} />
        
        <div className={styles.footerRow}>
          {/* Блок для цены */}
          <div className={`${styles.skeleton} ${styles.price}`} />
          {/* Блок для кнопки */}
          <div className={`${styles.skeleton} ${styles.button}`} />
        </div>
      </div>
    </div>
  );
};