import React, { useState } from 'react';
import GraphNode from './GraphNode';
import './NetworkGraph.scss';

export default function NetworkGraph(props) {
  const data = getInitalPlacements(props.graph, props.root, props.width, props.height)
  const [ links, setLinks ] = useState(data.links);
  const [ nodes, setNodes ] = useState(data.nodes);
  const [ selectedNode, setSelectedNode ] = useState(null);

  return (
    <svg width={props.width} height={props.height} overflow="auto">
      {links.map((link, index) =>(
        <line
          x1={link.x1}
          y1={link.y1}
          x2={link.x2}
          y2={link.y2}
          key={`line-${index}`}
          strokeWidth={props.linkWidth}
          stroke={link.source == selectedNode || link.target == selectedNode ? "red" : "black"}
        />
      ))}
      {nodes.map((node, index) =>(
        <GraphNode
          radius={props.nodeRad}
          x={node.x}
          y={node.y}
          active={node.id === selectedNode}
          key={index}
          onClick={() => setSelectedNode(node.id)}
        />
      ))}
    </svg>
  );
}

function getInitalPlacements(graph, root, width, height) {
  let center = [width/2, height/2],
      vert:string[] = Object.keys(graph);
  root = root ? root : vert[Math.floor(Math.random() * vert.length)];
  let queue:string[] = [root],
      _nodes:Object[] = [],
      _links:Object[] = [],
      lvl = 1,
      cirRadius = 100,
      visited = {
        [root]: { id: root, x: center[0], y: center[1] }
      };

  // perform dfs starting at root
  while (queue.length > 0) {
    let n = queue.length;
    for (let i = 0; i < n; i++) {
      let parent = queue.shift();
      console.log('checking node:', parent);
      if (parent === undefined)
        continue;

      let parentN = visited[parent];
      for (let j = 0; j < graph[parent].length; j++) {
        let child = graph[parent][j];
        console.log('child:', child);
        let childN;
        if (!visited[child]) {
          let angle = j * (2 * Math.PI / graph[parent].length);
          let x = center[0] + Math.sin(angle) * (cirRadius * lvl);
          let y = center[1] + Math.cos(angle) * (cirRadius * lvl);
          console.log(`position (${x}, ${y})`);

          childN = {
            id: child, x, y,
          };
          _nodes.push(childN);
          queue.push(child);
          visited[child] = childN;
        } else {
          console.log('already visited');
          childN = visited[child];
        }
        _links.push({
          source: parent, target: child,
          x1: parentN.x, y1: parentN.y,
          x2: childN.x, y2: childN.y
        });
      }
    }
    lvl++;
  }

  return {
    nodes: _nodes,
    links: _links
  }
}

NetworkGraph.defaultProps = {
  width: 500,
  height: 500,
  center: [0, 0],
  linkDistance: 10,
  forceStrength: -20,
  nodeRad: 30,
  linkWidth: 2,
  root: null,
  graph: {}
};
