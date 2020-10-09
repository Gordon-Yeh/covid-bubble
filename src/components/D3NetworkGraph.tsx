import React, { useRef, useEffect } from 'react';
import colors from 'data/colors.json';
import * as d3 from 'd3';
import './D3NetworkGraph.scss';

interface Link {
  source: string;
  target: string;
}

interface Node {
  id: string;
  data: object;
}

export default function NetworkGraph({
  width, height, graph, root,
  linkDistance, forceStrength, nodeRadius, linkWidth,
  setSelectedNode
}) {
  // const [ selectedNode, setSelectedNode ] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const [ nodes, links ] = parseGraph(graph, root);
    const svg = d3.select(svgRef.current);
    let selectedNodeId = null;

    console.log('nodes:', nodes);
    console.log('links:', links);

    function getNodeColor(node) : string {
      switch(node.id) {
        case root.id:
          return colors.primary;
        case selectedNodeId:
          return colors.secondary;
        default:
          return colors.dark;
      }
    }

    function getLinkColor(link) : string {
      if (link.source.id === selectedNodeId || link.target.id === selectedNodeId)
        return colors.secondary;
      else
        return colors.dark;
    }
  

    const simulation = d3.forceSimulation(nodes)
      .force('charge',
          d3.forceManyBody().strength(forceStrength))
      .force("link",
          d3.forceLink(links).distance(linkDistance).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", linkWidth)
        .attr("stroke", getLinkColor);

    const nodeGroup = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g");

    const node = nodeGroup
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", getNodeColor)
      .call(onDrag(simulation))
      .on('click', function(this, event, d) {
        console.log('click', this, d)
        selectedNodeId = d.id;
        setSelectedNode(d.data);
      });

    const label = nodeGroup
      .append('text')
      .text(d => d.data && d.data.name ? d.data.name : d.id)
      .attr('text-anchor', 'middle')
      .attr('stroke-width', '1px');

    node.append("title")
      .text(d => d.id);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)
          .attr('stroke', getLinkColor);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("fill", getNodeColor);
      
      label
          .attr('x', d => d.x)
          .attr('y', d => d.y)
    });

    return () => {
      simulation.stop();
      link.remove();
      nodeGroup.remove();
    };
  })
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      ref={svgRef}
    ></svg>
  );
}

function parseGraph(graph, root) : [ Node[], Link[] ] {
  if (root === null) {
    return [ [], [] ];
  }
  
  let _nodes:Node[] = [{ id: root.id, data: {...root, name: 'You'} }],
      _links:Link[] = [],
      queue = [ root.id ],
      visited = new Set();
  
  while (queue.length > 0) {
    let pId = queue.shift();
    console.log('parent:', pId);
    if (pId === undefined || graph[pId] === undefined || visited.has(pId))
      continue;
    let children = graph[pId];
    console.log('children:', children);
    visited.add(pId);
    for (let i = 0; i < children.length; i++) {
      let c = children[i];
      if (!visited.has(c.id)) {
        _nodes.push({ id: c.id, data: { ...c } });
        queue.push(c.id);
      }
      _links.push({ source: pId, target: c.id });
    }
    console.log('queue:', queue);
  }

  console.log('_nodes:', _nodes);
  console.log('_links:', _links);
  return [ _nodes, _links ];
}

function onDrag(sim) {
  function dragstarted(event) {
    if (!event.active) sim.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) sim.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

NetworkGraph.defaultProps = {
  // state
  graph: {},
  root: null,

  // callback
  setSelectedNode: () => {},

  // styles
  width: 500,
  height: 500,
  linkDistance: 300,
  forceStrength: -20,
  nodeRadius: 40,
  linkWidth: 3,
};
