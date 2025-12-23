import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getListingById,
  createListing,
  updateListing,
} from '../../inventory/repo/ListingsRepo.js';
import AdminLayout from '../components/AdminLayout.jsx';

const currentYear = new Date().getFullYear();

const emptyForm = {
  year: '',
  make: '',
  model: '',
  trim: '',
  price: '',
  mileage: '',
  location: '',
  badges: '',
  images: '',
  description: '',
};

function serializeForm(form, specs) {
  return JSON.stringify({ form, specs });
}

export default function AdminListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState('');

  // Track dirty state
  const isDirty = useMemo(() => {
    return serializeForm(form, specs) !== initialSnapshot;
  }, [form, specs, initialSnapshot]);

  // Warn on browser close/refresh with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Load existing listing for edit mode
  useEffect(() => {
    if (!isEdit) {
      setInitialSnapshot(serializeForm(emptyForm, []));
      return;
    }
    const listing = getListingById(id);
    if (!listing) {
      setNotFound(true);
      return;
    }
    const loadedForm = {
      year: listing.year?.toString() || '',
      make: listing.make || '',
      model: listing.model || '',
      trim: listing.trim || '',
      price: listing.price?.toString() || '',
      mileage: listing.mileage?.toString() || '',
      location: listing.location || '',
      badges: listing.badges?.join(', ') || '',
      images: listing.images?.join('\n') || '',
      description: listing.description || '',
    };
    const loadedSpecs = listing.specs && typeof listing.specs === 'object'
      ? Object.entries(listing.specs).map(([key, value]) => ({ key, value }))
      : [];
    
    setForm(loadedForm);
    setSpecs(loadedSpecs);
    setInitialSnapshot(serializeForm(loadedForm, loadedSpecs));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSpecChange = (index, field, value) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSpec = () => {
    setSpecs((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  // Parse image URLs for preview
  const imageUrls = useMemo(() => {
    return form.images
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [form.images]);

  const validate = () => {
    const newErrors = {};
    const yearNum = Number(form.year);
    const priceNum = Number(form.price);
    const mileageNum = Number(form.mileage);

    // Year: 1900 to currentYear+1
    if (!form.year || isNaN(yearNum)) {
      newErrors.year = 'Year is required';
    } else if (yearNum < 1900 || yearNum > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }

    // Make/Model/Location: required, trimmed
    if (!form.make.trim()) newErrors.make = 'Make is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';

    // Price: required, >= 0
    if (!form.price || isNaN(priceNum)) {
      newErrors.price = 'Price is required';
    } else if (priceNum < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    // Mileage: required, >= 0
    if (!form.mileage || isNaN(mileageNum)) {
      newErrors.mileage = 'Mileage is required';
    } else if (mileageNum < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Normalize badges: split, trim, filter, dedupe
    const badgesArray = [...new Set(
      form.badges
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean)
    )];

    // Normalize images: split, trim, filter, dedupe
    const imagesArray = [...new Set(
      form.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean)
    )];

    const payload = {
      year: Number(form.year),
      make: form.make.trim(),
      model: form.model.trim(),
      trim: form.trim.trim() || undefined,
      price: Number(form.price),
      mileage: Number(form.mileage),
      location: form.location.trim(),
      badges: badgesArray.length > 0 ? badgesArray : undefined,
      images: imagesArray.length > 0 ? imagesArray : undefined,
      description: form.description.trim() || undefined,
      specs: specs.reduce((acc, { key, value }) => {
        const k = key.trim();
        if (k) acc[k] = value.trim();
        return acc;
      }, {}),
    };

    // Clear dirty state before navigation
    setInitialSnapshot(serializeForm(form, specs));

    if (isEdit) {
      updateListing(id, payload);
    } else {
      createListing(payload);
    }

    navigate('/admin/listings');
  };

  const handleCancel = (e) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) {
        e.preventDefault();
      }
    }
  };

  if (notFound) {
    return (
      <AdminLayout>
        <div className="admin-empty">
          <p className="admin-empty-text">Listing not found.</p>
          <Link to="/admin/listings" className="admin-btn">
            ← Back to Listings
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <AdminLayout>
      <Link to="/admin/listings" className="admin-back" onClick={handleCancel}>
        ← Back to Listings
      </Link>
      <div className="admin-page-header" style={{ marginBottom: 'var(--admin-space-5)' }}>
        <h1 className="admin-page-title">{isEdit ? 'Edit Listing' : 'New Listing'}</h1>
        <p className="admin-page-subtitle">
          {isEdit ? `Editing ID: ${id}` : 'Create a new vehicle listing'}
          {isDirty && <span className="admin-dirty-badge">Unsaved changes</span>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          {/* Left Column: Media */}
          <div className="admin-form-col">
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Media</h3>
              <div className="admin-field">
                <label htmlFor="images" className="admin-label">Image URLs (one per line)</label>
                <textarea
                  id="images"
                  name="images"
                  className="admin-textarea"
                  rows={4}
                  value={form.images}
                  onChange={handleChange}
                  placeholder="https://example.com/image1.jpg"
                />
              </div>
              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="admin-image-previews">
                  {imageUrls.map((url, i) => (
                    <ImagePreview key={i} src={url} />
                  ))}
                </div>
              )}
            </div>

            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Badges</h3>
              <div className="admin-field">
                <label htmlFor="badges" className="admin-label">Badges (comma-separated)</label>
                <input
                  type="text"
                  id="badges"
                  name="badges"
                  className="admin-input"
                  value={form.badges}
                  onChange={handleChange}
                  placeholder="Clean Title, One Owner, Low Miles"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Core Info */}
          <div className="admin-form-col">
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Core Info</h3>
              
              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="year" className="admin-label">Year *</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    className={`admin-input ${errors.year ? 'admin-input-error' : ''}`}
                    value={form.year}
                    onChange={handleChange}
                    placeholder="2021"
                    min="1900"
                    max={currentYear + 1}
                  />
                  {errors.year && <span className="admin-error">{errors.year}</span>}
                </div>
                <div className="admin-field">
                  <label htmlFor="make" className="admin-label">Make *</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    className={`admin-input ${errors.make ? 'admin-input-error' : ''}`}
                    value={form.make}
                    onChange={handleChange}
                    placeholder="Toyota"
                  />
                  {errors.make && <span className="admin-error">{errors.make}</span>}
                </div>
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="model" className="admin-label">Model *</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    className={`admin-input ${errors.model ? 'admin-input-error' : ''}`}
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Camry"
                  />
                  {errors.model && <span className="admin-error">{errors.model}</span>}
                </div>
                <div className="admin-field">
                  <label htmlFor="trim" className="admin-label">Trim</label>
                  <input
                    type="text"
                    id="trim"
                    name="trim"
                    className="admin-input"
                    value={form.trim}
                    onChange={handleChange}
                    placeholder="SE"
                  />
                </div>
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="price" className="admin-label">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className={`admin-input ${errors.price ? 'admin-input-error' : ''}`}
                    value={form.price}
                    onChange={handleChange}
                    placeholder="24500"
                    min="0"
                  />
                  {errors.price && <span className="admin-error">{errors.price}</span>}
                </div>
                <div className="admin-field">
                  <label htmlFor="mileage" className="admin-label">Mileage *</label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    className={`admin-input ${errors.mileage ? 'admin-input-error' : ''}`}
                    value={form.mileage}
                    onChange={handleChange}
                    placeholder="32000"
                    min="0"
                  />
                  {errors.mileage && <span className="admin-error">{errors.mileage}</span>}
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="location" className="admin-label">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`admin-input ${errors.location ? 'admin-input-error' : ''}`}
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Main Lot"
                />
                {errors.location && <span className="admin-error">{errors.location}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width: Specs */}
        <div className="admin-form-section">
          <div className="admin-form-section-header">
            <h3 className="admin-form-section-title">Specifications</h3>
            <button type="button" className="admin-btn admin-btn-small" onClick={addSpec}>
              + Add Spec
            </button>
          </div>
          {specs.length > 0 ? (
            <div className="admin-specs-list">
              {specs.map((spec, index) => (
                <div key={index} className="admin-spec-row">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Label (e.g., Engine)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Value (e.g., 2.5L 4-Cyl)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() => removeSpec(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted-text">No specifications added yet.</p>
          )}
        </div>

        {/* Full Width: Description */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Description</h3>
          <div className="admin-field">
            <textarea
              id="description"
              name="description"
              className="admin-textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed description of the vehicle..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            {isEdit ? 'Save Changes' : 'Create Listing'}
          </button>
          <Link to="/admin/listings" className="admin-btn" onClick={handleCancel}>
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}

// Image preview component with error fallback
function ImagePreview({ src }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <div className="admin-image-preview admin-image-preview-error">Invalid URL</div>;
  }

  return (
    <img
      src={src}
      alt="Preview"
      className="admin-image-preview"
      onError={() => setError(true)}
    />
  );
}