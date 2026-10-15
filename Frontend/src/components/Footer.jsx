import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contacts">

      <div className="footer-top-line"></div>

      <div className="footer-container">

        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">

            <a href="#top" className="footer-logo">
              Sea<span>Track</span>
            </a>

            <p className="footer-description">
              Modern maritime logistics connecting cargo,
              ports and global trade through one transparent
              digital platform.
            </p>

            <div className="footer-brand-line">
              <span></span>
              GLOBAL MARITIME LOGISTICS
            </div>

            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn">
                in
              </a>

              <a href="#" aria-label="Facebook">
                f
              </a>

              <a href="#" aria-label="Instagram">
                ig
              </a>
            </div>

          </div>


          {/* COMPANY */}
          <div className="footer-column">

            <h4>Company</h4>

            <nav>
              <a href="#top">Home</a>
              <a href="#services">Services</a>
              <a href="#about">About Us</a>
              <a href="#blog">Blog</a>
              <a href="#contacts">Contacts</a>
            </nav>

          </div>


          {/* LOGISTICS */}
          <div className="footer-column">

            <h4>Logistics</h4>

            <nav>
              <a href="#tracking">Track Shipment</a>
              <a href="#services">Sea Freight</a>
              <a href="#services">Container Shipping</a>
              <a href="#routes">Shipping Routes</a>
              <a href="#ports">Global Ports</a>
            </nav>

          </div>


          {/* CONTACT */}
          <div className="footer-column footer-contact">

            <h4>Get in Touch</h4>

            <div className="footer-contact-item">
              <span>Email</span>

              <a href="mailto:info@seatrack.com">
                info@seatrack.com
              </a>
            </div>

            <div className="footer-contact-item">
              <span>Phone</span>

              <a href="tel:+994125550101">
                +994 12 555 01 01
              </a>
            </div>

            <div className="footer-contact-item">
              <span>Office</span>

              <p>
                Baku, Azerbaijan
              </p>
            </div>

            <div className="footer-status">
              <span></span>

              Operations Online
            </div>

          </div>

        </div>


        {/* DIVIDER */}

        <div className="footer-divider"></div>


        {/* BOTTOM */}

        <div className="footer-bottom">

          <p>
            © 2026 SeaTrack. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms of Service
            </a>
          </div>

          <a href="#top" className="footer-back-top">
            Back to top
            <span>↑</span>
          </a>

        </div>

      </div>


      {/* LARGE DECORATIVE TEXT */}

      <div className="footer-watermark" aria-hidden="true">
        SEATRACK
      </div>

    </footer>
  )
}

export default Footer