import React, { useState } from 'react';
import { submitReview } from '../../../shared/api/plantsStrapiApi';

export const useReviewForm = (plantId: number, onSuccess: () => void) => {
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Обработка выбора файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitReview({
        authorName,
        rating,
        comment,
        plantId,
        photos
      });
      
      setIsSuccess(true);
      setAuthorName('');
      setComment('');
      setRating(5);
      setPhotos([]);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setIsSuccess(false);
  };

  return {
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
  };
};