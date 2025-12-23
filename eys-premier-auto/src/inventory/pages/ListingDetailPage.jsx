import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../repo/ListingsRepo.js';
import InventoryLayout from '../components/InventoryLayout.jsx';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="system-ui" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';

const SWIPE_THRESHOLD = 40;

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = getListingById(id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorIndexes, setErrorIndexes] = useState(new Set());
  
  // Swipe tracking
  const swipeRef = useRef({ startX: 0, startY: 0, swiping: false });

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

  // Navigation helpers
  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex < images.length - 1;

  const goToPrev = () => {
    if (canGoPrev) setSelectedIndex((prev) => prev - 1);
  };

  const goToNext = () => {
    if (canGoNext) setSelectedIndex((prev) => prev + 1);
  };

  // Handle image load error
  const handleImageError = (index) => {
    setErrorIndexes((prev) => new Set(prev).add(index));
  };

  // Get image src with fallback for broken images
  const getImageSrc = (index) => {
    return errorIndexes.has(index) ? PLACEHOLDER_IMAGE : images[index];
  };

  // Keyboard navigation for main gallery
  const handleGalleryKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // Keyboard navigation for thumbnails
  const handleThumbsKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToNext();
    }
  };

  // Swipe handlers (Pointer Events)
  const handlePointerDown = (e) => {
    if (!hasMultipleImages) return;
    swipeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      swiping: true,
    };
  };

  const handlePointerMove = (e) => {
    // We don't need to track move, just need start position
  };

  const handlePointerUp = (e) => {
    if (!swipeRef.current.swiping || !hasMultipleImages) return;
    
    const deltaX = e.clientX - swipeRef.current.startX;
    const deltaY = e.clientY - swipeRef.current.startY;
    
    // Only trigger if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    
    swipeRef.current.swiping = false;
  };

  const handlePointerCancel = () => {
    swipeRef.current.swiping = false;
  };

  // Touch fallback (for older browsers)
  const handleTouchStart = (e) => {
    if (!hasMultipleImages || e.touches.length !== 1) return;
    const touch = e.touches[0];
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      swiping: true,
    };
  };

  const handleTouchEnd = (e) => {
    if (!swipeRef.current.swiping || !hasMultipleImages) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeRef.current.startX;
    const deltaY = touch.clientY - swipeRef.current.startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    
    swipeRef.current.swiping = false;
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
            <div
              className="inv-gallery"
              onKeyDown={handleGalleryKeyDown}
              tabIndex={hasMultipleImages ? 0 : undefined}
              role={hasMultipleImages ? "region" : undefined}
              aria-label={hasMultipleImages ? "Image gallery, use arrow keys to navigate" : undefined}
            >
              <div
                className="inv-gallery__main"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: hasMultipleImages ? 'pan-y pinch-zoom' : undefined }}
              >
                <img
                  src={getImageSrc(selectedIndex)}
                  alt={`${fullTitle} - Photo ${selectedIndex + 1} of ${images.length}`}
                  onError={() => handleImageError(selectedIndex)}
                  draggable={false}
                />

                {/* Arrow Navigation */}
                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      className="inv-gallery__nav inv-gallery__nav--prev"
                      onClick={goToPrev}
                      disabled={!canGoPrev}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="inv-gallery__nav inv-gallery__nav--next"
                      onClick={goToNext}
                      disabled={!canGoNext}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="inv-gallery__counter">
                    {selectedIndex + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {hasMultipleImages && (
                <div
                  className="inv-gallery__thumbs"
                  role="group"
                  aria-label="Thumbnail navigation"
                  onKeyDown={handleThumbsKeyDown}
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
                        draggable={false}
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