import React, { useState } from 'react';

function Text(props) {
  const name = props.data.name;

  function handleChange(event) {
    let value = event.target.value;
    props.handleTextChange(value);
  }

  return (
    <div>
      <p>{name}</p>
      <input type="text" aria-label="Label" value={props.data.name} onChange={handleChange} />
    </div>
  )
}


function App() {
  const [detailData, setDetailData] = useState({ "name": "This is titleA" });

  function changeTitle() {
    setDetailData({ "name": "This is titleB" });
  }

  function handleTextChange(value) {
    setDetailData({ "name": value });
  }

  return (
    <div>
      <Text data={detailData} handleTextChange={handleTextChange}/>
      <button onClick={changeTitle}>change it</button>
    </div>
  )
}

export default App;
