import AdminLayout from '../components/AdminLayout.jsx';

export default function AdminGatePage() {
  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin</h1>
        <p className="admin-page-subtitle">Manage your dealership</p>
      </div>
      <div className="admin-placeholder">
        <p className="admin-placeholder-text">Admin tools coming next.</p>
      </div>
    </AdminLayout>
  );
}