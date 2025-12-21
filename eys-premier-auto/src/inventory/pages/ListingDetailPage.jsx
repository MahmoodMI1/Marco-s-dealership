import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../repo/ListingsRepo.js';
import InventoryLayout from '../components/InventoryLayout.jsx';

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = getListingById(id);

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
  
  const hasImages = listing.images && listing.images.length > 0;
  const displayImage = hasImages ? listing.images[0] : null;

  // Build specs array, filter out falsy values
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
          {/* Main Column: Image + text sections */}
          <div className="inv-detail-main">
            {/* Image or Placeholder */}
            <div className="inv-detail-image-wrapper">
              {displayImage ? (
                <img src={displayImage} alt={fullTitle} className="inv-detail-image" />
              ) : (
                <div className="inv-detail-image-placeholder">
                  <span>No Image Available</span>
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

            {/* Description (conditional) */}
            {hasDescription && (
              <div className="inv-detail-card">
                <h2 className="inv-detail-section-title">Description</h2>
                <p className="inv-detail-description">{listing.description}</p>
              </div>
            )}

            {/* Specs (conditional) */}
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

          {/* Sidebar: Price + CTA */}
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