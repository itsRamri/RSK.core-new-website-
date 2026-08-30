/**
 * RSK Portfolio - EmailJS Contact Module
 * Service ID: service_tic5x78
 * Template ID: template_dzb2lws
 * Public Key: vZcvJT10sMTLDBf-Q
 */

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_tic5x78',
  TEMPLATE_ID: 'template_dzb2lws',
  PUBLIC_KEY: 'vZcvJT10sMTLDBf-Q'
};

function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const callInput = document.getElementById('call');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const call = callInput ? callInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !call || !email || !message) {
      showToast('Please fill all required fields (Name, Call, Email, Message).', 'error');
      return;
    }

    // Format current timestamp
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

    // Template parameters for EmailJS template_dzb2lws
    const templateParams = {
      name: name,
      call: call,
      phone: call,
      email: email,
      message: `Contact/Call: ${call}\nEmail: ${email}\n\nMessage Payload:\n${message}`,
      time: timeFormatted,
      reply_to: email
    };

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching via EmailJS...';
    if (status) {
      status.className = 'form-status';
      status.textContent = 'Transmitting signal to Ramri Shubham Kumar...';
    }

    try {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS SDK not loaded');
      }

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200 || response.text === 'OK') {
        form.reset();
        if (status) {
          status.className = 'form-status success';
          status.textContent = '✓ Message Sent Successfully via EmailJS! I will reach out soon.';
          setTimeout(() => { status.textContent = ''; }, 7000);
        }
        showToast(`Thank you ${name}! Your message & contact info has been sent.`, 'success');
      } else {
        throw new Error(`EmailJS responded with status: ${response.status}`);
      }
    } catch (err) {
      console.warn('EmailJS error, triggering fallback:', err);
      
      // Direct Mailto Fallback
      window.open(
        `mailto:rsk149652@gmail.com?subject=${encodeURIComponent("Portfolio Message from " + name)}&body=${encodeURIComponent("Name: " + name + "\nCall/Phone: " + call + "\nEmail: " + email + "\nTime: " + timeFormatted + "\n\nMessage:\n" + message)}`,
        '_blank'
      );

      if (status) {
        status.className = 'form-status success';
        status.textContent = '✓ Opening email client for direct transmission.';
      }
      showToast('Opening default mail client to dispatch message...', 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message (EmailJS)';
    }
  });
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${msg}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`, 'success');
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: #22c55e;"></i>';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initContactForm();
  initCopyButtons();
});
