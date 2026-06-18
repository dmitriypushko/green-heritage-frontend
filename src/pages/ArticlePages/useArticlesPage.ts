import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Выносим тип отдельно. Если у тебя есть глобальный файл типов, можно закинуть туда
export interface Article {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Description: string;
  createdAt: string;
  Cover?: {
    url: string;
  };
}

export const STRAPI_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const useArticles = () => {
  const { t, i18n } = useTranslation();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Мапим язык фронтенда (ua) на локаль Strapi (uk)
        const currentLocale = i18n.language === 'ua' ? 'uk' : i18n.language;

        const response = await fetch(
          `${STRAPI_URL}/api/articles?locale=${currentLocale}&populate=Cover`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const { data } = await response.json();
        setArticles(data || []);
      } catch (err: any) {
        console.error('Error fetching articles:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [i18n.language]);

  // Возвращаем наружу только то, что нужно UI-компоненту
  return {
    articles,
    isLoading,
    error,
    t,
    STRAPI_URL
  };
};