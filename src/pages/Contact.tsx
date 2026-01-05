import { useState, FormEvent } from 'react'
import emailjs from '@emailjs/browser'

// EmailJS configuratie - vul je eigen keys in
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Naam validatie
    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Naam moet minimaal 2 karakters zijn'
    }

    // Email validatie
    if (!formData.email.trim()) {
      newErrors.email = 'Email is verplicht'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Voer een geldig emailadres in'
    }

    // Bericht validatie
    if (!formData.message.trim()) {
      newErrors.message = 'Bericht is verplicht'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Bericht moet minimaal 10 karakters zijn'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'matthi.goossens@gmail.com'
        },
        EMAILJS_PUBLIC_KEY
      )

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="container">
      <h1>Contact</h1>
      <p className="page-intro">Neem gerust contact met ons op!</p>

      {submitStatus === 'success' && (
        <div className="alert alert-success">
          Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-error">
          Er ging iets mis bij het verzenden. Probeer het later opnieuw.
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Naam *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            placeholder="Je naam"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            placeholder="je@email.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Bericht *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'input-error' : ''}
            placeholder="Je bericht..."
            rows={5}
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verzenden...' : 'Verstuur bericht'}
        </button>
      </form>

      <div className="contact-info">
        <h2>Of bereik ons via:</h2>
        <ul className="contact-list">
          <li>Email: matthi.goossens@gmail.com</li>
          <li>Telefoon: +31 6 12345678</li>
        </ul>
      </div>
    </div>
  )
}

export default Contact
