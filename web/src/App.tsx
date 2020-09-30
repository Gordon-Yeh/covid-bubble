import React, { useState } from 'react';
import NetworkGraph from './components/NetworkGraph';
import DialogBox from './containers/DialogBox';
import './App.scss';

function App() {
  const [ network, setNetwork ] = useState(getNetwork());
  const [ selectedNode, setSelectedNode ] = useState(null);

  return (
    <div className="App">
      <DialogBox
        selectedNode={selectedNode}
        bubbleSize={Object.keys(network).length}
      />
      {/* <NetworkGraph 
        height={window.outerHeight + 1000}
        width={window.outerWidth + 1000}
        graph={graph}>
      </NetworkGraph> */}
    </div>
  );
}

function getNetwork() {
  const nodeCount = 20;
  const graph = {};
  for (let i = 0; i < nodeCount; i++) {
    graph[i] = [];
    let n = Math.floor(Math.random() * nodeCount/2);
    for (let j = 0; j < n; j++) {
      let target = Math.floor(Math.random() * nodeCount);
      if (target != j || !graph[i].includes(target))
        graph[i].push(Math.floor(Math.random() * nodeCount));
    }
  }
  return graph;
}

export default App;
