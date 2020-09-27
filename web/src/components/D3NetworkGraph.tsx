import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

export default function NetworkGraph(props) {
  const [nodes, setNodes] = useState(props.nodes);
  const [links, setLinks] = useState(props.links);
  
  useEffect(() => {
    let simNodes = [...props.nodes];
    let simLinks = [...props.links];

    let sim = d3.forceSimulation(simNodes)
      .force('charge',
          d3.forceManyBody().strength(props.forceStrength))
      .force('link',
          d3.forceLink().distance(props.linkDistance).links(simLinks).id(d => d.id))
      .force("x", d3.forceX(props.width / 2))
      .force("y", d3.forceY(props.height / 2));
    sim.stop();
    let interval = setInterval(() => {
      sim.tick();
      setNodes([...simNodes]);
      setLinks([...simLinks]);
    }, 50);

    return () => clearInterval(interval);
  });

  return (
    <svg width={props.width} height={props.height}>
      {links.map((link, index) =>(
        <line
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          key={`line-${index}`}
          stroke="black" />
      ))}
      {nodes.map((node, index) =>(
        <circle r={props.nodeRadius} cx={node.x} cy={node.y} fill="red" key={index}/>
      ))}
    </svg>
  );
}

NetworkGraph.defaultProps = {
  width: 500,
  height: 500,
  linkDistance: 10,
  forceStrength: -20,
  nodeRadius: 5
};
