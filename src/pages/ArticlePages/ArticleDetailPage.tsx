import { useNavigate } from 'react-router-dom';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useArticleDetail, STRAPI_URL } from './useArticleDetail';
import styles from './ArticleDetailPage.module.scss';

export const ArticleDetailPage = () => {
  const navigate = useNavigate();
  const { article, isLoading, error, t } = useArticleDetail();

  // 1. Состояние загрузки (без хардкода)
  if (isLoading) {
    return (
      <div className={styles.loading}>
        {t('articleDetail.loading', 'Загружаем мудрость веков... 🌲')}
      </div>
    );
  }

  // 2. Ошибка или статья не найдена (без хардкода)
  if (error || !article) {
    return (
      <div className={styles.errorPage}>
        <h2>{t('detailPage.lostInForest', 'Заблудились в лесу...')} 🌲🍂</h2>
        <button className={styles.backBtn} onClick={() => navigate('/articles')}>
          {t('articleDetail.backToGrid', 'Вернуться к статьям')}
        </button>
      </div>
    );
  }

  const mainCoverUrl = article.Cover?.url 
    ? `${STRAPI_URL}${article.Cover.url}` 
    : null;

  return (
    <article className={styles.articlePage}>
      <button className={styles.backToBlog} onClick={() => navigate('/articles')}>
        ← {t('articles.backToArticles', 'Назад в раздел статей')}
      </button>

      <header className={styles.header}>
        <h1 className={styles.mainTitle}>{article.Title}</h1>
        {mainCoverUrl && (
          <div className={styles.mainCoverContainer}>
            <img src={mainCoverUrl} alt={article.Title} className={styles.mainCover} />
          </div>
        )}
      </header>

      {/* Рендеринг блоков контента из Strapi */}
      <main className={styles.richContent}>
        <BlocksRenderer content={article.Content} />
      </main>
    </article>
  );
};