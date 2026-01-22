import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiZoomIn, FiCheck, FiMaximize2, FiX, FiChevronLeft, FiChevronRight, FiZoomOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

  // Fullscreen modal states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenZoomed, setFullscreenZoomed] = useState(false);
  const [fullscreenZoomLevel, setFullscreenZoomLevel] = useState(1);
  const [fullscreenDragOffset, setFullscreenDragOffset] = useState({ x: 0, y: 0 });
  const [fullscreenDragStart, setFullscreenDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreenDragging, setIsFullscreenDragging] = useState(false);

  // Mobile zoom states
  const [isMobileZoomed, setIsMobileZoomed] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { cartCount, wishlistCount } = useCart();

  const imageRef = useRef(null);
  const zoomContainerRef = useRef(null);
  const fullscreenImageRef = useRef(null);
  const iconsRef = useRef([]);


  // Helper function to format price with 3 decimals and Indian number format
  const formatPrice = (price) => {
    if (!price) return '0.000';
    return price.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      if (e.key === 'Escape') {
        closeFullscreen();
      } else if (e.key === 'ArrowLeft') {
        navigateImage(-1);
      } else if (e.key === 'ArrowRight') {
        navigateImage(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage, product]);

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
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to checkout', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    if (!product.inStock) {
      toast.error('Product is out of stock', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Direct checkout with this product only - no cart modification
    navigate('/checkout', {
      state: {
        buyNowMode: true,
        buyNowItem: {
          product: product,
          quantity: quantity,
          itemTotal: (product.calculatedPrice || product.finalPrice || product.basePrice) * quantity
        }
      }
    });
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

  // Fullscreen functions
  const openFullscreen = () => {
    setIsFullscreen(true);
    setFullscreenZoomed(false);
    setFullscreenZoomLevel(1);
    setFullscreenDragOffset({ x: 0, y: 0 });
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenZoomed(false);
    setFullscreenZoomLevel(1);
    setFullscreenDragOffset({ x: 0, y: 0 });
  };

  const toggleFullscreenZoom = () => {
    if (fullscreenZoomed) {
      setFullscreenZoomLevel(1);
      setFullscreenDragOffset({ x: 0, y: 0 });
    } else {
      setFullscreenZoomLevel(2.5);
    }
    setFullscreenZoomed(!fullscreenZoomed);
  };

  const navigateImage = (direction) => {
    const images = product.itemImages || [product.itemImage];
    const newIndex = (selectedImage + direction + images.length) % images.length;
    setSelectedImage(newIndex);
    setFullscreenZoomed(false);
    setFullscreenZoomLevel(1);
    setFullscreenDragOffset({ x: 0, y: 0 });
  };

  // Fullscreen drag handlers
  const handleFullscreenMouseDown = (e) => {
    if (!fullscreenZoomed) return;
    setIsFullscreenDragging(true);
    setFullscreenDragStart({
      x: e.clientX - fullscreenDragOffset.x,
      y: e.clientY - fullscreenDragOffset.y
    });
  };

  const handleFullscreenMouseMove = (e) => {
    if (!isFullscreenDragging || !fullscreenZoomed) return;
    setFullscreenDragOffset({
      x: e.clientX - fullscreenDragStart.x,
      y: e.clientY - fullscreenDragStart.y
    });
  };

  const handleFullscreenMouseUp = () => {
    setIsFullscreenDragging(false);
  };

  // Fullscreen touch handlers
  const handleFullscreenTouchStart = (e) => {
    if (!fullscreenZoomed) return;
    setIsFullscreenDragging(true);
    setFullscreenDragStart({
      x: e.touches[0].clientX - fullscreenDragOffset.x,
      y: e.touches[0].clientY - fullscreenDragOffset.y
    });
  };

  const handleFullscreenTouchMove = (e) => {
    if (!isFullscreenDragging || !fullscreenZoomed) return;
    e.preventDefault();
    setFullscreenDragOffset({
      x: e.touches[0].clientX - fullscreenDragStart.x,
      y: e.touches[0].clientY - fullscreenDragStart.y
    });
  };

  const handleFullscreenTouchEnd = () => {
    setIsFullscreenDragging(false);
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
        <Navbar />
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

  const formatDescription = (description) => {
    if (!description) return null;

    // Split by newlines
    const lines = description.split('\n').filter(line => line.trim());

    // Check if it contains bullet points (• or - or *)
    const hasBullets = lines.some(line =>
      line.trim().startsWith('•') ||
      line.trim().startsWith('-') ||
      line.trim().startsWith('*')
    );

    if (hasBullets) {
      // Render as list
      return (
        <ul className="description-list">
          {lines.map((line, index) => {
            // Remove bullet characters
            const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
            return cleanLine ? <li key={index}>{cleanLine}</li> : null;
          })}
        </ul>
      );
    } else {
      // Render as paragraphs with line breaks
      return lines.map((line, index) => (
        <p key={index}>{line}</p>
      ));
    }
  };

  const images = product.itemImages || [product.itemImage];
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="product-detail-novara">
      <Navbar />
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
          <Link to="/cart" className="detail-icon-link" ref={(el) => (iconsRef.current[1] = el)}>
            <FiShoppingBag /> Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
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

              {/* Fullscreen Button */}
              <button className="fullscreen-btn" onClick={openFullscreen} title="View fullscreen">
                <FiMaximize2 />
              </button>

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
                ₹{formatPrice(product.calculatedPrice || product.finalPrice || product.basePrice)}
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

            {/* Buy Now Button */}
            {product.inStock && (
              <button
                className="btn-buy-now-elegant"
                onClick={handleBuyNow}
              >
                ✨ Make It Yours Instantly
              </button>
            )}

            {/* Trust Badges */}
            <div className="trust-section-elegant">
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Certified 925 Silver</span>
              </div>
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Hallmarked jewellery</span>
              </div>
              <div className="trust-item-elegant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Secure Brand packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="details-section-elegant">

          {/* Description and Weight */}
          {(product.description || (product.weight && (product.weight.silverWeight > 0 || product.weight.grossWeight > 0))) && (
            <div className="detail-card-elegant">
              {product.description && (
                <>
                  <h3>Description</h3>
                  {formatDescription(product.description)}
                </>
              )}
              {product.weight && (product.weight.silverWeight > 0 || product.weight.grossWeight > 0) && (
                <>
                  <h3>Weight</h3>
                  {product.weight.grossWeight > 0 && (
                    <p>Gross weight: {product.weight.grossWeight.toFixed(3)} {product.weight.unit}</p>
                  )}
                  {product.weight.silverWeight > 0 && (
                    <p>Silver weight: {product.weight.silverWeight.toFixed(3)} {product.weight.unit}</p>
                  )}
                </>
              )}
              <p className="info-weight-note">The weights are approx and may vary from piece to piece</p>
            </div>
          )}

          {/* Specifications */}
          {(product.weight?.silverWeight > 0 || product.weight?.grossWeight > 0) && (
            <div className="detail-card-elegant">
              <h3>Specifications</h3>
              <div className="specs-grid-elegant">
                {product.weight.silverWeight > 0 && (
                  <div className="spec-item-elegant">
                    <span className="spec-label">Silver Weight</span>
                    <span className="spec-value">{product.weight.silverWeight.toFixed(3)} {product.weight.unit}</span>
                  </div>
                )}
                {product.weight.grossWeight > 0 && (
                  <div className="spec-item-elegant">
                    <span className="spec-label">Gross Weight</span>
                    <span className="spec-value">{product.weight.grossWeight.toFixed(3)} {product.weight.unit}</span>
                  </div>
                )}
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

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <div className="fullscreen-overlay"></div>

          {/* Close Button */}
          <button className="fullscreen-close" onClick={closeFullscreen}>
            <FiX />
          </button>

          {/* Zoom Toggle */}
          <button className="fullscreen-zoom-toggle" onClick={(e) => { e.stopPropagation(); toggleFullscreenZoom(); }}>
            {fullscreenZoomed ? <FiZoomOut /> : <FiZoomIn />}
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="fullscreen-counter">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="fullscreen-nav fullscreen-nav-prev"
                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
              >
                <FiChevronLeft />
              </button>
              <button
                className="fullscreen-nav fullscreen-nav-next"
                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
              >
                <FiChevronRight />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleFullscreenMouseDown}
            onMouseMove={handleFullscreenMouseMove}
            onMouseUp={handleFullscreenMouseUp}
            onMouseLeave={handleFullscreenMouseUp}
            onTouchStart={handleFullscreenTouchStart}
            onTouchMove={handleFullscreenTouchMove}
            onTouchEnd={handleFullscreenTouchEnd}
          >
            <img
              ref={fullscreenImageRef}
              src={images[selectedImage]}
              alt={product.itemname}
              className="fullscreen-image"
              style={{
                transform: `scale(${fullscreenZoomLevel}) translate(${fullscreenDragOffset.x / fullscreenZoomLevel}px, ${fullscreenDragOffset.y / fullscreenZoomLevel}px)`,
                cursor: fullscreenZoomed ? (isFullscreenDragging ? 'grabbing' : 'grab') : 'default',
              }}
              draggable={false}
            />
          </div>

          {/* Instruction Text */}
          {fullscreenZoomed && (
            <div className="fullscreen-instruction">
              Drag to pan the image
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;