import { useEffect, useState } from 'react';
import { scrollToSection } from './utils/scroll.js';

function App() {
  const [scrolled, setScrolled] = useState(false);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id, 60);
  };

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for service cards
  useEffect(() => {
    const cards = document.querySelectorAll('#services > div > div');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    cards.forEach((card) => observer.observe(card));
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="hero">
        <header className={scrolled ? 'scrolled' : ''}>
          <nav>
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Services</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
            <a href="https://dealership-site.com" target="_blank" rel="noopener noreferrer">
              View Inventory ↗
            </a>
          </nav>
        </header>

        <section id="home" className="hero-content">
          <h1>Marco Georgy</h1>
          <p>Your trusted partner in automotive excellence</p>
        </section>

        <button 
          className="scroll-cue" 
          onClick={() => scrollToSection('services', 60)}
          aria-label="Scroll to services"
        >
          <span className="scroll-cue-text">Scroll</span>
          <span className="scroll-cue-arrow" aria-hidden="true"></span>
        </button>
      </div>

      <main>
        <section id="services">
          <h2>Our Services</h2>
          <div>
            <div>
              <h3>Vehicle Sales</h3>
              <p>Browse our selection of quality pre-owned vehicles</p>
            </div>
            <div>
              <h3>Financing</h3>
              <p>Flexible financing options available</p>
            </div>
            <div>
              <h3>Trade-Ins</h3>
              <p>Get a fair value for your current vehicle</p>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="about-container">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
              alt="Marco Georgy"
              className="portrait"
            />
            <div className="about-text">
              <h2>About Us</h2>
              <span className="about-divider"></span>
              <p>I believe in building relationships, not just closing deals. Every client deserves honesty, transparency, and a car they can trust. That's the standard I hold myself to.</p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p className="footer-copy">© {new Date().getFullYear()} Marco Georgy</p>
          <div className="footer-links">
            <a href="https://dealership-site.com" target="_blank" rel="noopener noreferrer">View Inventory ↗</a>
            <a href="mailto:contact@example.com">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;