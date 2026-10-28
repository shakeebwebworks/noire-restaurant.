export default function StateMessage({ title, text, onRetry }) {
  return (
    <div className="state-box" role="status">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {onRetry && (
        <button type="button" className="btn-noire-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}