import React from 'react';

export const ToastContainer = ({ toasts }) => {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
