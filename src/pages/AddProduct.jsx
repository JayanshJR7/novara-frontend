import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, categoriesAPI } from '../services/api';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AddProduct.css';

const AddProduct = () => {
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
    silverWeight: '',
    grossWeight: '',
    makingCharge: '0',
    weightUnit: 'grams'
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // NOW check admin status with useEffect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
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

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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

    if (!imageFiles.length) {
      setError('Please upload at least one product image');
      return false;
    }
    return true;
  };

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

      if (formData.silverWeight || formData.grossWeight) {
        formDataToSend.append('weight[silverWeight]', formData.silverWeight ? parseFloat(formData.silverWeight).toFixed(3) : '0.000');
        formDataToSend.append('weight[grossWeight]', formData.grossWeight ? parseFloat(formData.grossWeight).toFixed(3) : '0.000');
        formDataToSend.append('weight[unit]', formData.weightUnit);
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

  return (
    <div className="add-product-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h1>Add New Product</h1>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          {/* Image Upload */}
          <div className="form-section">
            <h3>Product Images * (1-5 images)</h3>
            <div className="image-upload-section">
              {imagePreviews.length < 5 && (
                <label className="image-upload-label">
                  <FiUpload />
                  <span>Click to upload images</span>
                  <small>JPG, PNG, GIF or WEBP (Max 5MB each, up to 5 images)</small>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}

              {imagePreviews.length > 0 && (
                <div className="image-previews-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                      {index === 0 && <span className="primary-badge">Primary</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  className='code-input'
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
          </div>

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

          <div className="form-section">
            <h3>Weight Specifications</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Net Weight (Silver)</label>
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
                <small className="field-hint">Pure silver weight excluding stones/gems</small>
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
                <small className="field-hint">Total weight including all components</small>
              </div>
            </div>

            <div className="weight-info-note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p>
                <strong>Note:</strong> Net Weight is the pure silver content, while Gross Weight includes stones,
                gems, and other materials. Leave blank if not applicable.
              </p>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="form-section">
            <h3>Pricing Information</h3>

            <div style={{
              background: formData.silverWeight > 0 ? '#e3f2fd' : '#e8f5e9',
              border: `2px solid ${formData.silverWeight > 0 ? '#1976d2' : '#2e7d32'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: formData.silverWeight > 0 ? '#1976d2' : '#2e7d32'
              }}>
                {formData.silverWeight > 0
                  ? '🔄 Auto-Pricing: Based on live silver rates'
                  : '✏️ Manual Pricing: Fixed price with discount'}
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
                  placeholder="10000.000"
                  min="0"
                  step="0.001"
                  required
                />
                <small className="field-hint">
                  {formData.silverWeight > 0
                    ? 'Base material/crafting cost (excluding silver value)'
                    : 'Full product price before discount'}
                </small>
              </div>

              {formData.silverWeight > 0 && (
                <div className="form-group">
                  <label>Making Charge (₹)</label>
                  <input
                    type="number"
                    name="makingCharge"
                    value={formData.makingCharge}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.001"
                  />
                  <small className="field-hint">
                    Additional crafting/labor charges
                  </small>
                </div>
              )}
            </div>

            <div className="pricing-note">
              {formData.silverWeight > 0 ? (
                <>
                  <p style={{ color: '#1976d2', fontWeight: '600', marginBottom: '10px' }}>
                    🔄 AUTO-PRICING MODE ENABLED
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    Final Price = Base Price + (Silver Weight × Current Silver Price) + Making Charge
                    <br />
                    <br />
                    <strong>Note:</strong> The final price will be calculated automatically based on the current silver market price.
                    Price updates twice daily (9 AM & 6 PM IST) via Gold API.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '10px' }}>
                    ✏️ MANUAL PRICING MODE
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    Final Price (after 10% discount) = ₹{formData.basePrice ? (formData.basePrice * 0.9).toFixed(3) : '0.000'}
                    <br />
                    <br />
                    <strong>Note:</strong> Since no silver weight is provided, this product uses manual pricing with a fixed 10% discount.
                    You can update the base price anytime from the admin panel.
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || loadingCategories}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Adding Product...
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </form>
      </div >
    </div >
  );
};

export default AddProduct;