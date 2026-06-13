import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trees, Sprout, ShieldCheck, Truck } from 'lucide-react';
import styles from './Footer.module.scss';
import G_H_logo from './../../../Assets/logo/G_H.png';
import footer_seq from '../../../Assets/footer_pictures/sequoia_tree_footer.png';
import { Camera, Send, MessageSquareText } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation(); 
  const size = 32;

  return (
    <div className={styles.footer_container}>
      
      <div className={styles.footer_up_lay}>
        {/* Преимущество 1 */}
        <div className={styles.one_b}>
          <div className={styles.image}>
            <Trees size={size} className={styles.icon} />
          </div>
          <h3 className={styles.h_3}>{t('footer.benefits.rare.title')}</h3>
          <p className={styles.ppp}>{t('footer.benefits.rare.desc')}</p>
        </div>

        {/* Преимущество 2 */}
        <div className={styles.two_b}>
          <div className={styles.image}>
            <Sprout size={size} className={styles.icon} />
          </div>
          <h3 className={styles.h_3}>{t('footer.benefits.care.title')}</h3>
          <p className={styles.ppp}>{t('footer.benefits.care.desc')}</p>
        </div>

        {/* Преимущество 3 */}
        <div className={styles.tre_b}>
          <div className={styles.image}>
            <ShieldCheck size={size} className={styles.icon} />
          </div>
          <h3 className={styles.h_3}>{t('footer.benefits.quality.title')}</h3>
          <p className={styles.ppp}>{t('footer.benefits.quality.desc')}</p>
        </div>

        {/* Преимущество 4 */}
        <div className={styles.fou_b}>
          <div className={styles.image}>
            <Truck size={size} className={styles.icon} />
          </div>
          <h3 className={styles.h_3}>{t('footer.benefits.delivery.title')}</h3>
          <p className={styles.ppp}>{t('footer.benefits.delivery.desc')}</p>
        </div>
      </div>

      <div className={styles.footer_down_lay}>
        <div className={styles.block_1}>
          <img src={G_H_logo} alt="Logo" className={styles.logo} />
          <p>{t('footer.aboutText')}</p>

          <div className={styles.social_media}>
            {/* Инстаграм (через иконку камеры) */}
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className={styles.socialLink}
              onClick={(e) => e.preventDefault()}
            >
              <Camera size={20} strokeWidth={1.5} />
            </a>

            {/* Телеграм */}
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Telegram"
              className={styles.socialLink}
              onClick={(e) => e.preventDefault()}
            >
              <Send size={20} strokeWidth={1.5} />
            </a>

            {/* Вайбер */}
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Viber"
              className={styles.socialLink}
              onClick={(e) => e.preventDefault()}
            >
              <MessageSquareText size={20} strokeWidth={1.5} />
            </a>
          </div>

        </div>

        <div className={styles.block_2}>
          <h3>{t('footer.menuTitle')}</h3>
          {/* Ссылки на страницы используют уже готовые переводы названий страниц */}
          <Link to="/delivery" className={styles.but_foot}>{t('deliveryPage.title')}</Link>
          <Link to="/articles" className={styles.but_foot}>{t('footer.menuArticles')}</Link>
          <Link to="/services" className={styles.but_foot}>{t('services.title')}</Link>
        </div>

        <div className={styles.block_3}>
          <h3>{t('footer.contactsTitle')}</h3>
          <div className={styles.contact_info}>
            <p>+38 (099) 888-77-99</p>
            <p>info@green_heritage.ua</p>
            <p>{t('footer.workHours')}</p>
          </div>
        </div>

        <div className={styles.block_4}>
          <img src={footer_seq} alt="big_sequoiadendron" />
        </div>
      </div>

  
      <div className={styles.copyrightBar}>
        <p>
          &copy; {new Date().getFullYear()} Green Heritage. {t('copyright')}
        </p>
      </div>

    </div>
    

    
  );
}