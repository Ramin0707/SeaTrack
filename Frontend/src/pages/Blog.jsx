import './Blog.css'

import { useEffect, useState } from 'react'

import featuredImage from '../assets/images/blog-featured-maritime.jpg'
import globalTradeImage from '../assets/images/blog-hero-ship.png'
import containerShippingImage from '../assets/images/blog-container-shipping.png'
import portsTechnologyImage from '../assets/images/blog-ports-technology.png'

import CallToAction from '../components/CallToAction'


const API_URL = 'https://localhost:44328'


const fallbackImages = [
  globalTradeImage,
  containerShippingImage,
  portsTechnologyImage
]


/* =====================================
   RESOLVE CMS IMAGE URL
====================================== */

function resolveImageUrl(imageUrl) {

  if (!imageUrl) {
    return null
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('blob:') ||
    imageUrl.startsWith('data:')
  ) {
    return imageUrl
  }

  if (imageUrl.startsWith('/')) {
    return `${API_URL}${imageUrl}`
  }

  return `${API_URL}/${imageUrl}`
}


/* =====================================
   FORMAT DATE
====================================== */

function formatDate(value) {

  if (!value) {
    return ''
  }

  const date = new Date(value)

  return date
    .toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
    .toUpperCase()
}


/* =====================================
   FEATURED DATE
====================================== */

function getFeaturedDate(value) {

  if (!value) {

    return {
      day: '--',
      month: '---',
      year: '----'
    }
  }

  const date = new Date(value)

  return {

    day: date
      .getDate()
      .toString()
      .padStart(2, '0'),

    month: date
      .toLocaleString(
        'en-US',
        {
          month: 'short'
        }
      )
      .toUpperCase(),

    year: date
      .getFullYear()
      .toString()
  }
}


/* =====================================
   BLOG
====================================== */

function Blog() {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  /* =====================================
     LOAD PUBLISHED BLOG POSTS
  ====================================== */

  useEffect(() => {

    let cancelled = false


    async function loadPosts() {

      try {

        setLoading(true)
        setError('')


        const response = await fetch(
          `${API_URL}/api/blog`
        )


        if (!response.ok) {

          throw new Error(
            `Unable to load blog posts (${response.status}).`
          )
        }


        const data =
          await response.json()


        if (!cancelled) {

          setPosts(
            Array.isArray(data)
              ? data
              : []
          )
        }

      } catch (error) {

        console.error(
          'Failed to load blog posts:',
          error
        )


        if (!cancelled) {

          setError(
            'Unable to load SeaTrack Journal at the moment.'
          )
        }

      } finally {

        if (!cancelled) {
          setLoading(false)
        }
      }
    }


    loadPosts()


    return () => {
      cancelled = true
    }

  }, [])


  /* =====================================
     BLOG DATA
  ====================================== */

  const featuredPost =
    posts.length > 0
      ? posts[0]
      : null


  const latestPosts =
    posts.length > 1
      ? posts.slice(1)
      : []


  const featuredDate =
    getFeaturedDate(
      featuredPost?.publishedAtUtc
    )


  const featuredPostImage =
    resolveImageUrl(
      featuredPost?.imageUrl
    ) || featuredImage


  /* =====================================
     RENDER
  ====================================== */

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

              <span>
                {' '}maritime world.
              </span>

            </h1>


            <p>

              Explore maritime logistics, global trade,
              shipping technology and the ideas shaping
              the future of cargo transportation.

            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          LOADING
      ====================================== */}

      {
        loading &&
        (

          <section className="blog-featured">

            <div className="blog-featured-container">

              <div className="blog-featured-content">

                <div className="blog-article-meta">

                  <span>
                    SEATRACK JOURNAL
                  </span>

                </div>


                <h2>

                  Loading maritime

                  <span>
                    {' '}insights...
                  </span>

                </h2>


                <p>

                  Please wait while the latest SeaTrack
                  articles are being loaded.

                </p>

              </div>

            </div>

          </section>
        )
      }


      {/* =====================================
          ERROR
      ====================================== */}

      {
        !loading &&
        error &&
        (

          <section className="blog-featured">

            <div className="blog-featured-container">

              <div className="blog-featured-content">

                <div className="blog-article-meta">

                  <span>
                    SEATRACK JOURNAL
                  </span>

                </div>


                <h2>

                  Journal temporarily

                  <span>
                    {' '}unavailable.
                  </span>

                </h2>


                <p>
                  {error}
                </p>

              </div>

            </div>

          </section>
        )
      }


      {/* =====================================
          EMPTY BLOG
      ====================================== */}

      {
        !loading &&
        !error &&
        posts.length === 0 &&
        (

          <section className="blog-featured">

            <div className="blog-featured-container">

              <div className="blog-featured-content">

                <div className="blog-article-meta">

                  <span>
                    SEATRACK JOURNAL
                  </span>

                </div>


                <h2>

                  New maritime insights

                  <span>
                    {' '}are coming soon.
                  </span>

                </h2>


                <p>

                  The SeaTrack team is preparing new
                  articles about maritime logistics,
                  shipping operations and global trade.

                </p>

              </div>

            </div>

          </section>
        )
      }


      {/* =====================================
          FEATURED ARTICLE
      ====================================== */}

      {
        !loading &&
        !error &&
        featuredPost &&
        (

          <section className="blog-featured">

            <div className="blog-featured-container">


              {/* IMAGE */}

              <div className="blog-featured-image">

                <img
                  src={featuredPostImage}
                  alt={featuredPost.title || 'SeaTrack article'}
                  onError={(event) => {

                    event.currentTarget.onerror = null
                    event.currentTarget.src = featuredImage

                  }}
                />


                <div className="blog-featured-badge">
                  FEATURED
                </div>

              </div>


              {/* CONTENT */}

              <div className="blog-featured-content">

                <div className="blog-article-meta">

                  <span>
                    MARITIME INSIGHTS
                  </span>

                  <i></i>

                  <span>
                    SEATRACK JOURNAL
                  </span>

                </div>


                <h2>
                  {featuredPost.title}
                </h2>


                <p>
                  {featuredPost.summary}
                </p>


                <div className="blog-featured-footer">


                  <div className="blog-featured-date">

                    <span>
                      {featuredDate.day}
                    </span>


                    <div>

                      <strong>
                        {featuredDate.month}
                      </strong>

                      <small>
                        {featuredDate.year}
                      </small>

                    </div>

                  </div>


                  <div className="blog-read-more">

                    {
                      featuredPost.authorName ||
                      'SeaTrack Team'
                    }

                  </div>

                </div>

              </div>

            </div>

          </section>
        )
      }


      {/* =====================================
          LATEST INSIGHTS
      ====================================== */}

      {
        !loading &&
        !error &&
        latestPosts.length > 0 &&
        (

          <section className="blog-latest">

            <div className="blog-latest-container">


              {/* HEADER */}

              <div className="blog-latest-heading">

                <div>

                  <span className="blog-section-label">
                    LATEST INSIGHTS
                  </span>


                  <h2>

                    Stories shaping

                    <span>
                      {' '}global maritime trade.
                    </span>

                  </h2>

                </div>


                <p>

                  Explore insights about shipping routes,
                  container operations, port technology
                  and the systems that keep global cargo
                  moving.

                </p>

              </div>


              {/* ARTICLES */}

              <div className="blog-articles-grid">

                {
                  latestPosts.map(
                    (post, index) => {

                      const fallbackImage =
                        fallbackImages[
                          index %
                          fallbackImages.length
                        ]


                      const postImage =
                        resolveImageUrl(
                          post.imageUrl
                        ) || fallbackImage


                      return (

                        <article
                          key={post.id}
                          className="blog-card"
                        >


                          {/* IMAGE */}

                          <div className="blog-card-image">

                            <img
                              src={postImage}
                              alt={
                                post.title ||
                                'SeaTrack article'
                              }
                              onError={(event) => {

                                event.currentTarget.onerror = null

                                event.currentTarget.src =
                                  fallbackImage

                              }}
                            />


                            <span className="blog-card-number">

                              {
                                String(
                                  index + 1
                                ).padStart(
                                  2,
                                  '0'
                                )
                              }

                            </span>

                          </div>


                          {/* CONTENT */}

                          <div className="blog-card-content">


                            <div className="blog-card-meta">

                              <span>
                                MARITIME INSIGHTS
                              </span>

                              <i></i>

                              <span>
                                SEATRACK
                              </span>

                            </div>


                            <h3>
                              {post.title}
                            </h3>


                            <p>
                              {post.summary}
                            </p>


                            <div className="blog-card-footer">

                              <span>

                                {
                                  formatDate(
                                    post.publishedAtUtc
                                  )
                                }

                              </span>


                              <span>

                                {
                                  post.authorName ||
                                  'SeaTrack Team'
                                }

                              </span>

                            </div>

                          </div>

                        </article>
                      )
                    }
                  )
                }

              </div>

            </div>

          </section>
        )
      }


      {/* =====================================
          CTA
      ====================================== */}

      <CallToAction />


    </div>
  )
}


export default Blog