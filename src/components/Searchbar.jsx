import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import './SearchBar.css';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], categories: [], suggestions: [] });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const overlayRef = useRef(null);
    const searchBoxRef = useRef(null);
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    /* -------------------- Focus input when opened -------------------- */
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    /* -------------------- Lock body scroll when search is open -------------------- */
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('search-modal-open');
            // Also disable Lenis if it exists
            const lenisInstance = window.lenis;
            if (lenisInstance) {
                lenisInstance.stop();
            }
        } else {
            document.body.classList.remove('search-modal-open');
            // Re-enable Lenis
            const lenisInstance = window.lenis;
            if (lenisInstance) {
                lenisInstance.start();
            }
        }

        return () => {
            document.body.classList.remove('search-modal-open');
            const lenisInstance = window.lenis;
            if (lenisInstance) {
                lenisInstance.start();
            }
        };
    }, [isOpen]);

    /* -------------------- GSAP OPEN ANIMATION -------------------- */
    useEffect(() => {
        if (!isOpen) return;

        if (overlayRef.current && searchBoxRef.current) {
            gsap.set([overlayRef.current, searchBoxRef.current], { clearProps: 'all' });

            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );

            gsap.fromTo(
                searchBoxRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
            );
        }
    }, [isOpen]);

    /* -------------------- SEARCH DEBOUNCE -------------------- */
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({ products: [], categories: [], suggestions: [] });
            return;
        }

        clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(searchTimeoutRef.current);
    }, [query]);

    const performSearch = async (searchQuery) => {
        try {
            setLoading(true);
            const response = await productsAPI.search(searchQuery);
            setResults(response?.data || response);
        } catch (error) {
            console.error('Search failed:', error);
            setResults({ products: [], categories: [], suggestions: [] });
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- OPEN / CLOSE -------------------- */
    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        if (!overlayRef.current || !searchBoxRef.current) {
            setIsOpen(false);
            return;
        }

        gsap.to(searchBoxRef.current, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });

        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setIsOpen(false);
                setQuery('');
                setResults({ products: [], categories: [], suggestions: [] });
            }
        });
    };

    /* -------------------- NAVIGATION -------------------- */
    const handleCategoryClick = (category) => {
        handleClose();
        navigate(`/products?category=${category}`);
    };

    const handleProductClick = (productId) => {
        handleClose();
        navigate(`/product/${productId}`);
    };

    const handleViewAll = () => {
        handleClose();
        navigate(`/products?search=${encodeURIComponent(query)}`);
    };

    return (
        <>
            <button className="search-trigger" onClick={handleOpen} aria-label="Open search">
                <FiSearch />
            </button>

            {isOpen && (
                <div className="search-overlay" ref={overlayRef} onClick={handleClose}>
                    <div
                        className="search-container"
                        ref={searchBoxRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="search-input-wrapper">
                            <FiSearch className="search-input-icon" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for bangles, rings, necklaces..."
                                className="search-input"
                            />
                            <button
                                className="search-close"
                                onClick={handleClose}
                                aria-label="Close search"
                            >
                                <FiX />
                            </button>
                        </div>

                        {query.trim().length >= 2 && (
                            <div className="search-results" data-lenis-prevent>
                                {loading && (
                                    <div className="search-loading">
                                        <div className="spinner"></div>
                                        <p>Searching...</p>
                                    </div>
                                )}

                                {!loading &&
                                    results.products?.length === 0 &&
                                    results.suggestions?.length === 0 && (
                                        <div className="search-empty">
                                            <p>No results found for "{query}"</p>
                                            <span>
                                                Try searching for categories like "bangles", "rings", or
                                                "necklaces"
                                            </span>
                                        </div>
                                    )}

                                {!loading && results.suggestions?.length > 0 && (
                                    <div className="search-section">
                                        <h3>Categories</h3>
                                        <div className="category-chips">
                                            {results.suggestions.map((category, index) => (
                                                <button
                                                    key={index}
                                                    className="category-chip"
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    {category}
                                                    <FiArrowRight />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!loading && results.products?.length > 0 && (
                                    <>
                                        <div className="search-section">
                                            <h3>Products ({results.products.length})</h3>
                                            <div className="products-grid-search">
                                                {results.products.slice(0, 6).map((product) => (
                                                    <div
                                                        key={product._id}
                                                        className="product-search-item"
                                                        onClick={() => handleProductClick(product._id)}
                                                    >
                                                        <img
                                                            src={product.itemImages[0]}
                                                            alt={product.itemname}
                                                        />
                                                        <div className="product-search-info">
                                                            <p className="product-search-name">
                                                                {product.itemname}
                                                            </p>
                                                            <p className="product-search-code">
                                                                {product.itemCode}
                                                            </p>
                                                            <p className="product-search-price">
                                                                ₹{product.finalPrice?.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {results.products.length > 6 && (
                                            <button
                                                className="view-all-btn"
                                                onClick={handleViewAll}
                                            >
                                                View All piece of Art
                                                <FiArrowRight />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {query.trim().length === 0 && (
                            <div className="search-suggestions">
                                <h3>Popular Searches</h3>
                                <div className="suggestion-chips">
                                    {['Necklace', 'Pendant', 'Kada', 'Earrings', 'Rings'].map(
                                        (term) => (
                                            <button
                                                key={term}
                                                className="suggestion-chip"
                                                onClick={() => setQuery(term)}
                                            >
                                                {term}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBar;