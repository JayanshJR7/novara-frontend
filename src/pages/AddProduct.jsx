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
    netWeight: '',
    grossWeight: '',
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

    if (formData.netWeight && parseFloat(formData.netWeight) < 0) {
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
      formDataToSend.append('basePrice', formData.basePrice.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('deliveryType', formData.deliveryType);

      if (formData.netWeight || formData.grossWeight) {
        const weightData = {
          netWeight: formData.netWeight ? parseFloat(formData.netWeight) : 0,
          grossWeight: formData.grossWeight ? parseFloat(formData.grossWeight) : 0,
          unit: formData.weightUnit
        };
        if (formData.netWeight || formData.grossWeight) {
          formDataToSend.append('weight[netWeight]', formData.netWeight ? parseFloat(formData.netWeight) : 0);
          formDataToSend.append('weight[grossWeight]', formData.grossWeight ? parseFloat(formData.grossWeight) : 0);
          formDataToSend.append('weight[unit]', formData.weightUnit);
        }
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
                    name="netWeight"
                    value={formData.netWeight}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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

            <div className="form-row">
              <div className="form-group">
                <label>Product Price (₹) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="10000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="pricing-note">
              <p>💡 Final Price (after 10% discount) = ₹{formData.basePrice ? (formData.basePrice * 0.9).toFixed(2) : '0'}</p>
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
      </div>
    </div>
  );
};
export default AddProduct;