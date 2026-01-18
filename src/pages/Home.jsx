import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ImageCarousel from '../components/ImageCarousel';
import ProductCard from '../components/ProductCard';
import './Home.css';
import Navbar from '../components/Navbar';
import TrendingShowcase from '../components/TrendingShowcase';
import Footer from '../components/Footer';
import PremiumShowcase from '../components/PremiumShowcase';
import EndShowcase from '../components/endShowcase';
import CouponShowcase from '../components/CouponShowcase';
import ReviewsSection from '../components/ReviewSection';
import DomeGallery from '../components/DomeGallery';
import SplashCursor from '../components/SplashCursor';
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeAnimReady, setHomeAnimReady] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
    setTimeout(() => setHomeAnimReady(true), 100);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();

      const allProducts = data.products || [];

      if (allProducts.length <= 40) {
        setFeaturedProducts(allProducts);
      } else {
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 40));
      }

    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <SplashCursor />
      <Navbar />
      <section className="hero-section">
        <div className={`home-anim-hero ${homeAnimReady ? 'home-anim-visible' : ''}`}>
          <ImageCarousel />
        </div>
      </section>
      <section className='Mydome'>
        <div className="dome-gallery-wrapper">
          <div className="dome-gallery-header">
            <h2 className="dome-gallery-title">The Novara Collection</h2>
            <p className="dome-gallery-subtitle">Where artistry meets legacy</p>
          </div>
          <div className="dome-gallery-container">
            <DomeGallery
              fit={1}
              minRadius={1000}
              maxVerticalRotationDeg={15}
              dragDampening={4.2}
              grayscale={false}
              openedImageWidth='500px'
              openedImageHeight='500px'
            />
          </div>
        </div>
      </section>
      <section className="featured-section">
        <div className={`home-anim-featured ${homeAnimReady ? 'home-anim-visible' : ''}`}>
          {loading ? (
            <div className="loading home-anim-loading">
              <div className="home-anim-spinner"></div>
              Loading products...
            </div>
          ) : (
            <div className="products-flex">
              {featuredProducts.map((product, idx) => (
                <div
                  key={product._id}
                  className="home-anim-card"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="brand-tagline-section">
        <div className={`brand-tagline ${homeAnimReady ? 'home-anim-visible' : ''}`}>
          <h2>Fine 925 Silver</h2>
          <p className="brand-subtitle">The best thing you'll wear after your smile.</p>
        </div>
      </section>
      <section className="trending-now-section">
        <div className={`home-anim-trending ${homeAnimReady ? 'home-anim-visible' : ''}`}>
          <TrendingShowcase />
        </div>
      </section>
      <section className='coupon-showcase-section'>
        <CouponShowcase />
      </section>
      <section className='premium-showcase-section'>
        <PremiumShowcase />
      </section>
      <section className='end-showcase-section'>
        <EndShowcase />
      </section>
      <section className='reviews-section'>
        <ReviewsSection />
      </section>
      <Footer />
    </div>
  );
};

export default Home;