import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const API_URL = 'https://localhost:44328'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const fullName = formData.fullName.trim()
    const email = formData.email.trim()

    if (!fullName || !email || !formData.password) {
      setError('Please complete all required fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          password: formData.password
        })
      })

      let data = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok || data?.succeeded === false) {
        const apiErrors = data?.errors

        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          throw new Error(apiErrors.join(' '))
        }

        if (typeof apiErrors === 'string' && apiErrors) {
          throw new Error(apiErrors)
        }

        throw new Error(
          data?.message ||
            'Registration failed. Please check your information and try again.'
        )
      }

      setSuccess('Account created successfully. Redirecting to login...')

      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      setTimeout(() => {
        navigate('/login', {
          state: {
            registered: true,
            email
          }
        })
      }, 1200)
    } catch (requestError) {
      console.error('Registration error:', requestError)

      setError(
        requestError.message ||
          'Unable to create your account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <section className="register-shell">
        <div className="register-visual">
          <div className="register-visual-overlay" />

          <div className="register-visual-content">
            <Link to="/" className="register-brand">
              Sea<span>Track</span>
            </Link>

            <div className="register-visual-copy">
              <div className="register-eyebrow">
                <span className="register-eyebrow-line" />
                GLOBAL MARITIME LOGISTICS
              </div>

              <h1>
                Move cargo.
                <br />
                <span>Stay connected.</span>
              </h1>

              <p>
                Create your SeaTrack account and manage shipping orders,
                quotations, shipments and cargo visibility through one
                connected maritime logistics platform.
              </p>
            </div>

            <div className="register-visual-stats">
              <div>
                <strong>120+</strong>
                <span>Global Ports</span>
              </div>

              <div>
                <strong>35+</strong>
                <span>Shipping Routes</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Cargo Visibility</span>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-side">
          <div className="register-form-wrapper">
            <div className="register-form-heading">
              <div className="register-section-label">
                <span />
                CUSTOMER REGISTRATION
              </div>

              <h2>Create your account</h2>

              <p>
                Join SeaTrack and start managing your maritime logistics from
                one secure dashboard.
              </p>
            </div>

            {error && (
              <div className="register-message register-message-error">
                <span className="register-message-icon">!</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="register-message register-message-success">
                <span className="register-message-icon">✓</span>
                <p>{success}</p>
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-field">
                <label htmlFor="fullName">
                  Full Name
                  <span>*</span>
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 6L12 13L21 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="password">
                  Password
                  <span>*</span>
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                  <span>*</span>
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div className="register-terms">
                <span className="register-terms-mark">✓</span>

                <p>
                  By creating an account, you agree to SeaTrack's{' '}
                  <a href="/terms">Terms of Service</a> and{' '}
                  <a href="/privacy">Privacy Policy</a>.
                </p>
              </div>

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                <span>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </span>

                {!loading && <span className="register-submit-arrow">→</span>}
              </button>
            </form>

            <div className="register-login">
              <span>Already have a SeaTrack account?</span>

              <Link to="/login">
                Sign In
                <span>→</span>
              </Link>
            </div>

            <div className="register-security">
              <span className="register-security-dot" />
              SECURE CUSTOMER REGISTRATION
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Register