import React from 'react';

export default function DashboardDialog({
  bubbleSize, onAddNode
}) {
  return (
    <div className="text-left h6">
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
        </button>
      </p>
    </div>
  )
};

DashboardDialog.defaultProps = {
  bubbleSize: 1,
  onAddNode: () => {}
};
