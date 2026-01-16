// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import ProductCard from '../components/ProductCard';
// import { FiShoppingBag, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
// import './Wishlist.css';
// import Navbar from '../components/Navbar';
// import { toast } from 'react-toastify';

// const Wishlist = () => {
//   const { isAuthenticated } = useAuth();
//   const { wishlist, loading, removeFromWishlist, addToCart } = useCart();
//   const [addingToCartId, setAddingToCartId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   const handleRemove = async (productId) => {
//     try {
//       await removeFromWishlist(productId);
//       toast.info('Item removed from wishlist', {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (error) {
//       console.error('Failed to remove from wishlist:', error);
//       toast.error('Failed to remove item', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleAddToCart = async (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!product || !product._id) return;

//     try {
//       setAddingToCartId(product._id);
//       await addToCart(product._id, 1);
//       toast.success(`${product.itemname} added to cart!`, {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//       toast.error('Failed to add to cart. Please try again.', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setAddingToCartId(null);
//     }
//   };

//   // Render Navbar outside the conditional content
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="wishlist-page">
//           <div className="container">
//             <div className="loading">Loading wishlist...</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (!wishlist || wishlist.length === 0) {
//     return (
//       <>
//         <Navbar />
//         <div className="wishlist-page">
//           <div className="container">
//             <div className="empty-wishlist">
//               <h2>Your Wishlist is Empty</h2>
//               <p>Save your favorite items here!</p>
//               <button onClick={() => navigate('/products')}>
//                 Browse Products
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="wishlist-page">
//         <div className="container">
//           <button onClick={() => navigate(-1)} className="back-btn">
//             <FiArrowLeft /> Back
//           </button>

//           <div className="wishlist-header">
//             <div>
//               <h1>My Wishlist</h1>
//               <p>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
//             </div>
//           </div>

//           <div className="products-grid">
//             {wishlist.map((product) => {
//               if (!product || !product._id) return null;

//               return (
//                 <div className="wishlist-item" key={product._id}>
//                   <ProductCard product={product} />

//                   <div className="btn-container">
//                     <button
//                       className="cartadd-btn"
//                       onClick={(e) => handleAddToCart(e, product)}
//                       disabled={addingToCartId === product._id}
//                     >
//                       <FiShoppingBag size={18} />
//                       {addingToCartId === product._id ? 'Adding...' : 'Add to Cart'}
//                     </button>

//                     <button
//                       className="remove-wishlist-btn"
//                       onClick={() => handleRemove(product._id)}
//                     >
//                       <FiTrash2 size={16} /> Remove
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Wishlist;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { FiShoppingBag, FiArrowLeft, FiTrash2, FiHeart } from 'react-icons/fi';
import './Wishlist.css';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, removeFromWishlist, addToCart } = useCart();
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      toast.info('Item removed from wishlist', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || !product._id) return;

    try {
      setAddingToCartId(product._id);
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
      setAddingToCartId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page">
          <div className="wishlist-background">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>
          <div className="container">
            <div className="loading-luxury">
              <div className="loader-ring"></div>
              <p>Loading your treasures...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page">
          <div className="wishlist-background">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>
          <div className="container">
            <div className="empty-wishlist-luxury">
              <div className="empty-icon-wrapper">
                <FiHeart className="empty-heart-icon" />
                <div className="pulse-ring"></div>
              </div>
              <h2 className="empty-title">Your Collection Awaits</h2>
              <p className="empty-subtitle">Curate your personal treasury of exquisite pieces</p>
              <div className="decorative-line">
                <span className="line"></span>
                <span className="diamond">◆</span>
                <span className="line"></span>
              </div>
              <button onClick={() => navigate('/products')} className="explore-btn">
                <span>Explore Collection</span>
                <span className="btn-shine"></span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        <div className="wishlist-background">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        <div className="container">


          <div className="wishlist-header-luxury">
            <div className="header-content">
              <div className="header-ornament">⟡</div>
              <h1 className="wishlist-title">Your Wishlist</h1>
              <p className="wishlist-count">
                <span className="count-number">{wishlist.length}</span>
                <span className="count-text">Curated {wishlist.length !== 1 ? 'Treasures' : 'Treasure'}</span>
              </p>
              <button onClick={() => navigate(-1)} className="back-btn-luxury">
                <FiArrowLeft />
                <span>Back</span>
              </button>
            </div>
            <div className="header-divider">
              <span className="divider-line"></span>
              <span className="divider-diamond">◆</span>
              <span className="divider-line"></span>
            </div>
          </div>

          <div className="products-grid-luxury">
            {wishlist.map((product, index) => {
              if (!product || !product._id) return null;
              const isHovered = hoveredId === product._id;
              const isRemoving = removingId === product._id;

              return (
                <div
                  className={`wishlist-item-luxury ${isRemoving ? 'removing' : ''}`}
                  key={product._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="item-glow-effect"></div>
                  <ProductCard product={product} />

                  <div className="luxury-actions">
                    <button
                      className={`cart-btn-luxury ${addingToCartId === product._id ? 'loading' : ''}`}
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingToCartId === product._id}
                    >
                      <span className="btn-content">
                        <FiShoppingBag className="btn-icon" />
                        <span className="btn-text">
                          {addingToCartId === product._id ? 'Adding...' : 'Add to Cart'}
                        </span>
                      </span>
                      <span className="btn-glow"></span>
                    </button>

                    <button
                      className={`remove-btn-luxury ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleRemove(product._id)}
                      disabled={removingId === product._id}
                    >
                      <FiTrash2 className="remove-icon" />
                      <span className="remove-text">Remove</span>
                    </button>
                  </div>

                  <div className="item-corner corner-tl">⟡</div>
                  <div className="item-corner corner-tr">⟡</div>
                  <div className="item-corner corner-bl">⟡</div>
                  <div className="item-corner corner-br">⟡</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;