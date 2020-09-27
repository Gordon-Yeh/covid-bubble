import React from 'react';

export default function GraphNode({
  radius, active, x, y, onClick
}) {

  function handleMouseOver(e) {
    let target = e.target as Element;
    target.setAttribute('r', radius+1)
  }

  function handleMouseOut(e) {
    let target = e.target as Element;
    target.setAttribute('r', radius)
  }

  return (
    <circle
      className="node"
      r={radius}
      cx={x}
      cy={y}
      fill={active ? "red" : "black"}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={onClick}
    />
  )
}

GraphNode.defaultProps = {
  radius: 30,
  active: false,
  onClick: () => {},
  x: 0,
  y: 0
};
