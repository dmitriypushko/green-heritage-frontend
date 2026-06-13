import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import { Button } from '../../../shared/ui/button/Button';
import { getImageUrl } from '../../../shared/api/plantsStrapiApi';
import { usePlantCard } from './usePlantCard';
import type { Plant } from '../model/types';
import styles from './PlantCard.module.scss';

interface PlantCardProps {
  plant: Plant;
}

export const PlantCard = ({ plant }: PlantCardProps) => {
  const { t } = useTranslation(); // Инициализируем перевод
  const { isAlreadyInCart, quantity, handleAdd, handleRemove } = usePlantCard(plant);


  // 🌟 Защита: проверяем, есть ли массив картинок и не пустой ли он.
  // Если картинок нет, подставляем пустую строку (getImageUrl вернет пустую строку, и верстка не упадет)
  const hasImages = plant.images && plant.images.length > 0;
  const imageUrl = hasImages ? plant.images[0]?.url : '';

  return (
    <Link to={`/plant/${plant.documentId}`} className={styles.cardLink}>
      <article className={styles.card}>
        
        {/* Изображение саженца */}
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <img src={getImageUrl(imageUrl)} alt={plant.name} />
          ) : (
            /* Временная заглушка, пока нет фото для этой локали */
            <div className={styles.placeholderImage}>🌲 No photo</div>
          )}
        </div>

        {/* Инфо-блок */}
        <div className={styles.info}>
          <h3>{plant.name}</h3>
          <p className={styles.latin}>{plant.latinName}</p>
          {/* Локализуем валюту динамически через интерполяцию */}
          <div className={styles.price}>{plant.price} {t('catalog.currency')}</div>

        {/* Предотвращаем переход на страницу товара при кликах по кнопкам */}
        <div 
          className={styles.actionWrapper} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {isAlreadyInCart ? (
            
            // --- СЧЁТЧИК ТОВАРА В КОРЗИНЕ ---
            <div className={styles.quantityCounter}>
              <button className={styles.counterBtn} onClick={handleRemove}>
                −
              </button>
              <span className={styles.quantityNumber}>{quantity}</span>
              <button className={styles.counterBtn} onClick={handleAdd}>
                +
              </button>
            </div>

          ) : (

            // --- ОБЫЧНАЯ КНОПКА ДОБАВЛЕНИЯ ---
            <Button className={styles.main_button} onClick={handleAdd}>
              {t('catalog.addToCart')}
            </Button>

          )}
        </div>

        </div>
      </article>
    </Link>
  );
};