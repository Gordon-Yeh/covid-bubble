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
  const [ nodes, links ] = getNodePlacements(network, root, width, height)
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
    <div className="graph">
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
            label={node.id}
            x={node.x}
            y={node.y}
            color={getNodeColor(node)}
            key={index}
            onClick={() => setSelectedNodeId(node.id)}
          />
        ))}
      </svg>
    </div>
  );
}

interface DBNode {
  id: string;
}

type range = [number, number];

function getNodePlacements(graph, root, width, height) : [ Node[], Link[] ] {
  const center:range = [width/2, height/2],
      vert:string[] = Object.keys(graph),
      orbitRadius = 100

  root = root ? root : vert[Math.floor(Math.random() * vert.length)];
  let rNode: Node = { id: root.id, x: center[0], y: center[1], data: {...root} },
      visited = {
        [root.id]: rNode
      };

  let _nodes:Node[] = [ rNode ],
      _links:Link[] = [];

  getNodePos(graph, root.id, _nodes, _links, visited, [0, 2*Math.PI], 1, orbitRadius, center);

  return [ _nodes, _links ];
}


function getNodePos(
  graph: {[key:string]: DBNode[]}, nodeId: string,
  nodes: Node[], links: Link[], visited: {[key:string]: Node},
  partition: range,
  level: number, orbitRadius: number,
  center: range
) {
  console.log(`level=${level}, checking node: ${nodeId}`);
  if (nodeId === undefined || graph[nodeId] === undefined)
    return;
  let pNode = visited[nodeId];
  let children = graph[nodeId];
  let toVisit:string[] = [];
  for (let i = 0; i < children.length; i++) {
    let c = children[i];
    console.log(`parent: ${nodeId}, child: ${c.id}`);
    let cNode: Node;
    if (!visited[c.id]) {
      let slice = (partition[1] - partition[0]) / children.length;
      let angle = (i+1)*slice;
      let x = center[0] + Math.sin(angle-slice/2) * orbitRadius * Math.pow(level, 1.3);
      let y = center[1] + Math.cos(angle-slice/2) * orbitRadius * Math.pow(level, 1.3);
      console.log(`position (${x}, ${y})`);
      cNode = {
        id: c.id, x, y, data: {
          ...c
        }
      };
      nodes.push(cNode);
      visited[c.id] = cNode;
      toVisit.push(c.id);
    } else {
      cNode = visited[c.id];
      console.log('already visited');
    }
    links.push({
      source: nodeId, target: c.id,
      x1: pNode.x, y1: pNode.y,
      x2: cNode.x, y2: cNode.y
    });
  }

  let slice = (partition[1] - partition[0]) / children.length;
  for (let i = 0; i < toVisit.length; i++) {
    getNodePos(graph, toVisit[i], nodes, links, visited, [slice*i, slice*(i+1)], level+1, orbitRadius, center);
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
  network: {}
};
