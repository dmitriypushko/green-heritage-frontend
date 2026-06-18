import { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import type { Plant } from '../../entities/plant/model/types';
import styles from './PlantDetailPage.module.scss';
import { getImageUrl } from '../../shared/api/plantsStrapiApi';
import { ReviewForm } from '../../features/reviews/ui/ReviewForm';
import { usePlantDetailPage } from './usePlantDetailPage';

interface PlantDetailPageProps {
  plants: Plant[];
}

interface StrapiImage {
  id?: number | string;
  url: string;
  attributes?: {
    url: string;
    [key: string]: any; 
  };
}

interface ReviewImagesProps {
  imagesData: StrapiImage[] | { data: StrapiImage[] } | null | undefined;
}

const ReviewImages = ({ imagesData }: ReviewImagesProps) => {
  const images = useMemo<StrapiImage[]>(() => {
    if (!imagesData) return [];
    if (Array.isArray(imagesData)) return imagesData;
    if (imagesData.data && Array.isArray(imagesData.data)) return imagesData.data;
    return [];
  }, [imagesData]);

  if (images.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
      {images.map((img: any, idx: number) => {
        const rawUrl = img.attributes?.url || img.url;
        if (!rawUrl) return null;
        
        const fullUrl = getImageUrl(rawUrl);

        return (
          <a key={idx} href={fullUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
            <img 
              src={fullUrl} 
              alt="Review attachment" 
              style={{ 
                width: '90px', 
                height: '90px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                cursor: 'zoom-in',
                transition: 'transform 0.2s ease'
              }} 
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </a>
        );
      })}
    </div>
  );
};

export const PlantDetailPage = ({ plants }: PlantDetailPageProps) => {
  const { t } = useTranslation(); 

  const {
    plant,
    isAlreadyInCart,
    activeImg,
    setActiveImg,
    plantFeatures,
    normalizedReviews,
    handleBack,
    handleGoHome,
    handleAddToCart
  } = usePlantDetailPage(plants);

  // Ранний возврат, если растение не найдено
  if (!plant) {
    return (
      <div className={styles.errorPage}>
        <h1>Упс! {t('detailPage.lostInForest')} 🌲</h1>
        <button onClick={handleGoHome}>{t('detailPage.returnHome')}</button>
      </div>
    );
  }

  // Вычисляем наличие на основе поля stock из Strapi
  // Если поля нет в ответе, по дефолту считаем, что доступно (или ставим 0 для безопасности)
  const isAvailable = plant.stock !== undefined ? plant.stock > 0 : true;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={handleBack}>
          <span>←</span> {t('detailPage.backToCatalog')}
        </button>
  
        <div className={styles.mainContent}>
          {/* Блок картинок */}
          <div className={styles.imageBlock}>
            <div className={styles.mainImageWrapper}>
              {activeImg && <img src={activeImg} alt={plant.name} className={styles.mainImage} />}
            </div>
            
            {plant.images && plant.images.length > 1 && (
              <div className={styles.thumbnails}>
                {plant.images.map((img, index) => {
                  const currentThumbUrl = getImageUrl(img?.url);
                  return (
                    <div 
                      key={index}
                      className={`${styles.thumbnail} ${activeImg === currentThumbUrl ? styles.activeThumb : ''}`}
                      onClick={() => setActiveImg(currentThumbUrl)}
                    >
                      <img src={currentThumbUrl} alt={`${plant.name} view ${index + 1}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
  
          {/* Информационный блок */}
          <div className={styles.infoBlock}>
            <div className={styles.header}>
              <span className={styles.categoryBadge}>
                {plant.subCategory ? t(`subcategories.${plant.subCategory}`, { defaultValue: plant.subCategory }) : ''}
              </span>
              <h1 className={styles.title}>{plant.name}</h1>
              <p className={styles.latinName}>{plant.latinName}</p>
            </div>
  
            <div className={styles.purchaseAction}>
              <div className={styles.priceTag}>
                <span className={styles.amount}>{plant.price}</span>
                <span className={styles.currency}>{t('cart.currency')}</span>
              </div>
              
              <button 
                className={`${styles.addToCartBtn} ${isAlreadyInCart ? styles.inCart : ''} ${!isAvailable ? styles.outOfStockBtn : ''}`}
                onClick={handleAddToCart}
                disabled={isAlreadyInCart || !isAvailable} // Блокируем кнопку, если уже в корзине ИЛИ нет в наличии
              >
                {/* Динамический текст на кнопке */}
                {!isAvailable 
                  ? t('detailPage.outOfStockButton', { defaultValue: 'Закончился' }) 
                  : isAlreadyInCart 
                    ? `✓ ${t('detailPage.inCart')}` 
                    : t('detailPage.addToCart')}
              </button>
            </div>

            {/* БЛОК НАЛИЧИЯ (как на макете availability_.jpg) */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              margin: '0.8rem 0 1.2rem 0',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              <span style={{ color: '#718096' }}>{t('detailPage.availabilityLabel', { defaultValue: 'Наличие:' })}</span>
              {isAvailable ? (
                <span style={{ color: '#2f855a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>✓</span> {t('detailPage.inStock', { defaultValue: 'В наличии' })}
                </span>
              ) : (
                <span style={{ color: '#c53030', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>✕</span> {t('detailPage.outOfStock', { defaultValue: 'Нет в наличии' })}
                </span>
              )}
            </div>

            {plantFeatures && (
              <div className={styles.featuresBadgeBlock}>
                {plantFeatures.isRedBook && (
                  <div className={styles.redBookBadge}>📕 {t('detailPage.redBook')}</div>
                )}
                {plantFeatures.soilType && (
                  <div className={styles.featureRow}>
                    <span className={styles.featureLabel}> {t('detailPage.soil')}:</span>
                    <span className={styles.featureValue}>{plantFeatures.soilType}</span>
                  </div>
                )}
                {plantFeatures.hardinessZone && (
                  <div className={styles.featureRow}>
                    <span className={styles.featureLabel}> {t('detailPage.hardiness')}:</span>
                    <span className={styles.featureValue}>
                      {t('detailPage.zone', { zone: plantFeatures.hardinessZone })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
  
        <div className={styles.divider} />
  
        {/* Описание */}
        <div className={styles.descriptionBlock}>
          <h3>{t('detailPage.careTitle')}</h3>
          <div className={styles.textWrapper}>
            {Array.isArray(plant.description) ? (
              plant.description.map((block: any, blockIdx: number) => {
                const paragraphText = block.children?.map((child: any) => child.text).join('') || '';
                return paragraphText ? (
                  <p key={blockIdx} className={styles.paragraph}>{paragraphText}</p>
                ) : null;
              })
            ) : (
              <p className={styles.paragraph}>
                {plant.description ? String(plant.description) : t('detailPage.noDescription')}
              </p>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Секция отзывов */}
        <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: '#1a202c', fontWeight: '600' }}>
            {t('detailPage.reviewsTitle', { count: normalizedReviews.length })}
          </h3>
          
          {normalizedReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {normalizedReviews.map((review: any) => (
                <div key={review.id} style={{ padding: '1.2rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <strong style={{ color: '#2d3748', fontSize: '1.05rem' }}>{review.authorName}</strong>
                    <span style={{ color: '#f6ad55', fontSize: '1.1rem' }}>
                      {"★".repeat(Number(review.rating || 5))}
                      {"☆".repeat(5 - Number(review.rating || 5))}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.4rem 0', color: '#4a5568', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {review.comment}
                  </p>

                  <ReviewImages imagesData={review.images} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#a0aec0', fontStyle: 'italic', backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              {t('detailPage.noReviews')}
            </p>
          )}
        </div>
            
        <ReviewForm 
          plantId={Number(plant.id)} 
          onSuccess={() => console.log('Отзыв отправлен!')} 
        />
      </div>
    </div>
  );
};