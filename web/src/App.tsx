import React, { useState } from 'react';
import NetworkGraph from './components/NetworkGraph';
import DialogBox from './containers/DialogBox';
import './App.scss';


function App() {
  const [ network, setNetwork ] = useState({});
  const [ selectedNode, setSelectedNode ] = useState(null);
  const [ user, setUser ] = useState({});

  return (
    <div className="App">
      <DialogBox
        selectedNode={selectedNode}
        bubbleSize={Object.keys(network).length}
        setNetwork={setNetwork}
        setUser={setUser}
      />
      <NetworkGraph 
        height={window.outerHeight}
        width={window.outerWidth}
        root={user.userId}
        network={network}>
      </NetworkGraph>
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
