import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.succeeded) {
        setError(
          data.errors?.[0] ||
          'Invalid email or password.'
        )

        return
      }

      const storage = rememberMe
        ? localStorage
        : sessionStorage

      storage.setItem(
        'seatrack_access_token',
        data.accessToken
      )

      storage.setItem(
        'seatrack_token_expires_at',
        data.expiresAtUtc
      )

      navigate('/dashboard')
    } catch {
      setError(
        'Unable to connect to SeaTrack. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-grid"></div>

      <span className="login-circle login-circle-one"></span>
      <span className="login-circle login-circle-two"></span>

      <div className="login-container">

        {/* LEFT */}

        <div className="login-intro">

          <span className="login-label">
            CUSTOMER PORTAL
          </span>

          <h1>
            Your cargo.
            <br />
            <span>Your dashboard.</span>
          </h1>

          <p>
            Sign in to manage shipping orders, review quotes,
            follow shipments, invoices and payments through one
            connected maritime logistics platform.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span>01</span>

              <div>
                <strong>Manage Orders</strong>

                <p>
                  Create and follow your maritime shipping requests.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>02</span>

              <div>
                <strong>Review Quotes</strong>

                <p>
                  Accept or reject logistics quotations from SeaTrack.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>03</span>

              <div>
                <strong>Track Shipments</strong>

                <p>
                  Follow every milestone from loading to final delivery.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* LOGIN CARD */}

        <div className="login-card">

          <div className="login-card-header">

            <span>WELCOME BACK</span>

            <h2>Sign in to SeaTrack</h2>

            <p>
              Enter your account details to continue.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            <div className="login-field">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>

            <label className="login-remember">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />

              <span>Remember me</span>

            </label>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Signing In...'
                : 'Sign In'}

              {!isLoading && <span>→</span>}
            </button>

            <div className="login-divider">
              <span></span>
              <p>NEW TO SEATRACK?</p>
              <span></span>
            </div>

            <Link
              to="/register"
              className="login-register"
            >
              Create Customer Account
              <span>→</span>
            </Link>

          </form>

          <div className="login-card-footer">

            <span></span>

            Secure Customer Access

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login