import React, { useState } from 'react';

function Text(props) {
  const [name, setName] = useState(props.data.name);

  function handleChange(event) {
    let name = event.target.value;
    setName(name);
  }

  return (
    <div>
      <p>{name}</p>
      <input type="text" aria-label="Label" value={name} onChange={handleChange} />
    </div>
  )
}


function App() {
  const [detailData, setDetailData] = useState({ "name": "This is titleA" });

  function changeTitle() {
    setDetailData({ "name": "This is titleB" });
  }

  return (
    <div>
      <Text data={detailData} />
      <button onClick={changeTitle}>change it</button>
    </div>
  )
}

export default App;
