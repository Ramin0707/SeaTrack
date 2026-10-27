import { useEffect, useState } from 'react'
import './CustomerProfile.css'

const API_BASE_URL = 'https://localhost:44328'


function getAccessToken() {
  return (
    localStorage.getItem(
      'seatrack_access_token'
    ) ||
    sessionStorage.getItem(
      'seatrack_access_token'
    )
  )
}


function getInitials(fullName) {
  if (!fullName) {
    return 'CU'
  }

  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) => part[0]
    )
    .join('')
    .toUpperCase()
}


export default function CustomerProfile() {
  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {

    const loadProfile =
      async () => {

        try {
          setLoading(true)
          setError('')

          const token =
            getAccessToken()

          if (!token) {
            throw new Error(
              'Authorization token was not found.'
            )
          }

          const response =
            await fetch(
              `${API_BASE_URL}/api/auth/me`,
              {
                method: 'GET',
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                  Accept:
                    'application/json'
                }
              }
            )

          if (!response.ok) {
            throw new Error(
              `Failed to load profile. Status: ${response.status}`
            )
          }

          const data =
            await response.json()

          setUser(data)

        } catch (err) {

          setError(
            err.message ||
            'Failed to load profile.'
          )

        } finally {

          setLoading(false)
        }
      }


    loadProfile()

  }, [])


  if (loading) {
    return (
      <section className="customer-profile">

        <div className="profile-header">

          <div>

            <span className="profile-eyebrow">
              ACCOUNT
            </span>

            <h1>
              Profile
            </h1>

            <p>
              View your SeaTrack customer
              account information.
            </p>

          </div>

        </div>


        <div className="profile-state">
          Loading profile...
        </div>

      </section>
    )
  }


  if (error) {
    return (
      <section className="customer-profile">

        <div className="profile-header">

          <div>

            <span className="profile-eyebrow">
              ACCOUNT
            </span>

            <h1>
              Profile
            </h1>

          </div>

        </div>


        <div className="profile-error">
          {error}
        </div>

      </section>
    )
  }


  return (
    <section className="customer-profile">


      {/* HEADER */}

      <div className="profile-header">

        <div>

          <span className="profile-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Profile
          </h1>

          <p>
            Manage and review your SeaTrack
            customer account.
          </p>

        </div>

      </div>


      {/* PROFILE HERO */}

      <div className="profile-card profile-hero">


        <div className="profile-avatar-large">
          {
            getInitials(
              user?.fullName
            )
          }
        </div>


        <div className="profile-hero-info">

          <span className="profile-account-label">
            SEATRACK CUSTOMER
          </span>

          <h2>
            {
              user?.fullName ||
              'Customer'
            }
          </h2>

          <p>
            {
              user?.email ||
              'No email available'
            }
          </p>


          <div className="profile-role">

            <span>
              Role
            </span>

            <strong>
              {
                user?.roles?.[0] ||
                'Customer'
              }
            </strong>

          </div>

        </div>

      </div>


      {/* ACCOUNT INFORMATION */}

      <div className="profile-section">


        <div className="profile-section-header">

          <div>

            <span>
              PERSONAL DETAILS
            </span>

            <h3>
              Account Information
            </h3>

          </div>

        </div>


        <div className="profile-info-grid">


          <div className="profile-info-item">

            <span>
              Full Name
            </span>

            <strong>
              {
                user?.fullName ||
                '—'
              }
            </strong>

          </div>


          <div className="profile-info-item">

            <span>
              Email Address
            </span>

            <strong>
              {
                user?.email ||
                '—'
              }
            </strong>

          </div>


          <div className="profile-info-item">

            <span>
              Account Role
            </span>

            <strong>
              {
                user?.roles?.join(', ') ||
                'Customer'
              }
            </strong>

          </div>


          <div className="profile-info-item">

            <span>
              Account Status
            </span>

            <strong className="profile-active-status">
              Active
            </strong>

          </div>

        </div>

      </div>


      {/* ACCOUNT ID */}

      <div className="profile-section">


        <div className="profile-section-header">

          <div>

            <span>
              ACCOUNT
            </span>

            <h3>
              SeaTrack Account
            </h3>

          </div>

        </div>


        <div className="profile-account-id">

          <div>

            <span>
              Customer ID
            </span>

            <strong>
              {
                user?.userId ||
                '—'
              }
            </strong>

          </div>

        </div>

      </div>


      {/* SECURITY */}

      <div className="profile-section">


        <div className="profile-section-header">

          <div>

            <span>
              SECURITY
            </span>

            <h3>
              Account Security
            </h3>

          </div>

        </div>


        <div className="profile-security-card">


          <div>

            <strong>
              Password
            </strong>

            <p>
              Your password is securely
              protected by SeaTrack.
            </p>

          </div>


          <button
            type="button"
            disabled
            title="Password management will be added later."
          >
            Change Password
          </button>

        </div>


        <div className="profile-security-note">

          Profile editing and password
          management will be connected when
          the corresponding account API
          endpoints are added.

        </div>

      </div>


    </section>
  )
}