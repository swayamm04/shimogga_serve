export default function Footer() {
  const year = 2026;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <a href="/" className="footer-logo">snap<span>sy</span></a>
            <p className="footer-desc">
              On-demand life operations for urban India. Verified helpers, in 15 minutes.
            </p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/_https.snapsy" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg className="w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/snapsy-technologies-private-limited" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:hello@snapsy.co.in" className="footer-social-btn" aria-label="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                  <path d="m21.854 2.147-10.94 10.939"/>
                </svg>
              </a>
            </div>
            <div className="footer-made-india">Proudly Made in India</div>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h5>Platform</h5>
            <ul>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/partners">Become a Partner</a></li>
              <li><a href="mailto:hello@snapsy.co.in">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/safety">Safety</a></li>
              <li><a href="/data-deletion">Data Deletion</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>
            <div className="footer-company-name">Snapsy Technologies Private Limited</div>
            <div className="footer-meta">
              <span>CIN: U74909TZ2026PTC038861</span>
              <span>·</span>
              <span>GSTIN: 33ABTCS5055J1ZU</span>
              <span>·</span>
              <span>Reg: Palacode, Dharmapuri, TN — 636805</span>
              <span>·</span>
              <span>Ops: Saibaba Colony, Coimbatore</span>
            </div>
            <div>
              <span className="footer-startup-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                DPIIT Recognised Startup
              </span>
            </div>
            <div className="footer-meta" style={{ marginTop: "0.4rem" }}>
              <a href="mailto:hello@snapsy.co.in" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>hello@snapsy.co.in</a>
              <span>·</span>
              <a href="https://snapsy.co.in" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}>snapsy.co.in</a>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-copyright">© {year} Snapsy Technologies Pvt. Ltd.</div>
            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <span>·</span>
              <a href="/terms">Terms</a>
              <span>·</span>
              <a href="/safety">Safety</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
