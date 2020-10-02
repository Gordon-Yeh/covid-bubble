import React, { useState } from 'react';
import NetworkGraph from './components/NetworkGraph';
import DialogBox from './containers/DialogBox';
import './App.scss';

function App() {
  const [ selectedNode, setSelectedNode ] = useState(null);
  const [ user, setUser ] = useState({
    id: 'demo', email: 'demo@email.com', firstName: 'demo', lastName: 'demo', username: 'demo'
  });
  const [ bubble, setBubble ] = useState({ [user.id]: { ...user } });


  return (
    <div className="App">
      <DialogBox
        selectedNode={selectedNode}
        bubbleSize={Object.keys(bubble).length}
        setBubble={setBubble}
        setUser={setUser}
      />
      <NetworkGraph 
        height={window.outerHeight}
        width={window.outerWidth}
        root={user}
        network={bubble}>
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
