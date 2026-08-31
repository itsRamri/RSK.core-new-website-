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
    call: '',
    email: '',
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
      onShowToast(`Copied to clipboard: ${text}`, 'success');
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, call, email, message } = formData;

    if (!name.trim() || !call.trim() || !email.trim() || !message.trim()) {
      onShowToast('Please fill all required fields (Name, Call, Email, Message).', 'error');
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
      call,
      phone: call,
      email,
      message: `Contact/Call: ${call}\nEmail: ${email}\n\nMessage Payload:\n${message}`,
      time: timeFormatted,
      reply_to: email
    };

    setIsSubmitting(true);
    setFormStatus({ message: 'Transmitting signal to Ramri Shubham Kumar...', type: 'info' });

    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200 || response.text === 'OK') {
        setFormData({ name: '', call: '', email: '', message: '' });
        setFormStatus({
          message: '✓ Message Sent Successfully via EmailJS! I will reach out soon.',
          type: 'success'
        });
        onShowToast(`Thank you ${name}! Your message & contact info has been sent.`, 'success');
        setTimeout(() => setFormStatus({ message: '', type: '' }), 7000);
      } else {
        throw new Error(`EmailJS status: ${response.status}`);
      }
    } catch (err) {
      console.warn('EmailJS error, triggering fallback:', err);
      window.open(
        `mailto:rsk149652@gmail.com?subject=${encodeURIComponent("Portfolio Message from " + name)}&body=${encodeURIComponent("Name: " + name + "\nCall/Phone: " + call + "\nEmail: " + email + "\nTime: " + timeFormatted + "\n\nMessage:\n" + message)}`,
        '_blank'
      );
      setFormStatus({
        message: '✓ Opening email client for direct transmission.',
        type: 'success'
      });
      onShowToast('Opening default mail client to dispatch message...', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-satellite-dish"></i> DIRECT TRANSMISSION
          </span>
          <h2 className="section-title">Get in <span className="highlight">Touch</span></h2>
          <p className="section-desc">
            Have an engineering opportunity, project idea, or discussion? Send a message directly to <strong>rsk149652@gmail.com</strong>.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Info Cards */}
          <div className="contact-cards-column" data-reveal>
            <div className="contact-info-card glass-card">
              <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
              <div className="contact-details">
                <span className="contact-label">Direct Email</span>
                <span className="contact-value">rsk149652@gmail.com</span>
              </div>
              <button
                className="copy-btn"
                title="Copy Email"
                onClick={() => handleCopy('rsk149652@gmail.com', 'email')}
              >
                {copiedField === 'email' ? (
                  <i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i>
                ) : (
                  <i className="fa-regular fa-copy"></i>
                )}
              </button>
            </div>

            <div className="contact-info-card glass-card">
              <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
              <div className="contact-details">
                <span className="contact-label">Phone & WhatsApp</span>
                <span className="contact-value">+91 7766939312</span>
              </div>
              <button
                className="copy-btn"
                title="Copy Phone"
                onClick={() => handleCopy('+91 7766939312', 'phone')}
              >
                {copiedField === 'phone' ? (
                  <i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i>
                ) : (
                  <i className="fa-regular fa-copy"></i>
                )}
              </button>
            </div>

            <div className="contact-info-card glass-card">
              <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div className="contact-details">
                <span className="contact-label">Hometown / State</span>
                <span className="contact-value">Bihar (Dhamaul), India</span>
              </div>
            </div>

            {/* Quick Connect Prompt Card */}
            <div className="glass-card direct-chat-card">
              <div className="chat-card-head">
                <span className="live-dot-green"></span>
                <span className="chat-signal-tag">RAPID TRANSMISSION</span>
              </div>
              <h4 className="chat-card-title">Direct WhatsApp Instant Connect</h4>
              <p className="chat-card-desc">Prefer real-time technical discussions or fast project consultations?</p>
              <a
                href="https://wa.me/917766939312?text=Hi%20Ramri%20Shubham%20Kumar,%20I%20am%20contacting%20you%20from%20your%20ECE%20Portfolio."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp-direct btn-glow"
              >
                <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="contact-form-column glass-card" data-reveal>
            <div className="form-header">
              <div className="form-header-badge">
                <i className="fa-solid fa-tower-broadcast"></i>
                <span>EMAILJS DISPATCH ACTIVE</span>
              </div>
              <h3>Send a Message</h3>
              <p>Direct transmission to Ramri Shubham Kumar's inbox.</p>
            </div>

            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name"><i className="fa-solid fa-user"></i> Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Saurav Sharma"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="call"><i className="fa-solid fa-phone"></i> Call / Phone No *</label>
                  <input
                    type="tel"
                    id="call"
                    name="call"
                    value={formData.call}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email"><i className="fa-solid fa-envelope"></i> Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message"><i className="fa-solid fa-message"></i> Message / Technical Inquiry *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your project, question, or opportunity..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                id="form-submit-btn"
                className="btn btn-primary btn-glow btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Dispatching via EmailJS...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Send Message (EmailJS)
                  </>
                )}
              </button>

              {formStatus.message && (
                <div className={`form-status ${formStatus.type === 'success' ? 'success' : ''}`}>
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
