import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import styles from './ReviewForm.module.scss';
import { useReviewForm } from './useReviewForm';

interface ReviewFormProps {
  plantId: number;
  onSuccess: () => void;
}

export const ReviewForm = ({ plantId, onSuccess }: ReviewFormProps) => {
  const { t } = useTranslation(); // Инициализируем перевод

  const {
    authorName, setAuthorName,
    comment, setComment,
    rating, setRating,
    hoverRating, setHoverRating,
    photos,
    isSubmitting,
    isSuccess,
    error,
    handleFileChange,
    handleSubmit,
    handleResetSuccess
  } = useReviewForm(plantId, onSuccess);

  // ЭКРАН УСПЕШНОЙ ОТПРАВКИ (Ранний возврат)
  if (isSuccess) {
    return (
      <div className={styles.successMessage}>
        <h3>🌿 {t('reviews.successTitle')}</h3>
        <p>{t('reviews.successText')}</p>
        <button onClick={handleResetSuccess} className={styles.resetBtn}>
          {t('reviews.leaveAnother')}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3>{t('reviews.formTitle')}</h3>
      <p className={styles.subtitle}>{t('reviews.formSubtitle')}</p>

      {error && <div className={styles.errorAlert}>⚠️ {error}</div>}

      {/* Инпут Имени */}
      <div className={styles.inputGroup}>
        <label htmlFor="reviewAuthor">{t('reviews.labelName')}</label>
        <input 
          id="reviewAuthor"
          name="authorName"
          type="text" 
          value={authorName} 
          onChange={(e) => setAuthorName(e.target.value)} 
          placeholder="Homer J. Simpson" 
          required 
        />
      </div>

    {/* Интерактивный рейтинг Звездочками */}
<div className={styles.inputGroup}>
  {/* Меняем label на span, чтобы не было ругани на отсутствие id */}
  <span className={styles.groupLabel}>{t('reviews.labelRating')}</span>
  
  {/* Добавляем роль radiogroup и понятное описание для браузера */}
  <div 
    className={styles.starsContainer} 
    role="radiogroup" 
    aria-label={t('reviews.labelRating')}
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        role="radio" // Каждая звезда — это по сути скрытая радиокнопка
        aria-checked={rating >= star} // Передаем состояние браузеру
        aria-label={`${star} ${t('reviews.starsCount', { count: star }) || 'звезд'}`} // Описание для читалки
        tabIndex={0} // Чтобы можно было переключаться с клавиатуры
        className={`${styles.star} ${(hoverRating ?? rating) >= star ? styles.activeStar : ''}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(null)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRating(star); }} // Чат-помощь для клавиатуры
      >
        ★
      </span>
    ))}
  </div>
</div>

      {/* Текст отзыва */}
      <div className={styles.inputGroup}>
        <label htmlFor="reviewText">{t('reviews.labelComment')}</label>
        <textarea 
          id="reviewText"
          name="reviewComment"
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder={t('reviews.placeholderComment')} 
          rows={4}
          required 
        />
      </div>

      {/* Загрузчик фотографий */}
      <div className={styles.inputGroup}>
      <span className={styles.groupLabel}>{t('reviews.labelPhotos')}</span>
        <div className={styles.fileUploadWrapper}>
          <input 
            type="file" 
            id="review-photos"
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
            className={styles.hiddenFileInput}
          />
          <label htmlFor="review-photos" className={styles.fileLabel}>
            📸 {photos.length > 0 
              ? `${t('reviews.filesSelected')}: ${photos.length}` 
              : t('reviews.choosePhotos')
            }
          </label>
          
          {photos.length > 0 && (
            <div className={styles.fileNamesPreview}>
              {photos.map((f, i) => (
                <span key={i} className={styles.fileNameBadge}>{f.name}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
        {isSubmitting ? t('reviews.submitting') : t('reviews.submitBtn')}
      </button>
    </form>
  );
};