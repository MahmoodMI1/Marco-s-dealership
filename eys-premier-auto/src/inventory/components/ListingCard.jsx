import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/inventory/${listing.id}`} style={{ display: 'block', border: '1px solid #ccc', borderRadius: '8px', padding: '16px', textDecoration: 'none', color: 'inherit' }}>
      <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '12px 0 8px' }}>{listing.title}</h3>
      <p style={{ margin: 0 }}>${listing.price.toLocaleString()}</p>
      <p style={{ margin: '4px 0 0', color: '#666' }}>{listing.mileage.toLocaleString()} miles</p>
    </Link>
  );
}