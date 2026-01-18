import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NovaraLoader from './components/NovaraLoader';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import RevenueAnalytics from './pages/RevenueAnalytics';
import ContactUs from './pages/ContactUs';
import TermsConditions from './pages/TermsCondition';
import ReturnPolicy from './pages/ReturnPolicy';
import Careguide from './pages/Careguide';
import ShippingPolicy from './pages/ShippingPolicy';
import PolicyPriv from './pages/PolicyPriv';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SplashCursor from './components/SplashCursor';

gsap.registerPlugin(ScrollTrigger);

function LenisScroll({ children }) {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Create Lenis instance
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Make Lenis globally accessible
    window.lenis = lenisRef.current;

    // Lenis scroll event for GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    // Use requestAnimationFrame
    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current.destroy();
      delete window.lenis;
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  return <>{children}</>;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isInitialLoad) return;

    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [isInitialLoad]);

  return (
    <>
      {isLoading && isInitialLoad && <NovaraLoader />}
      <Router>
        <SplashCursor />
        <AuthProvider>
          <CartProvider>
            <LenisScroll>
              <div className="app">
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/add-product" element={<AddProduct />} />
                    <Route path="/admin/edit-product/:id" element={<EditProduct />} />
                    <Route path="/admin/revenue-analytics" element={<RevenueAnalytics />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/return-policy" element={<ReturnPolicy />} />
                    <Route path="/careguide" element={<Careguide />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/privacy-policy" element={<PolicyPriv />} />
                  </Routes>
                </main>
              </div>
            </LenisScroll>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;