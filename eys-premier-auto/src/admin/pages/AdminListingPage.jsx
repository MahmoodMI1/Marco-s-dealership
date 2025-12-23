import { Link } from 'react-router-dom';
import { getAllListings } from '../../inventory/repo/ListingsRepo.js';
import AdminLayout from '../components/AdminLayout.jsx';

export default function AdminListingsPage() {
  const listings = getAllListings();

  const formatTitle = (listing) => {
    const base = `${listing.year} ${listing.make} ${listing.model}`;
    return listing.trim ? `${base} ${listing.trim}` : base;
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

      {listings.length > 0 ? (
        <div className="admin-list">
          {listings.map((listing) => (
            <div key={listing.id} className="admin-list-row">
              <div className="admin-list-thumb">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={formatTitle(listing)} />
                ) : (
                  <div className="admin-list-thumb-placeholder">No img</div>
                )}
              </div>
              <div className="admin-list-info">
                <p className="admin-list-title">{formatTitle(listing)}</p>
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
              </div>
            </div>
          ))}
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