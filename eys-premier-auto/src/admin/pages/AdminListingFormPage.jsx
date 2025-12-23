import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';

export default function AdminListingFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <AdminLayout>
      <Link to="/admin/listings" className="admin-back">← Back to Listings</Link>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isEdit ? `Edit Listing: ${id}` : 'New Listing'}
        </h1>
        <p className="admin-page-subtitle">
          {isEdit ? 'Update listing details' : 'Create a new vehicle listing'}
        </p>
      </div>
      <div className="admin-placeholder">
        <p className="admin-placeholder-text">Form coming next.</p>
      </div>
    </AdminLayout>
  );
}