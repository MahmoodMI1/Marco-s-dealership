import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../repo/ListingsRepo.js';
import InventoryLayout from '../components/InventoryLayout.jsx';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="system-ui" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = getListingById(id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorIndexes, setErrorIndexes] = useState(new Set());

  if (!listing) {
    return (
      <InventoryLayout>
        <div className="inv-detail-container">
          <div className="inv-detail-not-found">
            <h1>Listing not found</h1>
            <p>The vehicle you're looking for doesn't exist or has been removed.</p>
            <Link to="/inventory" className="inv-detail-btn">← Back to Inventory</Link>
          </div>
        </div>
      </InventoryLayout>
    );
  }

  const displayTitle = `${listing.year} ${listing.make} ${listing.model}`;
  const fullTitle = listing.trim ? `${displayTitle} ${listing.trim}` : displayTitle;
  
  // Images array with fallback
  const images = listing.images?.length ? listing.images : [PLACEHOLDER_IMAGE];
  const hasMultipleImages = images.length > 1;

  // Handle image load error
  const handleImageError = (index) => {
    setErrorIndexes((prev) => new Set(prev).add(index));
  };

  // Get image src with fallback for broken images
  const getImageSrc = (index) => {
    return errorIndexes.has(index) ? PLACEHOLDER_IMAGE : images[index];
  };

  // Keyboard navigation for thumbnails
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
    }
  };

  // Build specs array
  const isAdminSpecs = Array.isArray(listing.specs);
  const specsArray = isAdminSpecs
    ? listing.specs.filter(s => s.label && s.value != null && s.value !== '')
    : listing.specs
      ? Object.entries(listing.specs).map(([label, value]) => ({ label, value })).filter(s => s.value)
      : [];

  const hasBadges = listing.badges && listing.badges.length > 0;
  const hasDescription = Boolean(listing.description);
  const hasSpecs = specsArray.length > 0;

  return (
    <InventoryLayout>
      <div className="inv-detail-container">
        <Link to="/inventory" className="inv-detail-back">← Back to Inventory</Link>

        <div className="inv-detail-grid">
          {/* Main Column */}
          <div className="inv-detail-main">
            {/* Image Gallery */}
            <div className="inv-gallery">
              <div className="inv-gallery__main">
                <img
                  src={getImageSrc(selectedIndex)}
                  alt={`${fullTitle} - Photo ${selectedIndex + 1}`}
                  onError={() => handleImageError(selectedIndex)}
                />
              </div>
              
              {hasMultipleImages && (
                <div
                  className="inv-gallery__thumbs"
                  role="group"
                  aria-label="Image gallery"
                  onKeyDown={handleKeyDown}
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`inv-thumb ${index === selectedIndex ? 'is-active' : ''}`}
                      onClick={() => setSelectedIndex(index)}
                      aria-label={`View photo ${index + 1} of ${images.length}`}
                      aria-pressed={index === selectedIndex}
                    >
                      <img
                        src={errorIndexes.has(index) ? PLACEHOLDER_IMAGE : img}
                        alt=""
                        onError={() => handleImageError(index)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div className="inv-detail-card">
              <h1 className="inv-detail-title">{fullTitle}</h1>
              {hasBadges && (
                <div className="inv-detail-badges">
                  {listing.badges.map((badge) => (
                    <span key={badge} className="inv-detail-badge">{badge}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {hasDescription && (
              <div className="inv-detail-card">
                <h2 className="inv-detail-section-title">Description</h2>
                <p className="inv-detail-description">{listing.description}</p>
              </div>
            )}

            {/* Specs */}
            {hasSpecs && (
              <div className="inv-detail-card">
                <h2 className="inv-detail-section-title">Specifications</h2>
                <dl className="inv-detail-specs">
                  {specsArray.map((spec) => (
                    <div key={spec.label} className="inv-detail-spec-row">
                      <dt className="inv-detail-spec-label">{spec.label}</dt>
                      <dd className="inv-detail-spec-value">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="inv-detail-side">
            <div className="inv-detail-card inv-detail-price-card">
              <p className="inv-detail-price">
                {listing.price ? `$${listing.price.toLocaleString()}` : 'Contact for price'}
              </p>
              {listing.mileage != null && (
                <p className="inv-detail-mileage">{listing.mileage.toLocaleString()} miles</p>
              )}
              {listing.location && (
                <p className="inv-detail-location">📍 {listing.location}</p>
              )}
              <div className="inv-detail-actions">
                <a href="tel:+15551234567" className="inv-detail-btn inv-detail-btn-primary">
                  Contact Information
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </InventoryLayout>
  );
}