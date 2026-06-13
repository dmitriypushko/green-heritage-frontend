import { useTranslation } from 'react-i18next';
import styles from './CategoryMenu.module.scss';
import { useCategoryMenu } from './useCategoryMenu';
import type { Plant } from '../../../entities/plant/model/types';

interface CategoryMenuProps {
  plants: Plant[];
  activeSubCategory: string | null;
  onSelectSubCategory: (sub: string | null) => void;
}

export const CategoryMenu = ({ plants, activeSubCategory, onSelectSubCategory }: CategoryMenuProps) => {
  const { menuData } = useCategoryMenu(plants);
  const { t } = useTranslation();

  return (
    <div className={styles.menu_container}>
      <nav className={styles.menu_content}>
        
        {/* Ряд с главной кнопкой и категориями */}
        <div className={styles.category_row}>
          <button 
            className={`${styles.all_btn} ${!activeSubCategory ? styles.active : ''}`} 
            onClick={() => onSelectSubCategory(null)}
          >
            {t('header.allTrees')}
          </button>

          {/* Контейнер для групп "Хвойные" и "Лиственные" */}
          <div className={styles.categories_wrapper}>
            {Object.entries(menuData).map(([mainCat, subCats]) => (
              <div key={mainCat} className={styles.group}>
                
                <span className={styles.groupLabel}>
                  {mainCat === 'coniferous' ? t('catalog.coniferous') : t('catalog.deciduous')}
                </span>
                
                <div className={styles.subList}>
                  {Array.from(subCats).map(sub => (
                    <button
                      key={sub}
                      className={`${styles.cat_btn} ${activeSubCategory === sub ? styles.active : ''}`}
                      onClick={() => onSelectSubCategory(sub)}
                    >
                      {/* 🌟 МАГИЯ ТУТ: берем русское слово из базы и используем как ключ перевода */}
                      {t(`subcategories.${sub}`)}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

      </nav>
    </div>
  );
};