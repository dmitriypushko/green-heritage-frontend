import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

export interface ArticleDetailed {
  Title: string;
  Content: BlocksContent; 
  createdAt: string;
  Cover?: {
    url: string;
  };
}

export const STRAPI_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const useArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const [article, setArticle] = useState<ArticleDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullArticle = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);

      try {
        const currentLocale = i18n.language === 'ua' ? 'uk' : i18n.language;

        const response = await fetch(
          `${STRAPI_URL}/api/articles?filters[Slug][$eq]=${slug}&locale=${currentLocale}&populate=Cover`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch article data');
        }

        const { data } = await response.json();

        if (data && data.length > 0) {
          setArticle(data[0]);
        } else {
          setArticle(null);
        }
      } catch (err: any) {
        console.error('Error loading article:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullArticle();
  }, [slug, i18n.language]);

  return {
    article,
    isLoading,
    error,
    t,
    STRAPI_URL
  };
};