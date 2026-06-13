import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Следим за скроллом: если прокрутили больше 300px — показываем кнопку
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Чистим слушатель при размонтировании компонента
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Функция плавного скролла наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 🌟 Вот эта магия делает скролл плавным!
    });
  };

  return (
    <button
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Наверх"
    >
      <ArrowUp size={48} strokeWidth={1.5} />
    </button>
  );
};
export default ScrollToTop;