import './CreateShippingOrder.css'

import { useState } from 'react'


function CreateShippingOrder({
  onCancel,
  onCreated
}) {
  const [form, setForm] = useState({
    cargoType: '',
    weight: '',
    volume: '',
    originPort: '',
    destinationPort: '',
    containerType: 1,
    desiredShippingDate: ''
  })

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')


  /* =====================================
     TOKEN
  ====================================== */

  const getToken = () => {
    return (
      localStorage.getItem(
        'seatrack_access_token'
      ) ||
      sessionStorage.getItem(
        'seatrack_access_token'
      )
    )
  }


  /* =====================================
     CHANGE
  ====================================== */

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }


  /* =====================================
     SUBMIT
  ====================================== */

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')


    if (
      !form.cargoType.trim() ||
      !form.originPort.trim() ||
      !form.destinationPort.trim() ||
      !form.desiredShippingDate
    ) {
      setError(
        'Please complete all required fields.'
      )

      return
    }


    if (
      Number(form.weight) <= 0 ||
      Number(form.volume) <= 0
    ) {
      setError(
        'Weight and volume must be greater than zero.'
      )

      return
    }


    if (
      form.originPort.trim().toLowerCase() ===
      form.destinationPort.trim().toLowerCase()
    ) {
      setError(
        'Origin and destination ports must be different.'
      )

      return
    }


    const token = getToken()

    if (!token) {
      setError(
        'Your session has expired. Please sign in again.'
      )

      return
    }


    setIsSubmitting(true)


    try {
      const response = await fetch(
        'https://localhost:44328/api/shipping-orders',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            cargoType:
              form.cargoType.trim(),

            weight:
              Number(form.weight),

            volume:
              Number(form.volume),

            originPort:
              form.originPort.trim(),

            destinationPort:
              form.destinationPort.trim(),

            containerType:
              Number(form.containerType),

            desiredShippingDate:
              new Date(
                form.desiredShippingDate
              ).toISOString()
          })
        }
      )


      if (response.status === 401) {
        setError(
          'Your session has expired. Please sign in again.'
        )

        return
      }


      if (!response.ok) {
        let message =
          'Unable to create shipping order.'

        try {
          const data =
            await response.json()

          if (data?.message) {
            message = data.message
          }

          if (
            Array.isArray(data?.errors) &&
            data.errors.length > 0
          ) {
            message = data.errors[0]
          }
        } catch {
          // Keep default error message.
        }

        setError(message)

        return
      }


      setSuccess(
        'Shipping order created successfully.'
      )


      setForm({
        cargoType: '',
        weight: '',
        volume: '',
        originPort: '',
        destinationPort: '',
        containerType: 1,
        desiredShippingDate: ''
      })


      if (onCreated) {
        await onCreated()
      }

    } catch {
      setError(
        'Unable to connect to SeaTrack.'
      )

    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <section className="create-order">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="create-order-header">

        <div>

          <button
            type="button"
            className="create-order-back"
            onClick={onCancel}
          >
            ← Back to My Orders
          </button>


          <span className="create-order-label">
            NEW SHIPPING REQUEST
          </span>


          <h2>
            Create Shipping Order
          </h2>


          <p>
            Enter your cargo and route
            information. SeaTrack will review
            your request and prepare a quotation.
          </p>

        </div>


        <div className="create-order-status">

          <i></i>

          NEW REQUEST

        </div>

      </div>


      {/* =====================================
          FORM
      ====================================== */}

      <form
        className="create-order-form"
        onSubmit={handleSubmit}
      >

        {/* CARGO */}

        <div className="create-order-section">

          <div className="create-order-section-title">

            <span>01</span>

            <div>
              <small>CARGO INFORMATION</small>
              <h3>Tell us about your cargo</h3>
            </div>

          </div>


          <div className="create-order-fields">

            <div className="create-order-field create-order-field-wide">

              <label htmlFor="cargoType">
                Cargo Type
              </label>

              <input
                id="cargoType"
                name="cargoType"
                type="text"
                placeholder="Example: Electronics"
                value={form.cargoType}
                onChange={handleChange}
                required
              />

            </div>


            <div className="create-order-field">

              <label htmlFor="weight">
                Weight (kg)
              </label>

              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="5000"
                value={form.weight}
                onChange={handleChange}
                required
              />

            </div>


            <div className="create-order-field">

              <label htmlFor="volume">
                Volume (m³)
              </label>

              <input
                id="volume"
                name="volume"
                type="number"
                min="0"
                step="0.01"
                placeholder="25"
                value={form.volume}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>


        {/* ROUTE */}

        <div className="create-order-section">

          <div className="create-order-section-title">

            <span>02</span>

            <div>
              <small>SHIPPING ROUTE</small>
              <h3>Choose your maritime route</h3>
            </div>

          </div>


          <div className="create-order-fields create-order-route-fields">

            <div className="create-order-field">

              <label htmlFor="originPort">
                Origin Port
              </label>

              <input
                id="originPort"
                name="originPort"
                type="text"
                placeholder="Example: Baku"
                value={form.originPort}
                onChange={handleChange}
                required
              />

            </div>


            <div className="create-order-route-arrow">
              →
            </div>


            <div className="create-order-field">

              <label htmlFor="destinationPort">
                Destination Port
              </label>

              <input
                id="destinationPort"
                name="destinationPort"
                type="text"
                placeholder="Example: Aktau"
                value={form.destinationPort}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>


        {/* SHIPPING */}

        <div className="create-order-section">

          <div className="create-order-section-title">

            <span>03</span>

            <div>
              <small>SHIPPING DETAILS</small>
              <h3>Complete your request</h3>
            </div>

          </div>


          <div className="create-order-fields">

            <div className="create-order-field">

              <label htmlFor="containerType">
                Container Type
              </label>

              <input
                id="containerType"
                name="containerType"
                type="number"
                min="1"
                step="1"
                value={form.containerType}
                onChange={handleChange}
                required
              />

              <small className="create-order-hint">
                Enter the required container type number.
              </small>

            </div>


            <div className="create-order-field create-order-field-wide">

              <label htmlFor="desiredShippingDate">
                Desired Shipping Date
              </label>

              <input
                id="desiredShippingDate"
                name="desiredShippingDate"
                type="datetime-local"
                value={form.desiredShippingDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>

        </div>


        {/* MESSAGE */}

        {error && (
          <div className="create-order-message error">
            {error}
          </div>
        )}


        {success && (
          <div className="create-order-message success">
            {success}
          </div>
        )}


        {/* ACTIONS */}

        <div className="create-order-actions">

          <button
            type="button"
            className="create-order-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="create-order-submit"
            disabled={isSubmitting}
          >
            {
              isSubmitting
                ? 'Creating Order...'
                : 'Submit Shipping Request'
            }

            {!isSubmitting && (
              <span>→</span>
            )}
          </button>

        </div>

      </form>

    </section>
  )
}


export default CreateShippingOrder