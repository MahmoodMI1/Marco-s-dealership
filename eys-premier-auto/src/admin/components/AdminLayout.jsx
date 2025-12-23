import { NavLink, Link } from 'react-router-dom';
import '../admin.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin" className="admin-topbar-title">Admin</Link>
          <nav className="admin-topbar-nav">
            <NavLink to="/admin/listings" end>Listings</NavLink>
            <NavLink to="/admin/listings/new">New</NavLink>
          </nav>
        </div>
        <Link to="/inventory" className="admin-topbar-exit">← Back to Inventory</Link>
      </div>
      <div className="admin-container">
        {children}
      </div>
    </div>
  );
}