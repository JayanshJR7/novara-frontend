import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, categoriesAPI } from '../services/api';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AddProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // ALL HOOKS FIRST
  const [formData, setFormData] = useState({
    itemname: '',
    itemCode: '',
    basePrice: '',
    category: '',
    description: '',
    deliveryType: 'ready-to-ship',
    inStock: true,
    silverWeight: '',
    netWeight: '',
    grossWeight: '',
    makingChargeRate: '0',
    weightUnit: 'grams'
  });

  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check admin status with useEffect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoriesAPI.getActive();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(id);
      const product = data.product;

      setFormData({
        itemname: product.itemname,
        itemCode: product.itemCode,
        basePrice: product.basePrice,
        category: product.category,
        description: product.description || '',
        deliveryType: product.deliveryType || 'ready-to-ship',
        inStock: product.inStock !== undefined ? product.inStock : true,
        silverWeight: product.weight?.silverWeight || '',
        grossWeight: product.weight?.grossWeight || '',
        weightUnit: product.weight?.unit || 'grams'
      });

      // Handle both single itemImage and multiple itemImages
      const images = product.itemImages || [product.itemImage];
      setExistingImages(images.filter(img => img));

    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product');
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + imageFiles.length + files.length;

    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image must be under 5MB');
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [
      ...prev,
      ...validFiles.map(file => URL.createObjectURL(file))
    ]);
    setError('');
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.itemname.trim()) {
      setError('Please enter product name');
      return false;
    }

    if (!formData.itemCode.trim()) {
      setError('Please enter product code');
      return false;
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      setError('Please enter a valid base price');
      return false;
    }

    if (!formData.category) {
      setError('Please select a category');
      return false;
    }

    if (formData.silverWeight && parseFloat(formData.silverWeight) < 0) {
      setError('Net weight cannot be negative');
      return false;
    }

    if (formData.grossWeight && parseFloat(formData.grossWeight) < 0) {
      setError('Gross weight cannot be negative');
      return false;
    }

    if (existingImages.length === 0 && imageFiles.length === 0) {
      setError('Please keep at least one product image');
      return false;
    }

    return true;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setSubmitting(true);

  //   try {
  //     const formDataToSend = new FormData();

  //     formDataToSend.append('itemname', formData.itemname.trim());
  //     formDataToSend.append('itemCode', formData.itemCode.trim().toUpperCase());
  //     formDataToSend.append('basePrice', parseFloat(formData.basePrice).toFixed(3));
  //     formDataToSend.append('category', formData.category);
  //     formDataToSend.append('description', formData.description.trim());
  //     formDataToSend.append('deliveryType', formData.deliveryType);
  //     formDataToSend.append('inStock', formData.inStock);

  //     // Add weight data with 3 decimal precision
  //     if (formData.silverWeight || formData.grossWeight) {
  //       formDataToSend.append('weight[silverWeight]', formData.silverWeight ? parseFloat(formData.silverWeight).toFixed(3) : '0.000');
  //       formDataToSend.append('weight[grossWeight]', formData.grossWeight ? parseFloat(formData.grossWeight).toFixed(3) : '0.000');
  //       formDataToSend.append('weight[unit]', formData.weightUnit);
  //     }

  //     // Only append new images if user selected any
  //     if (imageFiles.length > 0) {
  //       imageFiles.forEach(file => {
  //         formDataToSend.append('itemImages', file);
  //       });
  //     }

  //     await productsAPI.updateProduct(id, formDataToSend);

  //     toast.success('✅ Product updated successfully!');
  //     navigate('/admin');

  //   } catch (err) {
  //     console.error('Update product error:', err);
  //     const errorMessage = err.response?.data?.message || 'Failed to update product';
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('itemname', formData.itemname.trim());
      formDataToSend.append('itemCode', formData.itemCode.trim().toUpperCase());
      formDataToSend.append('basePrice', parseFloat(formData.basePrice).toFixed(3));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('deliveryType', formData.deliveryType);

      // ✅ UPDATED: Include all three weights
      if (formData.silverWeight || formData.netWeight || formData.grossWeight) {
        formDataToSend.append('weight[silverWeight]', formData.silverWeight ? parseFloat(formData.silverWeight).toFixed(3) : '0.000');
        formDataToSend.append('weight[netWeight]', formData.netWeight ? parseFloat(formData.netWeight).toFixed(3) : '0.000');
        formDataToSend.append('weight[grossWeight]', formData.grossWeight ? parseFloat(formData.grossWeight).toFixed(3) : '0.000');
        formDataToSend.append('weight[unit]', formData.weightUnit);
      }

      // ✅ CHANGED: Send makingChargeRate instead of makingCharge
      if (formData.makingChargeRate) {
        formDataToSend.append('makingChargeRate', parseFloat(formData.makingChargeRate).toFixed(3));
      }

      imageFiles.forEach(file => {
        formDataToSend.append('itemImages', file);
      });

      await productsAPI.createProduct(formDataToSend);
      toast.success('✅ Product added successfully!');
      navigate('/admin');

    } catch (err) {
      console.error('Add product error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="add-product-page">
        <div className="container">
          <div className="loading-state">
            <div className="elegant-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <FiArrowLeft /> Back to Dashboard
        </button>

        <h1>Edit Product</h1>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">

          {/* Image Upload Section */}
          <div className="form-section">
            <h3>Product Images * (1-5 images)</h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="existing-images-section">
                <label>Current Images:</label>
                <div className="image-previews-grid">
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="image-preview-item">
                      <img src={img} alt={`Current ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeExistingImage(index)}
                      >
                        ×
                      </button>
                      {index === 0 && <span className="primary-badge">Primary</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {imagePreviews.length > 0 && (
              <div className="new-images-section">
                <label>New Images (will replace all current images):</label>
                <div className="image-previews-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="image-preview-item">
                      <img src={preview} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeNewImage(index)}
                      >
                        ×
                      </button>
                      {index === 0 && <span className="primary-badge">Primary</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {(existingImages.length + imageFiles.length) < 5 && (
              <div className="image-upload-section">
                <label className="image-upload-label">
                  <FiUpload />
                  <span>Click to upload new images</span>
                  <small>JPG, PNG, GIF or WEBP (Max 5MB each, up to 5 images total)</small>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="itemname"
                  value={formData.itemname}
                  onChange={handleChange}
                  placeholder="e.g., Classic Silver Ring"
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Code *</label>
                <input
                  type="text"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  placeholder="e.g., NJ-RING-001"
                  className="code-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category *</label>
              {loadingCategories ? (
                <select disabled>
                  <option>Loading categories...</option>
                </select>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                <span>In Stock</span>
              </label>
            </div>
          </div>

          {/* Delivery Type */}
          <div className="form-group">
            <label>Delivery Type *</label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              required
            >
              <option value="ready-to-ship">Ready to Ship (5-7 days)</option>
              <option value="made-to-order">Made to Order (20-25 days)</option>
            </select>
          </div>

          {/* Weight Specifications */}
          <div className="form-section">
            <h3>Weight Specifications</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Silver Weight (Pure Silver Content)</label>
                <div className="weight-input-group">
                  <input
                    type="number"
                    name="silverWeight"
                    value={formData.silverWeight}
                    onChange={handleChange}
                    placeholder="0.000"
                    min="0"
                    step="0.001"
                  />
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleChange}
                    className="unit-select"
                  >
                    <option value="grams">grams</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
                <small className="field-hint">Pure silver content weight</small>
              </div>

              <div className="form-group">
                <label>Net Weight * (Used for Pricing)</label>
                <div className="weight-input-group">
                  <input
                    type="number"
                    name="netWeight"
                    value={formData.netWeight}
                    onChange={handleChange}
                    placeholder="0.000"
                    min="0"
                    step="0.001"
                  />
                  <span className="unit-display">{formData.weightUnit}</span>
                </div>
                <small className="field-hint" style={{ color: '#d4af37', fontWeight: 600 }}>
                  ⚠️ IMPORTANT: Price calculated using this weight
                </small>
              </div>
            </div>

            <div className="form-group">
              <label>Gross Weight (Total)</label>
              <div className="weight-input-group">
                <input
                  type="number"
                  name="grossWeight"
                  value={formData.grossWeight}
                  onChange={handleChange}
                  placeholder="0.000"
                  min="0"
                  step="0.001"
                />
                <span className="unit-display">{formData.weightUnit}</span>
              </div>
              <small className="field-hint">Total weight including all components (for display only)</small>
            </div>

            <div className="weight-info-note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p>
                <strong>Note:</strong><br />
                • <strong>Silver Weight:</strong> Pure silver content<br />
                • <strong>Net Weight:</strong> Weight used for price calculation<br />
                • <strong>Gross Weight:</strong> Total weight including stones/gems (display only)
              </p>
            </div>
          </div>

          {/* Pricing Information */}
          {/* <div className="form-section">
            <h3>Pricing Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Product Price (₹) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="10000.000"
                  min="0"
                  step="0.001"
                  required
                />
              </div>
            </div>

            <div className="pricing-note">
              <p>💡 Final Price (after 10% discount) = ₹{formData.basePrice ? (formData.basePrice * 0.9).toFixed(3) : '0.000'}</p>
            </div>
          </div> */}
          <div className="form-section">
            <h3>Pricing Information</h3>

            <div style={{
              background: formData.netWeight > 0 ? '#e3f2fd' : '#e8f5e9',
              border: `2px solid ${formData.netWeight > 0 ? '#1976d2' : '#2e7d32'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: formData.netWeight > 0 ? '#1976d2' : '#2e7d32'
              }}>
                {formData.netWeight > 0
                  ? '🔄 Auto-Pricing: Based on net weight × silver rate'
                  : '✏️ Manual Pricing: Fixed price with 10% discount'}
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Base Price (₹) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="737.000"
                  min="0"
                  step="0.001"
                  required
                />
                <small className="field-hint">
                  {formData.netWeight > 0
                    ? 'Base material/crafting cost (excluding silver value)'
                    : 'Full product price before 10% discount'}
                </small>
              </div>

              {formData.netWeight > 0 && (
                <div className="form-group">
                  <label>Making Charge Rate (₹/gram) *</label>
                  <input
                    type="number"
                    name="makingChargeRate"
                    value={formData.makingChargeRate}
                    onChange={handleChange}
                    placeholder="560"
                    min="0"
                    step="0.001"
                  />
                  <small className="field-hint">
                    Making charge per gram (e.g., ₹560/gram)
                  </small>
                </div>
              )}
            </div>

            <div className="pricing-note">
              {formData.netWeight > 0 ? (
                <>
                  <p style={{ color: '#1976d2', fontWeight: '600', marginBottom: '10px' }}>
                    🔄 AUTO-PRICING MODE ENABLED
                  </p>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '10px', fontWeight: '600' }}>Formula:</p>
                    <code style={{ display: 'block', background: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                      1. Silver Cost = Net Weight × Silver Price/gram<br />
                      2. Making Charges = Making Rate × Net Weight<br />
                      3. Total = Base Price + Silver Cost + Making Charges<br />
                      4. Final Price = Total × 0.9 (10% discount)
                    </code>

                    {formData.basePrice && formData.netWeight && formData.makingChargeRate && (
                      <div style={{ marginTop: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
                        <p style={{ margin: '5px 0', color: '#1976d2' }}><strong>Example Calculation (Silver @ ₹310/g):</strong></p>
                        <p style={{ margin: '5px 0' }}>Base Price: ₹{parseFloat(formData.basePrice).toFixed(2)}</p>
                        <p style={{ margin: '5px 0' }}>Silver Cost: {formData.netWeight} × 310 = ₹{(parseFloat(formData.netWeight) * 310).toFixed(2)}</p>
                        <p style={{ margin: '5px 0' }}>Making: {formData.makingChargeRate} × {formData.netWeight} = ₹{(parseFloat(formData.makingChargeRate) * parseFloat(formData.netWeight)).toFixed(2)}</p>
                        <p style={{ margin: '5px 0' }}>Total: ₹{(parseFloat(formData.basePrice) + (parseFloat(formData.netWeight) * 310) + (parseFloat(formData.makingChargeRate) * parseFloat(formData.netWeight))).toFixed(2)}</p>
                        <p style={{ margin: '5px 0', fontWeight: '700', color: '#1976d2' }}>
                          Final Price (10% off): ₹{((parseFloat(formData.basePrice) + (parseFloat(formData.netWeight) * 310) + (parseFloat(formData.makingChargeRate) * parseFloat(formData.netWeight))) * 0.9).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <p style={{ marginTop: '10px' }}><strong>Note:</strong> Price updates automatically twice daily (9 AM & 6 PM IST) based on current silver rates from Gold API.</p>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '10px' }}>
                    ✏️ MANUAL PRICING MODE
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    Final Price (after 10% discount) = ₹{formData.basePrice ? (formData.basePrice * 0.9).toFixed(2) : '0.00'}
                    <br />
                    <br />
                    <strong>Note:</strong> Since net weight is not provided, this product uses manual pricing with a fixed 10% discount.
                    The price will NOT change with silver rate fluctuations.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting || loadingCategories}
          >
            {submitting ? (
              <>
                <span className="spinner-small"></span>
                Updating Product...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;