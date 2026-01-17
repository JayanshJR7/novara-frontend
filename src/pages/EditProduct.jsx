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
    netWeight: '',
    grossWeight: '',
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
        netWeight: product.weight?.netWeight || '',
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

    if (formData.netWeight && parseFloat(formData.netWeight) < 0) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('itemname', formData.itemname.trim());
      formDataToSend.append('itemCode', formData.itemCode.trim().toUpperCase());
      formDataToSend.append('basePrice', formData.basePrice.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('deliveryType', formData.deliveryType);
      formDataToSend.append('inStock', formData.inStock);

      // Add weight data
      if (formData.netWeight || formData.grossWeight) {
        formDataToSend.append('weight[netWeight]', formData.netWeight ? parseFloat(formData.netWeight) : 0);
        formDataToSend.append('weight[grossWeight]', formData.grossWeight ? parseFloat(formData.grossWeight) : 0);
        formDataToSend.append('weight[unit]', formData.weightUnit);
      }

      // Only append new images if user selected any
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formDataToSend.append('itemImages', file);
        });
      }

      await productsAPI.updateProduct(id, formDataToSend);

      toast.success('✅ Product updated successfully!');
      navigate('/admin');

    } catch (err) {
      console.error('Update product error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
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