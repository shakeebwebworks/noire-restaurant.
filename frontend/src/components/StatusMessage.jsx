/**
 * Shared message block for empty and error states.
 * variant: 'empty' | 'error'
 */
function StatusMessage({ variant = 'empty', title, text, actionLabel, onAction }) {
  return (
    <div
      className={`status-message status-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {actionLabel && onAction && (
        <button type="button" className="btn-noire-outline" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StatusMessage;