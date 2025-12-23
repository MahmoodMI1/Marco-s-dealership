import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getListingById,
  createListing,
  updateListing,
} from '../../inventory/repo/ListingsRepo.js';
import AdminLayout from '../components/AdminLayout.jsx';

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

export default function AdminListingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  // Load existing listing for edit mode
  useEffect(() => {
    if (!isEdit) return;
    const listing = getListingById(id);
    if (!listing) {
      setNotFound(true);
      return;
    }
    setForm({
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
    });
    // Convert specs object to array of { key, value }
    if (listing.specs && typeof listing.specs === 'object') {
      setSpecs(Object.entries(listing.specs).map(([key, value]) => ({ key, value })));
    }
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

  const validate = () => {
    const newErrors = {};
    if (!form.year || isNaN(Number(form.year))) newErrors.year = 'Valid year required';
    if (!form.make.trim()) newErrors.make = 'Make required';
    if (!form.model.trim()) newErrors.model = 'Model required';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = 'Valid price required';
    if (!form.mileage || isNaN(Number(form.mileage))) newErrors.mileage = 'Valid mileage required';
    if (!form.location.trim()) newErrors.location = 'Location required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build payload
    const payload = {
      year: Number(form.year),
      make: form.make.trim(),
      model: form.model.trim(),
      trim: form.trim.trim() || undefined,
      price: Number(form.price),
      mileage: Number(form.mileage),
      location: form.location.trim(),
      badges: form.badges
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
      images: form.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
      description: form.description.trim() || undefined,
      specs: specs.reduce((acc, { key, value }) => {
        const k = key.trim();
        if (k) acc[k] = value.trim();
        return acc;
      }, {}),
    };

    if (isEdit) {
      updateListing(id, payload);
    } else {
      createListing(payload);
    }

    navigate('/admin/listings');
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

  return (
    <AdminLayout>
      <Link to="/admin/listings" className="admin-back">← Back to Listings</Link>
      <div className="admin-page-header" style={{ marginBottom: 'var(--admin-space-5)' }}>
        <h1 className="admin-page-title">{isEdit ? 'Edit Listing' : 'New Listing'}</h1>
        <p className="admin-page-subtitle">
          {isEdit ? `Editing ID: ${id}` : 'Create a new vehicle listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          {/* Left Column */}
          <div className="admin-form-col">
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Images</h3>
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

          {/* Right Column */}
          <div className="admin-form-col">
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Vehicle Info</h3>
              
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
          <Link to="/admin/listings" className="admin-btn">
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}