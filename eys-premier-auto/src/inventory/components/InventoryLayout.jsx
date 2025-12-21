import { Link } from 'react-router-dom';
import '../inventory.css';

export default function InventoryLayout({ children }) {
  return (
    <>
      <div className="inv-topbar">
        <Link to="/inventory" className="inv-topbar-brand">EYS Premier Auto</Link>
        <Link to="/" className="inv-topbar-link">Marco's Portfolio</Link>
      </div>
      <div className="inv-container">
        {children}
      </div>
    </>
  );
}