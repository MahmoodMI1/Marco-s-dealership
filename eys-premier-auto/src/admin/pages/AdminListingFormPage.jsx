import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';

export default function AdminListingsPage() {
  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Listings</h1>
        <p className="admin-page-subtitle">Manage vehicle inventory</p>
      </div>
      <div className="admin-placeholder">
        <p className="admin-placeholder-text">List view coming next.</p>
        <Link to="/admin/listings/new" className="admin-btn admin-btn-primary">
          + New Listing
        </Link>
      </div>
    </AdminLayout>
  );
}