function App() {
  return (
    <>
      <header>
        <nav>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="https://dealership-site.com" target="_blank" rel="noopener noreferrer">
            View Inventory ↗
          </a>
        </nav>
      </header>

      <main>
        <section id="home">
          <h1>Marco Georgy</h1>
          <p>Your trusted partner in automotive excellence</p>
        </section>

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
          <h2>About Us</h2>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
            alt="Marco Georgy"
            className="portrait"
          />
          <p>Facebook | Instagram | Twitter</p>
        </section>
      </main>

      <footer>
        <p>EYS Premier Auto. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;