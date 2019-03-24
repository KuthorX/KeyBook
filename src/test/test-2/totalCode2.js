import React, { useState } from 'react';

function Text(props) {
    const name = props.data.name;

    return (
        <div>
            <p>{name}</p>
            <input type="text" aria-label="Label" defaultValue={name} />
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
