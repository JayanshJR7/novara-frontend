import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiZoomIn, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Mobile zoom states
  const [isMobileZoomed, setIsMobileZoomed] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);

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
      toast.error('Failed to load product details', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success(`${product.itemname} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to wishlist', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    const inWishlist = isInWishlist(product._id);

    try {
      setAddingToWishlist(true);

      if (inWishlist) {
        await removeFromWishlist(product._id);
        toast.info(`${product.itemname} removed from wishlist`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await addToWishlist(product._id);
        toast.success(`${product.itemname} added to wishlist!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingToWishlist(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Desktop hover zoom
  const handleMouseMove = (e) => {
    if (!imageRef.current || window.innerWidth < 968) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  let tapTimeout = null;
  let lastTap = 0;

  const handleMobileImageClick = (e) => {
    if (window.innerWidth >= 968) return;

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      setIsMobileZoomed(!isMobileZoomed);
      setDragOffset({ x: 0, y: 0 });
    }

    lastTap = currentTime;
  };

  // Drag functionality when zoomed
  const handleTouchStart = (e) => {
    if (!isMobileZoomed || window.innerWidth >= 968) return;

    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - dragOffset.x,
      y: e.touches[0].clientY - dragOffset.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobileZoomed || window.innerWidth >= 968) return;

    e.preventDefault();
    setDragOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="product-detail-novara">
        <div className="loading-state">
          <div className="elegant-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-novara">
        <div className="error-state">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist</p>
          <button onClick={() => navigate('/products')} className="elegant-btn">
            <FiArrowLeft /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = product.itemImages || [product.itemImage];
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="product-detail-novara">
      <div className="detail-container">

        {/* Breadcrumb */}
        <div className="elegant-breadcrumb">
          <button onClick={() => navigate(-1)} className="back-link-elegant">
            <FiArrowLeft /> Back
          </button>
          <span className="divider">•</span>
          <span className="crumb-category">{product.category}</span>
          <span className="divider">•</span>
          <span className="crumb-current">{product.itemname}</span>
        </div>

        {/* Main Grid */}
        <div className="detail-grid">

          {/* Left - Images */}
          <div className="images-section">

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="thumbnails-list">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumb-item ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsMobileZoomed(false);
                      setDragOffset({ x: 0, y: 0 });
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="main-image-wrapper" ref={zoomContainerRef}>
              {/* Delivery Badge - Top left */}
              <div className="delivery-badge-detail">
                {product.deliveryType === 'ready-to-ship' ? (
                  <span className="ready-ship">🚚 5-7 Days</span>
                ) : (
                  <span className="made-order">⏱️ 20-25 Days</span>
                )}
              </div>

              {/* Stock Badge - Top right */}
              <div className={`elegant-stock-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                {product.inStock ? (
                  <><FiCheck /> In Stock</>
                ) : (
                  <>Out of Stock</>
                )}
              </div>
              <div
                className={`image-zoom-container ${isZoomed ? 'zoomed' : ''} ${isMobileZoomed ? 'mobile-zoomed' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleMobileImageClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  ref={imageRef}
                  src={images[selectedImage]}
                  alt={product.itemname}
                  className="main-image"
                  style={
                    window.innerWidth >= 968 && isZoomed
                      ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2)',
                      }
                      : window.innerWidth < 968 && isMobileZoomed
                        ? {
                          transform: `scale(2.5) translate(${dragOffset.x / 2.5}px, ${dragOffset.y / 2.5}px)`,
                          cursor: isDragging ? 'grabbing' : 'grab',
                        }
                        : {}
                  }
                  draggable={false}
                />
                {!isZoomed && window.innerWidth >= 968 && (
                  <div className="zoom-hint">
                    <FiZoomIn />
                    <span>Hover to zoom</span>
                  </div>
                )}
                {window.innerWidth < 968 && !isMobileZoomed && (
                  <div className="mobile-zoom-hint">
                    <FiZoomIn />
                    <span>Double tap to zoom</span>
                  </div>
                )}
                {window.innerWidth < 968 && isMobileZoomed && (
                  <div className="mobile-zoom-hint active">
                    <span>Drag to pan • Tap to reset</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="product-header-elegant">
              <span className="category-tag-elegant">{product.category}</span>
              <h1 className="product-title-elegant">{product.itemname}</h1>
              <p className="product-code-elegant">Product Code: {product.itemCode}</p>
            </div>

            <div className="price-section-elegant">
              <div className="price-main">
                ₹{(product.calculatedPrice || product.finalPrice || product.basePrice)?.toLocaleString('en-IN')}
              </div>
              <p className="price-note">Inclusive of all taxes</p>
            </div>

            {/* Quantity */}
            {product.inStock && (
              <div className="quantity-section-elegant">
                <label>Quantity</label>
                <div className="qty-controls-elegant">
                  <button onClick={decrementQuantity}>−</button>
                  <span>{quantity}</span>
                  <button onClick={incrementQuantity}>+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="actions-section-elegant">
              <button
                className="btn-add-cart-elegant"
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
              >
                <FiShoppingBag />
                {addingToCart ? 'Adding...' : (product.inStock ? 'Add to Cart' : 'Out of Stock')}
              </button>
              <button
                className={`btn-wishlist-elegant ${inWishlist ? 'active' : ''}`}
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
              >
                <FiHeart fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-section-elegant">
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Certified Pure Silver</span>
              </div>
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>6 Months Warranty</span>
              </div>
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Secure Packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="details-section-elegant">

          {/* Description */}
          {product.description && (
            <div className="detail-card-elegant">
              <h3>Description</h3>
              <p>{product.description}</p>
              <h3>Weight</h3>
              <p>Gross weight: {product.weight.grossWeight} {product.weight.unit}</p>
              <p>Net weight: {product.weight.netWeight} {product.weight.unit}</p>
            </div>
          )}

          {/* Specifications */}
          {(product.weight?.netWeight > 0 || product.weight?.grossWeight > 0) && (
            <div className="detail-card-elegant">
              <h3>Specifications</h3>
              <div className="specs-grid-elegant">
                {product.weight.netWeight > 0 && (
                  <div className="spec-item-elegant">
                    <span className="spec-label">Net Weight</span>
                    <span className="spec-value">{product.weight.netWeight} {product.weight.unit}</span>
                  </div>
                )}
                {product.weight.grossWeight > 0 && (
                  <div className="spec-item-elegant">
                    <span className="spec-label">Gross Weight</span>
                    <span className="spec-value">{product.weight.grossWeight} {product.weight.unit}</span>
                  </div>
                )}
                <div className="spec-item-elegant">
                  <span className="spec-label">Material</span>
                  <span className="spec-value">925 Silver</span>
                </div>
                <div className="spec-item-elegant">
                  <span className="spec-label">Purity</span>
                  <span className="spec-value">92.5%</span>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="detail-card-elegant">
            <h3>Why Choose Novara Jewels</h3>
            <div className="features-elegant">
              <div className="feature-elegant">
                <div className="feature-icon-elegant">✦</div>
                <h4>Certified Purity</h4>
                <p>92.5% pure silver with authenticity certificate</p>
              </div>
              <div className="feature-elegant">
                <div className="feature-icon-elegant">✦</div>
                <h4>Handled With Care</h4>
                <p>Secure packaging and thoughtful handling from studio to you</p>
              </div>
              <div className="feature-elegant">
                <div className="feature-icon-elegant">✦</div>
                <h4>Quality Assurance</h4>
                <p>Each piece is crafted with precision and care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;