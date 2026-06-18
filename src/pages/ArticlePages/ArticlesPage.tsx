import { useNavigate } from 'react-router-dom';
import { useArticles, STRAPI_URL } from './useArticlesPage';
import styles from './ArticlesPage.module.scss';

export const ArticlesPage = () => {
  const navigate = useNavigate();
  const { articles, isLoading, error, t } = useArticles();

  return (
    <div className={styles.pageContainer}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← {t('common.back')}
      </button>
      <h1 className={styles.title}>{t('articles.title')}</h1>
      
      <div className={styles.content}>
        <p className={styles.intro}>{t('articles.intro')}</p>
        
        {/* Состояние загрузки */}
        {isLoading && (
          <div className={styles.loading}>
            <p>{t('articles.loading', 'Ищем свитки мудрости в архивах бэкенда... 🌲')}</p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className={styles.error}>
            <p>{t('articles.error', 'Ой, не удалось загрузить статьи. Но плантация всё равно растёт! 🌱')}</p>
          </div>
        )}

        {/* Пустой результат */}
        {!isLoading && !error && articles.length === 0 && (
          <div className={styles.empty}>
            <p>{t('articles.empty', 'Для этой локали статьи ещё переводятся. Загляните позже!')}</p>
          </div>
        )}

        {/* Сетка статей */}
        {!isLoading && !error && articles.length > 0 && (
          <div className={styles.articlesGrid}>
            {articles.map((article) => {
              // Умная проверка ссылки: если Cloudinary вернул http/https, то STRAPI_URL не приклеиваем
              const rawUrl = article.Cover?.url;
              const coverUrl = rawUrl
                ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`)
                : '/placeholder-forest.jpg';

              return (
                <article 
                  key={article.documentId} 
                  className={styles.articleCard}
                  onClick={() => navigate(`/articles/${article.Slug}`)}
                >
                  <div className={styles.coverWrapper}>
                    <img src={coverUrl} alt={article.Title} className={styles.coverImg} />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.articleTitle}>{article.Title}</h3>
                    <p className={styles.articleDesc}>{article.Description}</p>
                    <span className={styles.readMoreBtn}>
                      {t('articles.readMore')}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};