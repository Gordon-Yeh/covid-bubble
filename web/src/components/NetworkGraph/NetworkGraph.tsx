import React, { useState } from 'react';
import GraphNode from './GraphNode';
import './NetworkGraph.scss';
import colors from 'data/colors.json';

interface Link {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  source: string;
  target: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  data: object;
}

export default function NetworkGraph({
  network, root, width, height, linkWidth, nodeRad
}) {
  const [ nodes, links ] = getInitalPlacements(network, root, width, height)
  const [ selectedNodeId, setSelectedNodeId ] = useState(null);

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
    if (link.source === selectedNodeId || link.target === selectedNodeId)
      return colors.secondary;
    else
      return colors.dark;
  }

  return (
    <svg width={width} height={height} overflow="auto">
      {links.map((link, index) =>(
        <line
          x1={link.x1}
          y1={link.y1}
          x2={link.x2}
          y2={link.y2}
          key={`line-${index}`}
          strokeWidth={linkWidth}
          stroke={getLinkColor(link)}
        />
      ))}
      {nodes.map((node, index) =>(
        <GraphNode
          radius={nodeRad}
          x={node.x}
          y={node.y}
          color={getNodeColor(node)}
          key={index}
          onClick={() => setSelectedNodeId(node.id)}
        />
      ))}
    </svg>
  );
}

function getInitalPlacements(graph, root, width, height) : [ Node[], Link[] ] {
  const center = [width/2, height/2],
      vert:string[] = Object.keys(graph),
      cirRadius = 100

  root = root ? root : vert[Math.floor(Math.random() * vert.length)];

  let lvl = 1,
      queue:string[] = [root.id],
      visited = {
        [root.id]: { id: root.id, x: center[0], y: center[1] }
      };

  let _nodes:Node[] = [
        { id: root.id, x: center[0], y: center[1], data: {...root} }
      ],
      _links:Link[] = [];

  // perform dfs starting at root
  while (queue.length > 0) {
    let n = queue.length;
    let childrenOnLvl = queue
          .map(p => graph[p] === undefined ?  0 : graph[p].length)
          .reduce((pv, v) => pv + v, 0);
    let childrenVisted = 0;

    for (let i = 0; i < n; i++) {
      let parent = queue.shift();
      console.log('checking node:', parent);
      if (parent === undefined || graph[parent] === undefined)
        continue;
      let parentN = visited[parent];

      // traverse through the children of the parent
      for (let j = 0; j < graph[parent].length; j++) {
        let child = graph[parent][j];
        console.log('child:', child);
        let childN;
        // only create a graph node if the child hasn't been visited
        if (!visited[child.id]) {
          let angle = (2 * Math.PI / childrenOnLvl) * childrenVisted++;
          let x = center[0] + Math.sin(angle) * (cirRadius * lvl);
          let y = center[1] + Math.cos(angle) * (cirRadius * lvl);
          console.log(`position (${x}, ${y})`);

          childN = {
            id: child.id, x, y, data: {
              ...child
            }
          };
          _nodes.push(childN);
          queue.push(child.id);
          visited[child.id] = childN;
        } else {
          console.log('already visited');
          childN = visited[child.id];
        }
        // always create a link from parent -> child
        _links.push({
          source: parent, target: child.id,
          x1: parentN.x, y1: parentN.y,
          x2: childN.x, y2: childN.y
        });
      }
    }
    lvl++;
  }

  return [ _nodes, _links ]
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
  network: {}
};
