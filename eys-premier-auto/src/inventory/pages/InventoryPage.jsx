import { Link } from 'react-router-dom';
import { getAllListings } from '../repo/listingsRepo.js';
import ListingCard from '../components/ListingCard.jsx';

export default function InventoryPage() {
  const listings = getAllListings();
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/">← Back to Home</Link>
      <h1>Inventory</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </div>
  );
}