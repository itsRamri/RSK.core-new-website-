import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_tic5x78',
  TEMPLATE_ID: 'template_dzb2lws',
  PUBLIC_KEY: 'vZcvJT10sMTLDBf-Q'
};

export const ContactSection = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [copiedField, setCopiedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      if (onShowToast) onShowToast(`Copied to clipboard: ${text}`, 'success');
      setTimeout(() => setCopiedField(null), 2500);
    }).catch(() => {
      if (onShowToast) onShowToast(`Contact: ${text}`, 'info');
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      const errMsg = 'Please fill in all required fields (Name, Email, Message).';
      if (onShowToast) onShowToast(errMsg, 'error');
      setFormStatus({ message: errMsg, type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const errMsg = 'Please enter a valid email address (e.g. name@example.com).';
      if (onShowToast) onShowToast(errMsg, 'error');
      setFormStatus({ message: errMsg, type: 'error' });
      return;
    }

    const now = new Date();
    const timeFormatted = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const templateParams = {
      name,
      email,
      subject: subject || 'Portfolio Inquiry',
      message: `Subject: ${subject || 'General Inquiry'}\nEmail: ${email}\n\nMessage:\n${message}`,
      time: timeFormatted,
      reply_to: email
    };

    setIsSubmitting(true);
    setFormStatus({ message: 'Sending message to Ramri Shubham Kumar...', type: 'info' });

    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200 || response.text === 'OK') {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFormStatus({
          message: '✓ Thank you! Your message has been sent successfully.',
          type: 'success'
        });
        if (onShowToast) onShowToast(`Thank you ${name}! Your message has been sent.`, 'success');
        setTimeout(() => setFormStatus({ message: '', type: '' }), 6000);
      } else {
        throw new Error(`EmailJS status: ${response.status}`);
      }
    } catch (err) {
      console.warn('EmailJS fallback triggered:', err);
      window.open(
        `mailto:rsk149652@gmail.com?subject=${encodeURIComponent(subject || "Portfolio Inquiry from " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nTime: " + timeFormatted + "\n\nMessage:\n" + message)}`,
        '_blank'
      );
      setFormStatus({
        message: '✓ Opening direct mail client (rsk149652@gmail.com) to complete transmission.',
        type: 'success'
      });
      if (onShowToast) onShowToast('Opening email client to send message...', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-paper-plane"></i> LET'S CONNECT
          </span>
          <h2 className="section-title">Get in <span className="highlight">Touch</span></h2>
          <p className="section-desc">
            Have a project idea, design inquiry, or opportunity? Drop a message below or email directly.
          </p>
        </div>

        <div className="contact-modern-grid">
          
          {/* Left Column: Direct Contact Info */}
          <div className="contact-info-col" data-reveal>
            
            {/* Email Card */}
            <div className="contact-card-item glass-card">
              <div className="contact-card-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">Direct Email</span>
                <a href="mailto:rsk149652@gmail.com" className="contact-card-value">
                  rsk149652@gmail.com
                </a>
              </div>
              <button
                type="button"
                className="contact-copy-btn"
                title="Copy Email"
                onClick={() => handleCopy('rsk149652@gmail.com', 'email')}
              >
                {copiedField === 'email' ? (
                  <i className="fa-solid fa-check" style={{ color: '#10b981' }}></i>
                ) : (
                  <i className="fa-regular fa-copy"></i>
                )}
              </button>
            </div>

            {/* Location Card */}
            <div className="contact-card-item glass-card">
              <div className="contact-card-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="contact-card-content">
                <span className="contact-card-label">Location</span>
                <span className="contact-card-value">
                  Bihar (Dhamaul), India
                </span>
              </div>
            </div>

            {/* Availability Note Card */}
            <div className="contact-card-item glass-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <span className="status-green-dot"></span>
                <span>Open for Inquiries &amp; Collaborations</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Feel free to email directly at <strong>rsk149652@gmail.com</strong> for project discussions, design work, or technical collaborations.
              </p>
            </div>

          </div>

          {/* Right Column: Sleek Message Form */}
          <div className="contact-form-col" data-reveal>
            <div className="contact-form-card glass-card">
              
              <div className="form-card-header">
                <h3 className="form-card-title">Send a Message</h3>
                <p className="form-card-subtitle">Fill out the details below and I'll respond as soon as possible.</p>
              </div>

              <form className="modern-contact-form" onSubmit={handleSubmit}>
                <div className="form-grid-2col">
                  
                  <div className="form-group-item">
                    <label htmlFor="name" className="form-item-label">
                      Your Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Saurav Sharma"
                      className="form-item-input"
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label htmlFor="email" className="form-item-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@example.com"
                      className="form-item-input"
                      required
                    />
                  </div>

                </div>

                <div className="form-group-item">
                  <label htmlFor="subject" className="form-item-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Project Inquiry / Opportunity"
                    className="form-item-input"
                  />
                </div>

                <div className="form-group-item">
                  <label htmlFor="message" className="form-item-label">
                    Your Message <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your project, question, or opportunity..."
                    className="form-item-textarea"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="form-submit-pill-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </>
                  )}
                </button>

                {formStatus.message && (
                  <div className={`form-feedback-message ${formStatus.type}`}>
                    {formStatus.message}
                  </div>
                )}
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
