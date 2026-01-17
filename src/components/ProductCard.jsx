import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
      await addToCart(product._id, 1);
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

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  if (!product || !product._id) {
    return null;
  }

  const price = product.finalPrice || 0;
  const inWishlist = isInWishlist(product._id);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img
            src={product.itemImages?.[0] || product.itemImage}
            alt={product.itemname}
            loading='lazy'
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
          <div className="delivery-badge">
            {product.deliveryType === 'ready-to-ship' ? (
              <span className="ready-ship">🚛5-7 Days</span>
            ) : (
              <span className="made-order">⏱️ 20-25 Days</span>
            )}
          </div>

          <div className={`card-overlay ${isHovered ? 'visible' : ''}`}>
            <button
              className={`icon-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleAddToWishlist}
              disabled={addingToWishlist}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              className="icon-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
              title="Add to cart"
            >
              <FiShoppingBag size={20} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h3 className="product-name">{product.itemname}</h3>
          <div className="dabba">
            <p className="product-code">{product.itemCode}</p>
            {!product.inStock && (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          <div className="product-pricing">
            <p className="original-price">₹{product.basePrice?.toLocaleString('en-IN')}</p>
            <p className="product-price" style={{ color: "#3c0a0bff" }}>
              ₹{price.toLocaleString('en-IN')}
            </p>
            <span className="discount-badge">10% OFF</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;