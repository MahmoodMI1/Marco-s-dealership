import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllListings, deleteListing } from '../../inventory/repo/ListingsRepo.js';
import AdminLayout from '../components/AdminLayout.jsx';

export default function AdminListingsPage() {
  const [listings, setListings] = useState(() => getAllListings());
  const [toast, setToast] = useState(null);

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const formatTitle = (listing) => {
    const base = `${listing.year} ${listing.make} ${listing.model}`;
    return listing.trim ? `${base} ${listing.trim}` : base;
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) return;
    deleteListing(id);
    setListings(getAllListings());
    setToast(`"${title}" deleted`);
  };

  return (
    <AdminLayout>
      <div className="admin-header-row">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Listings</h1>
          <p className="admin-page-subtitle">{listings.length} vehicles</p>
        </div>
        <Link to="/admin/listings/new" className="admin-btn admin-btn-primary">
          + New Listing
        </Link>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="admin-toast">
          {toast}
        </div>
      )}

      {listings.length > 0 ? (
        <div className="admin-list">
          {listings.map((listing) => {
            const title = formatTitle(listing);
            return (
              <div key={listing.id} className="admin-list-row">
                <div className="admin-list-thumb">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt={title} />
                  ) : (
                    <div className="admin-list-thumb-placeholder">No img</div>
                  )}
                </div>
                <div className="admin-list-info">
                  <p className="admin-list-title">{title}</p>
                  <p className="admin-list-meta">
                    <span>${listing.price?.toLocaleString() || '—'}</span>
                    <span>{listing.mileage?.toLocaleString() || '—'} mi</span>
                    <span>{listing.location || '—'}</span>
                  </p>
                </div>
                <div className="admin-list-actions">
                  <Link
                    to={`/admin/listings/${listing.id}/edit`}
                    className="admin-btn admin-btn-small"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() => handleDelete(listing.id, title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty">
          <p className="admin-empty-text">No listings yet.</p>
          <Link to="/admin/listings/new" className="admin-btn admin-btn-primary">
            + Create First Listing
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}