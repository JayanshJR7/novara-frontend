import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiX, FiMaximize2 } from 'react-icons/fi';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('center');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(id);
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToWishlist(product._id);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-circle"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="btn-back-error">
              <FiArrowLeft /> Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">

        <button onClick={() => navigate(-1)} className="btn-back">
          <FiArrowLeft /> Back
        </button>

        <div className="product-grid">

          {/* Image Section with Real Zoom */}
          <div className="image-section">
            <div className="image-main-wrapper">
              <div 
                className="image-zoom-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setBackgroundPosition('center')}
              >
                <img 
                  src={product.itemImage} 
                  alt={product.itemname}
                  className="product-image"
                />
                <div 
                  className="zoomed-overlay"
                  style={{
                    backgroundImage: `url(${product.itemImage})`,
                    backgroundPosition: backgroundPosition
                  }}
                />
              </div>
              <button 
                className="btn-fullscreen"
                onClick={() => setShowZoomModal(true)}
              >
                <FiMaximize2 /> View Full Size
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="details-section">
            
            <div className="product-meta">
              <span className="category-tag">{product.category}</span>
              <span className="product-sku">SKU: {product.itemCode}</span>
            </div>
            
            <h1 className="product-name">{product.itemname}</h1>
            
            <div className="price-container">
              <div className="prices">
                <span className="price-original">₹{product.basePrice?.toFixed(2)}</span>
                <span className="price-current">₹{product.finalPrice?.toFixed(2)}</span>
              </div>
            </div>

            {product.description && (
              <div className="product-desc">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="stock-info">
              {product.inStock ? (
                <div className="stock-available">
                  <span className="stock-dot"></span>
                  In Stock
                </div>
              ) : (
                <div className="stock-unavailable">
                  <span className="stock-dot"></span>
                  Out of Stock
                </div>
              )}
            </div>

            {product.inStock && (
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-box">
                  <button onClick={decrementQuantity}>−</button>
                  <span>{quantity}</span>
                  <button onClick={incrementQuantity}>+</button>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FiShoppingBag />
                Add to Bag
              </button>

              <button
                className={`btn-wishlist ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={handleAddToWishlist}
              >
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {showZoomModal && (
        <div className="fullscreen-modal" onClick={() => setShowZoomModal(false)}>
          <button className="modal-close">
            <FiX size={28} />
          </button>
          <img src={product.itemImage} alt={product.itemname} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;