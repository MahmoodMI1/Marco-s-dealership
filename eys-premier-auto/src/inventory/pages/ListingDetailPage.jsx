import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../repo/ListingsRepo.js';

export default function ListingDetailPage() {
  const { id } = useParams();
  const listing = getListingById(id);

  if (!listing) {
    return (
      <div style={{ padding: '24px' }}>
        <Link to="/inventory">← Back to Inventory</Link>
        <h1>Listing not found</h1>
      </div>
    );
  }

  const displayTitle = `${listing.year} ${listing.make} ${listing.model}`;
  const displayImage = listing.images?.[0] || '';

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/inventory">← Back to Inventory</Link>
      <img
        src={displayImage}
        alt={displayTitle}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginTop: '16px' }}
      />
      <h1>{displayTitle}</h1>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${listing.price.toLocaleString()}</p>
      <p style={{ color: '#666' }}>{listing.mileage.toLocaleString()} miles</p>
    </div>
  );
}