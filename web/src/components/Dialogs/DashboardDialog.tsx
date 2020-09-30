import React from 'react';

export default function DashboardDialog({
  bubbleSize, onAddNode
}) {
  return (
    <div className="text-left h5">
      <p>
        There's currently&nbsp;
        <span className="text-primary text-decoration-underline">
          {bubbleSize}
        </span>
        &nbsp;person in your bubble.
      </p>
      <p>
        <button
          type="button"
          className="btn btn-primary mr-3"
          onClick={onAddNode}
        >
          Add more
        </button>by construction in JavaScript it is not implemented as text but as binary. There is no reason to show the binary code that implements that function because it is not readable and it might not even be available
      </p>
    </div>
  )
};

DashboardDialog.defaultProps = {
  bubbleSize: 1,
  onAddNode: () => {}
};
