import "../styles/BoxGrid.css";

export default function BoxGrid({ boxes }) {
  return (
    <div className="box-grid-container">
      <div className="box-grid">
        {boxes.map((amount, index) => (
          <div
            key={index}
            className={`box ${amount !== null ? "assigned" : "empty"}`}
            title={
              amount !== null
                ? `Box ${index + 1}: ₹${amount.toLocaleString()}`
                : `Box ${index + 1}: Empty`
            }
          >
            <div className="box-number">{index + 1}</div>
            {amount !== null && (
              <div className="box-amount">₹{amount.toLocaleString()}</div>
            )}
            {amount !== null && <div className="box-assigned-dot" aria-hidden="true"></div>}
          </div>
        ))}
      </div>
      <div className="grid-legend">
        <div className="legend-item">
          <span className="legend-dot legend-dot-empty"></span>
          <span>Empty</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-dot-assigned"></span>
          <span>Assigned</span>
        </div>
      </div>
    </div>
  );
}
