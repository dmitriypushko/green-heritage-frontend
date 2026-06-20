import { Routes, Route, Link } from 'react-router-dom';
import { PlantGrid } from "./widgets/PlantGrid/ui/PlantGrid.tsx";
import { CartPage } from "./pages/cart/ui/CartPage.tsx";
import { CategoryMenu } from "./features/filter-by-category/ui/CategoryMenu.tsx";
import { PlantDetailPage } from "./pages/plant_details/PlantDetailPage.tsx";
import Footer from "./widgets/footer/ui/Footer.tsx";
import Hero from "./widgets/hero/ui/Hero.tsx";
import { PublicOfferPage } from "./pages/PublicOfferPage/PublicOfferPage.tsx";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage/PrivacyPolicyPage.tsx";
import { DeliveryPage } from './pages/deliveryPage/DeliveryPage.tsx';
import { ArticlesPage } from './pages/ArticlePages/ArticlesPage.tsx';
import { ServicesPage } from './pages/ServicesPage/ServicesPage';
import PlantSkeleton from './shared/ui/skeleton/PlantSkeleton.tsx';
import G_H_logo from "./Assets/logo/G_H.png";
import { useAppLogic } from "./useAppLogic";
import type { SortType } from './useAppLogic';
import { ArticleDetailPage } from './pages/ArticlePages/ArticleDetailPage.tsx';
import  ScrollToTop  from './features/scroll_to_top/ui/ScrollToTop.tsx';
import './App.scss';

function App() {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeSubCategory,
    setActiveSubCategory,
    plantsData,
    filteredPlants,
    isLoading,
    error,
    totalCount,
    clearCart,
    t,                
    currentLanguage,   
    changeLanguage    
  } = useAppLogic();

  return (
    <div className="app-container">
      {/* ШАПКА САЙТА */}
      <header className="main-header">
        <div className="header-top">
          <Link to="/" className="logo-link">
            <img src={G_H_logo} alt="Logo" className="header-logo" />
          </Link>

          <div className="header-right">
            <div className="cart-controls">
              <Link to="/cart" className="cart-link">
                🛒 {t('header.cart')} ({totalCount})
              </Link>
              <button className="clear-btn" onClick={clearCart}>
                {t('header.clearCart')}
              </button>
            </div>
            
            {/* ИНТЕРАКТИВНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ */}
            <div className="lang-switcher">
              <button 
                className={`lang-btn ${currentLanguage.startsWith('ua') ? 'active' : ''}`}
                onClick={() => changeLanguage('ua')}
              >
                UA
              </button>
              <button 
                className={`lang-btn ${currentLanguage.startsWith('ru') ? 'active' : ''}`}
                onClick={() => changeLanguage('ru')}
              >
                RU
              </button>
              <button 
                className={`lang-btn ${currentLanguage.startsWith('en') ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <CategoryMenu 
          plants={plantsData} 
          activeSubCategory={activeSubCategory}
          onSelectSubCategory={setActiveSubCategory}
        />
      </header>
      
      {/* ОСНОВНОЙ КОНТЕНТ И РОУТИНГ */}
      <main>
        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            ⚠️ Error: {error}
          </div>
        )}

        <Routes>
          {/* ГЛАВНАЯ СТРАНИЦА КАТАЛОГА */}
          <Route path="/" element={
            <>
              <Hero />
              
              {/* Панель поиска и сортировки */}
              <div className="catalog-controls">
                <div className="search-wrapper">
                  <input
                    id="catalog-search"
                    name="search"
                    type="text"
                    placeholder={t('catalog.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    autoComplete="off"
                    data-lpignore="true"
                  />
                  {searchTerm && (
                    <button className="search-clear-btn" onClick={() => setSearchTerm('')}>✕</button>
                  )}
                </div>

                <select 
                  id="catalog-sort"
                  name="sort"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="sort-select"
                >
                  <option value="default">{t('catalog.sortDefault')}</option>
                  <option value="price-low">{t('catalog.sortPriceLow')}</option>
                  <option value="price-high">{t('catalog.sortPriceHigh')}</option>
                  <option value="name">{t('catalog.sortName')}</option>
                </select>
              </div>

              {/* Сетка товаров / Скелетоны */}
              {isLoading ? (
                <div className="plants-grid"> 
                  {Array.from({ length: 20 }).map((_, index) => (
                    <PlantSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <PlantGrid plants={filteredPlants} />
              )}
            </>
          } />

          {/* ОСТАЛЬНЫЕ СТРАНИЦЫ */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/plant/:documentId" element={<PlantDetailPage plants={plantsData} key={currentLanguage} />} />
          <Route path="/public-offer" element={<PublicOfferPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;