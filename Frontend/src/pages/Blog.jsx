import './Blog.css'

import featuredImage from '../assets/images/blog-featured-maritime.jpg'
import globalTradeImage from '../assets/images/blog-hero-ship.png'
import containerShippingImage from '../assets/images/blog-container-shipping.png'
import portsTechnologyImage from '../assets/images/blog-ports-technology.png'
import CallToAction from '../components/CallToAction'

function Blog() {
  return (
    <div className="blog-page">

      {/* =====================================
          BLOG HERO
      ====================================== */}

      <section className="blog-hero">

        <div className="blog-hero-grid"></div>

        <span className="blog-circle blog-circle-one"></span>
        <span className="blog-circle blog-circle-two"></span>

        <div className="blog-hero-container">

          <span className="blog-label">
            SEATRACK JOURNAL
          </span>

          <div className="blog-hero-heading">

            <h1>
              Insights from the
              <span> maritime world.</span>
            </h1>

            <p>
              Explore maritime logistics, global trade, shipping
              technology and the ideas shaping the future of
              cargo transportation.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          FEATURED ARTICLE
      ====================================== */}

      <section className="blog-featured">

        <div className="blog-featured-container">

          <div className="blog-featured-image">

            <img
              src={featuredImage}
              alt="Modern maritime logistics and container terminal"
            />

            <div className="blog-featured-badge">
              FEATURED
            </div>

          </div>


          <div className="blog-featured-content">

            <div className="blog-article-meta">
              <span>MARITIME INSIGHTS</span>
              <i></i>
              <span>8 MIN READ</span>
            </div>

            <h2>
              How digital platforms
              are changing
              <span> maritime logistics.</span>
            </h2>

            <p>
              Modern maritime logistics is becoming more connected.
              Digital platforms bring customers, cargo, vessels,
              ports and shipment information together, creating
              clearer and more efficient logistics operations.
            </p>

            <div className="blog-featured-footer">

              <div className="blog-featured-date">
                <span>15</span>

                <div>
                  <strong>OCT</strong>
                  <small>2026</small>
                </div>
              </div>

              <a href="#" className="blog-read-more">
                Read Article
                <span>→</span>
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          LATEST INSIGHTS
      ====================================== */}

      <section className="blog-latest">

        <div className="blog-latest-container">

          <div className="blog-latest-heading">

            <div>
              <span className="blog-section-label">
                LATEST INSIGHTS
              </span>

              <h2>
                Stories shaping
                <span> global maritime trade.</span>
              </h2>
            </div>

            <p>
              Explore insights about shipping routes, container
              operations, port technology and the systems that
              keep global cargo moving.
            </p>

          </div>


          <div className="blog-articles-grid">

            {/* ARTICLE 01 */}

            <article className="blog-card">

              <div className="blog-card-image">

                <img
                  src={globalTradeImage}
                  alt="Container ship transporting global cargo"
                />

                <span className="blog-card-number">
                  01
                </span>

              </div>

              <div className="blog-card-content">

                <div className="blog-card-meta">
                  <span>GLOBAL TRADE</span>
                  <i></i>
                  <span>6 MIN READ</span>
                </div>

                <h3>
                  The routes connecting tomorrow&apos;s global trade
                </h3>

                <p>
                  Maritime routes remain the backbone of international
                  commerce, connecting ports, markets and economies
                  across the world.
                </p>

                <div className="blog-card-footer">

                  <span>12 OCT 2026</span>

                  <a href="#">
                    Read Article
                    <span>→</span>
                  </a>

                </div>

              </div>

            </article>


            {/* ARTICLE 02 */}

            <article className="blog-card">

              <div className="blog-card-image">

                <img
                  src={containerShippingImage}
                  alt="Modern container shipping terminal operations"
                />

                <span className="blog-card-number">
                  02
                </span>

              </div>

              <div className="blog-card-content">

                <div className="blog-card-meta">
                  <span>CONTAINER SHIPPING</span>
                  <i></i>
                  <span>7 MIN READ</span>
                </div>

                <h3>
                  Inside modern container shipping operations
                </h3>

                <p>
                  From container assignment to terminal handling,
                  modern shipping depends on carefully coordinated
                  equipment and operations.
                </p>

                <div className="blog-card-footer">

                  <span>09 OCT 2026</span>

                  <a href="#">
                    Read Article
                    <span>→</span>
                  </a>

                </div>

              </div>

            </article>


            {/* ARTICLE 03 */}

            <article className="blog-card">

              <div className="blog-card-image">

                <img
                  src={portsTechnologyImage}
                  alt="Smart port technology and digital logistics"
                />

                <span className="blog-card-number">
                  03
                </span>

              </div>

              <div className="blog-card-content">

                <div className="blog-card-meta">
                  <span>PORTS &amp; TECHNOLOGY</span>
                  <i></i>
                  <span>5 MIN READ</span>
                </div>

                <h3>
                  How smart ports are transforming cargo movement
                </h3>

                <p>
                  Digital tools are helping ports coordinate vessels,
                  terminals and cargo operations with greater
                  visibility and efficiency.
                </p>

                <div className="blog-card-footer">

                  <span>04 OCT 2026</span>

                  <a href="#">
                    Read Article
                    <span>→</span>
                  </a>

                </div>

              </div>

            </article>

          </div>

        </div>

      </section>
                <CallToAction />
    </div>
  )
}

export default Blog